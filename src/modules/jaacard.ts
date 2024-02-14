/**
 * Calculate the intersection of two arrays
 * @param {number[]} a - The first array
 * @param {number[]} b - The second array
 * @returns The intersection of the two arrays
 */
const intersection = (a: number[], b: number[]): Array<number> => {
	const setA: Set<number> = new Set(a);
	const setB: Set<number> = new Set(b);
	const intersection: Set<number> = new Set(
		[...setA].filter((x) => setB.has(x))
	);

	return Array.from(intersection);
};

/**
 * Calculate the union of two arrays
 * @param {number[]} a - The first array
 * @param {number[]} b - The second array
 * @returns The union of the two arrays
 * */
const union = (a: number[], b: number[]): Array<number> => {
	const setA: Set<number> = new Set(a);
	const setB: Set<number> = new Set(b);
	const union: Set<number> = new Set([...setA, ...setB]);

	return Array.from(union);
};

/**
 * Calculate the difference of two arrays
 * @param {number[]} a - The first array
 * @param {number[]} b - The second array
 * @returns The difference of the two arrays
 * */
const difference = (a: number[], b: number[]): Array<number> => {
	const setA: Set<number> = new Set(a);
	const setB: Set<number> = new Set(b);
	const difference: Set<number> = new Set(
		[...setA].filter((x) => !setB.has(x))
	);

	return Array.from(difference);
};

/**
 * Calculate the Jaacard index of two arrays
 * @param {number[]} a - The first array
 * @param {number[]} b - The second array
 * @returns The Jaacard index of the two arrays
 * */
export const getJaacardIndex = (a: number[], b: number[]): number => {
	const intersectionLength: number = intersection(a, b).length;
	const unionLength: number = union(a, b).length;

	return intersectionLength / unionLength;
};

/**
 * Calculate the Jaacard distance of two arrays
 * @param {number[]} a - The first array
 * @param {number[]} b - The second array
 * @returns The Jaacard distance of the two arrays
 * */
export const getJaacardDistance = (a: number[], b: number[]): number => {
	return 1 - getJaacardIndex(a, b);
};

/**
 * Calculate the Jaacard similarity of two arrays
 * @param {number[]} a - The first array
 * @param {number[]} b - The second array
 * @returns The Jaacard similarity of the two arrays
 * */
export const getJaacardSimilarity = (a: number[], b: number[]): number => {
	return 1 - getJaacardDistance(a, b);
};
