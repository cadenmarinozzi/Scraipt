// Setup dotenv before anything else to ensure environment variables are available
import { config } from 'dotenv';
config();

import { Node, parse, traverse } from '@babel/core';
import generate from '@babel/generator';
import { OpenAIAPI } from './modules/OpenAI';
import fs from 'fs';
import path from 'path';
import { BlockStatement, FunctionDeclaration } from '@babel/types';

const openai = new OpenAIAPI();

const isDebug = process.env.DEBUG === 'true';

/**
    Get the source code at the given line number.
    * @param source The source code.
    * @param line The line number.
    * @returns The source code at the given line number.
*/
const getSourceAtLine = (source: string, line: number): string => {
	const lines: string[] = source.split('\n');
	const lineNumber: number = line - 1;

	if (lineNumber < 0) {
		return '';
	}

	if (lineNumber >= lines.length) {
		return '';
	}

	return lines[lineNumber];
};

/**
    If the line above the node contains a comment with the text "scraipt-pass", the node should be left as is.
    * @param node The node to check.
    * @param source The source code.
    * @returns True if the node should be left as is, false otherwise.
*/
const shouldPassNode = (node: Node, source: string): boolean => {
	if (!node ?? !node.loc) {
		return false;
	}

	const previousLine: string = getSourceAtLine(
		source,
		node.loc.start.line - 1
	);

	if (!previousLine) {
		return false;
	}

	return /(\/\*)|(\/\/)*(.*?scraipt-pass)/.test(previousLine);
};

/**
    Insert text before the last extension extension in the given path.
    * @param path The path to insert the text.
    * @param text The text to insert.
    * @returns The new path with the text inserted.
*/
const insertBeforeExtension = (
	path: string,
	text: string
): string | undefined => {
	const parts: string[] = path.split('.');
	const extension: string | undefined = parts.pop();

	if (!extension) {
		return;
	}

	const newPath: string = parts.join('.') + text + '.' + extension;

	return newPath;
};

/**
    Create a folder for outputting the transformed source code.
*/
const createScraiptFolder = () => {
	if (fs.existsSync('dist/scraipt')) {
		return;
	}

	fs.mkdirSync('dist/scraipt');
};

/**
    Check if the given source code is valid JavaScript.
    * @param source The source code to check.
    * @returns True if the source code is valid JavaScript, false otherwise.
*/
const isValidJavaScript = (source: string): boolean => {
	try {
		parse(source, {
			sourceType: 'module',
		});
	} catch (error) {
		return false;
	}

	return true;
};

/**
    Create a function with the given name, parameters, transformed body, and original body.
    * @param name The name of the function.
    * @param params The parameters of the function.
    * @param transformedBody The transformed body of the function.
    * @param originalBody The original body of the function.
    * @returns The function as a string.
*/
const createFunction = (
	name: string,
	params: string,
	transformedBody: string,
	originalBody: string
): string => {
	return `function ${name}(${params}) {\ntry\n${transformedBody}\ncatch (error)\n${originalBody}\n}`;
};

/**
    Transform the given source code to be more efficient and optimized using all available resources.
    * @param source The source code to transform.
    * @param path The path of the source code. If not provided, the source code will not be written to a file.
    * @returns The transformed source code.
*/
const transformSourceCode = async (
	source: string,
	path: string | undefined = undefined
): Promise<string> => {
	if (!source) {
		return source;
	}

	if (!path) {
		return source;
	}

	const AST = parse(source, {
		sourceType: 'module',
		plugins: ['@babel/plugin-syntax-jsx'],
	});

	if (!AST) {
		return source;
	}

	const workers: (() => Promise<void>)[] = [];

	let transformedSource: string = source;

	traverse(AST, {
		// No need for asynchroneous execution as we can just run the code synchronously and wait for the result
		enter(path) {
			const runner = async () => {
				// If the node is not a function, skip it
				if (!path.isFunctionDeclaration()) return;

				const node: Node = path.node;

				if (!node ?? !node.start ?? !node.end ?? !node.loc) {
					return;
				}

				// Get the actual source code of the node
				const nodeSource: string = source.substring(
					node.start,
					node.end
				);

				if (shouldPassNode(node, source)) {
					return;
				}

				// Generate the optimized version of the code
				const completion: string | undefined =
					await openai.createTextCompletion([
						{
							role: 'user',
							content: nodeSource,
						},
					]);

				if (!completion) {
					return;
				}

				const completionAST = parse(completion, {
					sourceType: 'module',
				});

				if (!completionAST) {
					return;
				}

				const completionFunctionAST: FunctionDeclaration = completionAST
					.program.body[0] as FunctionDeclaration;

				if (!completionFunctionAST) {
					return;
				}

				const completionBodyAST = completionFunctionAST.body;

				if (!completionBodyAST) {
					return;
				}

				const completionBody: string = generate(completionBodyAST).code;

				if (!completionBody) {
					return;
				}

				const originalNodeBodyAST = node.body;
				const originalNodeBody: string =
					generate(originalNodeBodyAST).code;

				// Get the source code of the function decleration
				const nodeFunctionDeclerationLine: string = getSourceAtLine(
					source,
					node.loc.start.line
				);

				// A litle janky but it works
				const originalParams: string = nodeFunctionDeclerationLine
					.split('(')[1]
					.split(')')[0];

				const nodeName: string | undefined = node.id?.name;

				if (!nodeName) {
					return;
				}

				const transformedNodeSource: string = createFunction(
					nodeName,
					originalParams,
					completionBody,
					originalNodeBody
				);

				// Replace the original source code with the optimized version
				transformedSource = source.replace(
					nodeSource,
					transformedNodeSource
				);
			};

			workers.push(runner);
		},
	});

	await Promise.all(workers.map((worker) => worker()));

	// Check if the transformed code is valid javascript
	if (!isValidJavaScript(transformedSource)) {
		return source;
	}

	if (isDebug) {
		// Write the transformed source code to a .scraipt file
		const scraiptPath: string | undefined = insertBeforeExtension(
			path,
			'.scraipt'
		);

		if (scraiptPath) {
			fs.writeFileSync(scraiptPath, transformedSource);
		}
	}

	return transformedSource;
};

export default (source: string) => {
	if (isDebug) {
		createScraiptFolder();

		if (!__filename) {
			return source;
		}

		const fileName: string | undefined = __filename.split('/').pop(); // TODO: DO NOT USE A HARD CODED OUTPUT DIR

		if (!fileName) {
			return source;
		}

		const sourcePath: string = path.join('dist', 'scraipt', fileName);

		if (!sourcePath) {
			return source;
		}

		return transformSourceCode(source, sourcePath);
	}

	return transformSourceCode(source);
};
