// Setup dotenv before anything else to ensure environment variables are available
import { config } from 'dotenv';
config();

import { Node, NodePath, traverse } from '@babel/core';
import generate from '@babel/generator';
import { OpenAIAPI } from './modules/OpenAI/OpenAI';
import { FunctionDeclaration } from '@babel/types';
import {
	getSourceAtLine,
	createFunction,
	isValidJavaScript,
	parseSource,
} from './modules/codeProcessing';
import { createScraiptFolder, writeScraiptFile } from './modules/fileUtils';
import { Cache } from './modules/cache';
import chalk from 'chalk';

const openai = new OpenAIAPI();
const cache = new Cache();

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
const transformSourceCode = async (
	source: string,
	options: any,
	resourcePath: string
): Promise<string> => {
	if (!source || !options || !resourcePath) {
		return source;
	}

	// Setup OpenAI parameters
	const model: string = options.model ?? 'gpt-4';
	openai.maxTokenCount = options.maxTokens;

	// Only include files listed in the include option
	if (options.include) {
		for (const include of options.include) {
			if (!resourcePath.includes(include)) {
				return source;
			}

			// TODO: minimatch for glob patterns
			// if (!minimatch(resourcePath, include)) {
			// 	return source;
			// }
		}
	}

	const AST = parseSource(source);

	if (!AST) {
		return source;
	}

	const workers: (() => Promise<void>)[] = [];

	let transformedSource: string = source;

	traverse(AST, {
		// No need for asynchroneous execution as we can just run the code synchronously and wait for the result since we aren't modifying the AST
		enter(path: NodePath) {
			const worker = async () => {
				const isArrowFunction: boolean =
					path.isArrowFunctionExpression();

				// If the node is not a function, skip it
				if (!path.isFunctionDeclaration() && !isArrowFunction) return;

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

				// Check for the node in the cache
				const cachedNode: string | undefined = cache.get(nodeSource);

				if (cachedNode) {
					transformedSource = source.replace(nodeSource, cachedNode);

					return;
				}

				// Source with the node removed
				// TODO: This is a bit janky, we should use the AST to remove the node instead of using string manipulation
				const sourceContext: string = source.replace(nodeSource, '');

				if (options.dryRun) {
					return;
				}

				// Generate the optimized version of the code
				const completion: string | undefined =
					await openai.createTextCompletion(
						sourceContext,
						nodeSource,
						model
					);

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

				const originalNodeBodyAST = (<FunctionDeclaration>node).body;
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

				let nodeName: string | undefined;

				if (!isArrowFunction) {
					nodeName = (<FunctionDeclaration>node).id?.name;
				}

				const transformedNodeSource: string = createFunction(
					nodeName,
					originalParams,
					completionBody,
					originalNodeBody,
					isArrowFunction
				);

				// Replace the original source code with the optimized version
				transformedSource = source.replace(
					nodeSource,
					transformedNodeSource
				);

				// Add to the cache
				cache.set(nodeSource, transformedNodeSource);
			};

			workers.push(worker);
		},
	});

	await Promise.all(workers.map((worker) => worker()));

	// Check if the transformed code is valid javascript
	if (!isValidJavaScript(transformedSource)) {
		return source;
	}

	if (options.debug) {
		writeScraiptFile(resourcePath, transformedSource, options.buildPath);
	}

	if (options.dryRun) {
		console.log(
			`${chalk.blue('Scraipt')} Would have wrote: ${resourcePath}`
		);

		return source;
	}

	return transformedSource;
};

// Main webpack loader function
module.exports = function (source: string) {
	// Not sure why but "this" needs to be casted to "any" to avoid type errors
	const options = (<any>this).getOptions();
	const resourcePath = (<any>this).resourcePath;

	if (options.debug) {
		createScraiptFolder(options.buildPath);
	}

	return transformSourceCode(source, options, resourcePath);
};
