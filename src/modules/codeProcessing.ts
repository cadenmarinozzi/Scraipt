import { parse } from '@babel/core';

/**
    Get the source code at the given line number.
    * @param source The source code.
    * @param line The line number.
    * @returns The source code at the given line number.
*/
export const getSourceAtLine = (source: string, line: number): string => {
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
    Check if the given source code is valid JavaScript.
    * @param source The source code to check.
    * @returns True if the source code is valid JavaScript, false otherwise.
*/
export const isValidJavaScript = (source: string): boolean => {
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
export const createFunction = (
	name: string,
	params: string,
	transformedBody: string,
	originalBody: string
): string => {
	return `function ${name}(${params}) {\ntry\n${transformedBody}\ncatch (error)\n${originalBody}\n}`;
};
