import * as Duck from '@produck/duck';
import { mouse, keyboard, Point, Button, Key } from '@nut-tree-fork/nut-js';

const CODE = {
	MOUSE: {
		POINTER: {
			SET: 0b0000,
		},
		BUTTON: {
			DOWN: 0b0100,
			UP: 0b0101,
		},
	},
	KEYBOARD: {
		KEY: {
			DOWN: 0b1000,
			UP: 0b1101,
		},
	},
};

/**
 * @param {ArrayBuffer} paramsBuffer
 */
function PARSE_POSITION(paramsBuffer) {
	return new Int16Array(paramsBuffer, 0, 2).values();
}

/**
 * @param {ArrayBuffer} paramsBuffer
 */
function PARSE_MOUSE_BUTTON_CODE(paramsBuffer) {
	return new Uint8Array(paramsBuffer, 0, 1).values();
}

/**
 * @param {ArrayBuffer} paramsBuffer
 */
function PARSE_KEYBOARD_KEY_CODE(paramsBuffer) {
	return new Uint8Array(paramsBuffer, 0, 1).values();
}

function isButtonCode(code) {
	return Object.hasOwn(Button, code);
}

function isKeyCode(code) {
	return Object.hasOwn(Key, code);
}

const INSTRUCTION_HANDLER = {
	[CODE.MOUSE.POINTER.SET]: {
		name: 'MousePositionSet',
		parse: PARSE_POSITION,
		async action(x, y) {
			await mouse.setPosition(new Point(x, y));

			return true;
		},
	},
	[CODE.MOUSE.BUTTON.DOWN]: {
		name: 'MouseNuttonDown',
		parse: PARSE_MOUSE_BUTTON_CODE,
		async action(buttonCode) {
			if (!isButtonCode(buttonCode)) {
				return false;
			}

			await mouse.pressButton(buttonCode);

			return true;
		},
	},
	[CODE.MOUSE.BUTTON.UP]: {
		name: 'MouseButtonUp',
		parse: PARSE_MOUSE_BUTTON_CODE,
		async action(buttonCode) {
			if (!isButtonCode(buttonCode)) {
				return false;
			}

			await mouse.releaseButton(buttonCode);

			return true;
		},
	},
	[CODE.KEYBOARD.KEY.DOWN]: {
		name: 'KeyboardKeyDown',
		parse: PARSE_KEYBOARD_KEY_CODE,
		async action(keyCode) {
			if (!isKeyCode(keyCode)) {
				return false;
			}

			await keyboard.pressKey(keyCode);

			return true;
		},
	},
	[CODE.KEYBOARD.KEY.UP]: {
		name: 'KeyboardKeyUp',
		parse: PARSE_KEYBOARD_KEY_CODE,
		async action(keyCode) {
			if (!isKeyCode(keyCode)) {
				return false;
			}

			await keyboard.releaseKey(keyCode);

			return true;
		},
	},
};

/**
 * @param {ArrayBuffer} message
 */
function isMessage(message) {
	return message instanceof ArrayBuffer && message.byteLength === 6;
}

function isInstructionCode(code) {
	return Object.hasOwn(INSTRUCTION_HANDLER, code);
}

/**
 * @type {Duck.AnyDefiner<(message: ArrayBuffer) => Promise<void>>}
 * @param {ArrayBuffer} message
 */
export const Provider = Duck.inject(function RobotProtocolMessageHandler({
	Log,
}) {
	/**
	 * @param {ArrayBuffer} message
	 * @param {import('ws').WebSocket} ws
	 */
	return async function RobotProtocol(message, ws) {
		if (!isMessage(message)) {
			return Log.Robot.error('Bad message.');
		}

		const [id, code] = new Uint8Array(message, 0, 2);

		if (!isInstructionCode(code)) {
			return Log.Robot.error('Bad instruction code.');
		}

		const { parse, action, name } = INSTRUCTION_HANDLER[code];
		const params = parse(message.slice(2));
		const ok = await action(...params);

		Log.Robot(`Action: ${name}: ${params}`);
		ws.send(new Uint8Array([id, ok ? 0 : 1]));
	};
});
