import { RobotControlInstruction } from './Instruction.mjs';
import * as Setup from './Setup.mjs';
import { Button, Key, Instruction } from '@ripple.tju/robot-protocol';

const SEND = Symbol();
const ASSERT_CONNECTED = Symbol();

const VALUES = {
	BUTTON: Object.values(Button),
	KEY: Object.values(Key),
};

function assertButtonCode(any) {
	if (!VALUES.BUTTON.includes(any)) {
		throw new Error('Bad button code.');
	}
}

function assertKeyCode(any) {
	if (!VALUES.KEY.includes(any)) {
		throw new Error('Bad key code.');
	}
}

export class RobotControl extends EventTarget {
	#instruction = new RobotControlInstruction();

	/** @type {WebSocket | null} */
	#websocket = null;

	[ASSERT_CONNECTED]() {
		if (this.#websocket === null) {
			throw new Error('Disconnected.');
		}
	}

	async connect(url) {
		const _url = new URL(url);

		return new Promise((resolve, reject) => {
			const websocket = this.#websocket = new WebSocket(_url);

			websocket.addEventListener('message', async ({ data }) => {
				const [id, error] = await data.bytes();
				const pending = this.#pendings[id];

				if (pending !== undefined) {
					pending.resolve(!error);
				}
			});

			websocket.addEventListener('close', () => {
				this.#websocket = null;
			});

			websocket.addEventListener('error', () => {
				reject(new Error('Connection failed.'));
			});

			websocket.addEventListener('open', () => {
				resolve();
			});
		});
	}

	async disconnect() {
		if (this.#websocket !== null) {
			this.#websocket.close();
			this.#websocket = false;
		}
	}

	#pendings = {};

	async [SEND]() {
		const id = ++this.#instruction.id;
		const timeout = Setup.timeout.get();

		this.#websocket.send(this.#instruction.buffer);

		try {
			const { promise, resolve, reject } = Promise.withResolvers();

			this.#pendings[id] = {
				resolve, reject,
				timer: setTimeout(() => reject(new Error('Timeout.')), timeout),
			};

			return await promise;
		} catch {
			//TODO
		} finally {
			clearTimeout(this.#pendings[id].timer);
			delete this.#pendings[id];
		}
	}

	async to(x, y) {
		this.#instruction.setCode(Instruction.Mouse.Pointer.Set).setPoint(x, y);
	}

	async buttonDown(code) {
		assertButtonCode(code);
		this.#instruction.setCode(Instruction.Mouse.Button.Down).setButton(code);
	}

	async buttonUp(code) {
		assertButtonCode(code);
		this.#instruction.setCode(Instruction.Mouse.Button.Up).setButton(code);
	}

	async keyDown(code) {
		assertKeyCode(code);
		this.#instruction.setCode(Instruction.Keyboard.Key.Down).setKey(code);
	}

	async keyUp(code) {
		assertKeyCode(code);
		this.#instruction.setCode(Instruction.Keyboard.Key.Up).setKey(code);
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
			await _fn.call(this, ...args);
			await this[SEND]();
		},
	}[name];
}
