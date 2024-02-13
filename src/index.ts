// Setup dotenv before anything else to ensure environment variables are available
import { config } from 'dotenv';
config();

import { Node, parse, traverse } from '@babel/core';
import { OpenAIAPI } from './modules/OpenAI';
import fs from 'fs';
import path from 'path';

const openai = new OpenAIAPI();

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

	const lines = source.split('\n');
	const lineNumber = node.loc.start.line - 1;

	if (lineNumber < 0) {
		return false;
	}

	if (lineNumber >= lines.length) {
		return false;
	}

	const previousLine = lines[lineNumber - 1];

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
const insertBeforeExtension = (path: string, text: string): string => {
	const parts = path.split('.');
	const extension = parts.pop();
	const newPath = parts.join('.') + text + '.' + extension;

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
    Transform the given source code to be more efficient and optimized using all available resources.
    * @param source The source code to transform.
    * @param path The path of the source code.
    * @returns The transformed source code.
*/
const transformSourceCode = async (
	source: string,
	path: string
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

				const node = path.node;

				if (!node ?? !node.start ?? !node.end) {
					return;
				}

				// Get the actual source code of the node
				const nodeSource = source.substring(node.start, node.end);

				if (shouldPassNode(node, source)) {
					return;
				}

				// Generate the optimized version of the code
				const completion = await openai.createTextCompletion([
					{
						role: 'user',
						content: nodeSource,
					},
				]);

				if (!completion) {
					return;
				}

				// Replace the original source code with the optimized version
				transformedSource = source.replace(nodeSource, completion);
			};

			workers.push(runner);
		},
	});

	await Promise.all(workers.map((worker) => worker()));

	// Check if the transformed code is valid javascript
	if (!isValidJavaScript(transformedSource)) {
		return source;
	}

	// Write the transformed source code to a .scraipt file
	// const scraiptPath = insertBeforeExtension(path, '.scraipt');
	// fs.writeFileSync(scraiptPath, transformedSource);

	return transformedSource;
};

export default (source: string) => {
	// createScraiptFolder();

	const fileName = __filename.split('/').pop(); // TODO: DO NOT USE A HARD CODED OUTPUT DIR

	if (!fileName) {
		return source;
	}

	const sourcePath = path.join('dist', 'scraipt', fileName);

	if (!sourcePath) {
		return source;
	}

	return transformSourceCode(source, sourcePath);
};
