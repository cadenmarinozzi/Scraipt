import fs from 'fs';
import path from 'path';

/**
    Insert text before the last extension extension in the given path.
    * @param path The path to insert the text.
    * @param text The text to insert.
    * @returns The new path with the text inserted.
*/
export const insertBeforeExtension = (
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
	Get the scraipt build directory.
	* @param buildPath The path of the build directory.
	* @returns The scraipt build directory.
*/
const getScraiptDir = (buildPath: string | undefined): string => {
	if (!buildPath) {
		buildPath = 'dist';

		// If the default build path does not exist, and none is in the options, throw an error
		if (!fs.existsSync(buildPath)) {
			fs.mkdirSync(buildPath);
		}
	}

	return path.join(buildPath, 'scraipt');
};

/**
    Create a folder for outputting the transformed source code.
	* @param buildPath The path of the build directory.
*/
export const createScraiptFolder = (buildPath: string) => {
	const scraiptDir: string = getScraiptDir(buildPath);

	if (fs.existsSync(scraiptDir)) {
		return;
	}

	fs.mkdirSync(scraiptDir);
};

/**
 * Writes source data to a debug scraipt file
 * @param filePath The path of the file to write
 * @param data The data to write to the file
 * @returns
 */
export const writeScraiptFile = (
	filePath: string,
	data: string,
	buildPath: string
) => {
	const fileName: string | undefined = filePath.split('/').pop();

	if (!fileName) {
		return;
	}

	const scraiptDir: string = getScraiptDir(buildPath);

	const sourcePath: string = path.join(scraiptDir, fileName);

	if (!sourcePath) {
		return;
	}

	// Write the transformed source code to a .scraipt file
	const scraiptPath: string | undefined = insertBeforeExtension(
		sourcePath,
		'.scraipt'
	);

	if (!scraiptPath) {
		return;
	}

	fs.writeFileSync(scraiptPath, data);
};
