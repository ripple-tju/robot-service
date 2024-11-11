class Item {
	#value;

	constructor(defaultValue) {
		this.#value = defaultValue;
	}

	get() {
		return this.#value;
	}

	set(value) {
		this.#value = value;
	}
}

export const timeout = new Item(1000);
