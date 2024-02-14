// Standard hash table cache fo now, in the future it will use jaacard to test for 99% similarity
export class Cache {
	cache: { [key: string]: any };

	constructor() {
		this.cache = {};
	}

	set(key: string, value: any): any {
		this.cache[key] = value;
	}

	get(key: any): any {
		return this.cache[key];
	}
}
