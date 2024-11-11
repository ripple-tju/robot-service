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
	#url;

	constructor(url = 'http://example.com') {
		super();
		this.#url = new URL(url);
		Object.freeze(this);
	}

	async connect() {
		const websocket = new WebSocket(this.#url);

		this.#websocket = websocket;

		websocket.addEventListener('message', ({ data }) => {
			const [id, error] = new Uint8Array(data);
			const pending = this.#pendings[id];

			if (pending !== undefined) {
				pending.resolve(!error);
			}
		});

		websocket.addEventListener('close', () => {
			this.#websocket = null;
		});
	}

	#pendings = {};

	async [SEND]() {
		const id = this.#state.id++;
		const timeout = Setup.timeout.get();

		this.#websocket.send(this.#state.buffer);

		try {
			const { promise, resolve, reject } = Promise.withResolvers();

			this.#pendings[id] = {
				resolve, reject,
				timer: setTimeout(() => reject(new Error('Timeout.')), timeout),
			};

			return await promise;
		} catch (error) {
			//TODO
		} finally {
			clearTimeout(this.#pendings[id].timer);
			delete this.#pendings[id];
		}
	}

	[ASSERT_CONNECTED]() {
		if (this.#websocket === null) {
			throw new Error('Disconnected.');
		}
	}

	async to(x, y) {
		this.#state.setInstruction(0b0000).setPoint(x, y);
	}

	async buttonDown(code) {
		this.#state.setInstruction(0b0100).setCode(code);
	}

	async buttonUp(code) {
		this.#state.setInstruction(0b0101).setCode(code);
	}

	async keyDown(code) {
		this.#state.setInstruction(0b1000).setCode(code);
	}

	async keyUp(code) {
		this.#state.setInstruction(0b1101).setCode(code);
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
