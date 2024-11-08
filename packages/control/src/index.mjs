import { RobotControlState } from './State.mjs';
import * as Setup from './Setup.mjs';

const SEND = Symbol();
const ASSERT_CONNECTED = Symbol();

export class RobotControl extends EventTarget {
	#state = new RobotControlState();

	/**
	 * @type {WebSocket | null}
	*/
	#websocket = null;
	#url = '';

	constructor(url) {
		super();
		this.#url = new URL(url);
	}

	async connect() {
		const websocket = new WebSocket(this.#url);

		this.#websocket = websocket;

		websocket.addEventListener('message', ({ data }) => {
			const [id, error] = new Uint8Array(data);
			const pending = this.#pendings[id];

			if (pending !== undefined) {
				pending.resolve(!error);
				delete this.#pendings[id];
			}
		});

		websocket.addEventListener('close', () => {
			this.#websocket = null;
		});
	}

	#pendings = {};

	async [SEND]() {
		const { promise, resolve, reject } = Promise.withResolvers();
		const id = this.#state.id++;

		this.#pendings[id] = {
			resolve, timer: setTimeout(() => {
				reject(new Error('Timeout.'));
				delete this.#pendings[id];
			}, Setup.getTimeout()),
		};

		this.#websocket.send(this.#state.buffer);
		await promise;
	}

	[ASSERT_CONNECTED]() {
		if (this.#websocket === null) {
			throw new Error('Disconnected.');
		}
	}

	async to(x, y) {
		this.#state.setInstruction(0b0000);
		this.#state.setPoint(x, y);
	}

	async buttonDown(code) {
		this.#state.setInstruction(0b0100);
		this.#state.setCode(code);
	}

	async buttonUp(code) {
		this.#state.setInstruction(0b0101);
		this.#state.setCode(code);
	}

	async keyDown(code) {
		this.#state.setInstruction(0b1000);
		this.#state.setCode(code);
	}

	async keyUp(code) {
		this.#state.setInstruction(0b1101);
		this.#state.setCode(code);
	}
}

const { prototype } = RobotControl;

for (const name of [
	'to',
	'buttonDown', 'buttonUp',
	'keyDown', 'keyUp',
]) {
	const _fn = prototype[name];

	prototype[name] = {
		async [name](...args) {
			this[ASSERT_CONNECTED]();
			_fn.call(this, ...args);
			await this[SEND]();
		},
	}[name];
}
