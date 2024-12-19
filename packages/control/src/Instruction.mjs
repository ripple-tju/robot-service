export class RobotControlInstruction {
	constructor() {
		Object.freeze(this);
	}

	buffer = new ArrayBuffer(6);

	#id = new Uint8Array(this.buffer, 0, 1);

	get id() {
		return this.#id[0];
	}

	set id(value) {
		this.#id[0] = value;
	}

	#code = new Uint8Array(this.buffer, 1, 1);

	setCode(code) {
		this.#code[0] = code;

		return this;
	}

	#point = new Int16Array(this.buffer, 2, 2);

	setPoint(x, y) {
		this.#point[0] = x;
		this.#point[1] = y;

		return this;
	}

	#key = new Uint8Array(this.buffer, 2, 1);

	setKey(code) {
		this.#key[0] = code;

		return this;
	}

	#button = new Uint8Array(this.buffer, 2, 1);

	setButton(code) {
		this.#button[0] = code;

		return this;
	}

	#operand = new Uint8Array(this.buffer, 2);

	clearArguments() {
		this.#operand.fill(0, 0);

		return this;
	}
}

const { prototype } = RobotControlInstruction;

for (const name of ['setPoint', 'setKey', 'setButton']) {
	const _fn = prototype[name];

	prototype[name] = {
		[name](...args) {
			this.clearArguments();

			return _fn.call(this, ...args);
		},
	}[name];
};
