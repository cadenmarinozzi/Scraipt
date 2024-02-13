// Setup dotenv before anything else to ensure environment variables are available
import { config } from 'dotenv';
config();

import { Node, parse, traverse } from '@babel/core';
import generate from '@babel/generator';
import { OpenAIAPI } from './modules/OpenAI';
import { FunctionDeclaration } from '@babel/types';
import {
	getSourceAtLine,
	createFunction,
	isValidJavaScript,
	parseSource,
} from './modules/codeProcessing';
import { createScraiptFolder, writeScraiptFile } from './modules/fileUtils';

const openai = new OpenAIAPI();

const isDebug = process.env.DEBUG === 'true';

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
    Transform the given source code to be more efficient and optimized using all available resources.
    * @param source The source code to transform.
    * @param path The path of the source code. If not provided, the source code will not be written to a file.
    * @returns The transformed source code.
*/
const transformSourceCode = async (source: string): Promise<string> => {
	if (!source) {
		return source;
	}

	const AST = parseSource(source);

	if (!AST) {
		return source;
	}

	const workers: (() => Promise<void>)[] = [];

	let transformedSource: string = source;

	traverse(AST, {
		// No need for asynchroneous execution as we can just run the code synchronously and wait for the result since we aren't modifying the AST
		enter(path) {
			const worker = async () => {
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

				const completionAST = parseSource(completion);

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

			workers.push(worker);
		},
	});

	await Promise.all(workers.map((worker) => worker()));

	// Check if the transformed code is valid javascript
	if (!isValidJavaScript(transformedSource)) {
		return source;
	}

	if (isDebug) {
		writeScraiptFile(__filename, transformedSource);
	}

	return transformedSource;
};

// Main webpack loader function
export default (source: string) => {
	if (isDebug) {
		createScraiptFolder();
	}

	return transformSourceCode(source);
};
