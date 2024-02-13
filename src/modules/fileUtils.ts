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
    Create a folder for outputting the transformed source code.
*/
export const createScraiptFolder = () => {
	if (fs.existsSync('dist/scraipt')) {
		return;
	}

	fs.mkdirSync('dist/scraipt');
};

/**
 * Writes source data to a debug scraipt file
 * @param filePath The path of the file to write
 * @param data The data to write to the file
 * @returns
 */
export const writeScraiptFile = (filePath: string, data: string) => {
	const fileName: string | undefined = filePath.split('/').pop();

	if (!fileName) {
		return;
	}

	const sourcePath: string = path.join('dist', 'scraipt', fileName);

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
