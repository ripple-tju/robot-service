export class RobotControlState {
	constructor() {
		Object.freeze(this);
	}

	buffer = new ArrayBuffer();

	#id = new Uint8Array(this.buffer, 0, 1);

	get id() {
		return this.#id[0];
	}

	set id(value) {
		this.#id[0] = value;
	}

	#instruction = new Uint8Array(this.buffer, 1, 1);

	setInstruction(code) {
		this.#instruction[0] = code;
	}

	#point = new Int16Array(this.buffer, 2, 2);

	setPoint(x, y) {
		this.#point[0] = x;
		this.#point[1] = y;
	}

	#code = new Uint8Array(this.buffer, 1, 1);

	setCode(code) {
		this.#code[0] = code;
	}

	#operand = new Uint32Array(this.buffer);

	clear() {
		this.#operand[0] = 0;
	}
}

const { prototype } = RobotControlState;

for (const name of ['setPoint', 'setCode']) {
	const _fn = prototype[name];

	prototype[name] = {
		[name](...args) {
			this.clear();

			return _fn.call(this, ...args);
		},
	}[name];
});
