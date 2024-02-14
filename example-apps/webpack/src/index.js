function searchSortedArray(array, target) {
	let found;

	array.forEach((item) => {
		if (found) return;

		if (item === target) {
			found = item;
		}
	});

	return found;
}

const array = [1, 5, 1, 3, 4, 5, 2, 12, 19, 7, 2];

console.log(searchSortedArray(array, 3));
console.log(searchSortedArray(array, 2));
console.log(searchSortedArray(array, 12));
console.log(searchSortedArray(array, 1));

// scraipt-pass
function findLargestNumber(array, target) {
	let largest = array[0];

	array.forEach((item) => {
		if (item > largest) {
			largest = item;
		}
	});

	return largest;
}

console.log(findLargestNumber(array));

const getAverageOfArray = (array) => {
	let sum = 0;

	array.forEach((item) => {
		sum += item;
	});

	return sum / array.length;
};

console.log(getAverageOfArray(array));
