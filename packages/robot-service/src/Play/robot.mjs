import * as Duck from '@produck/duck';
import { mouse, keyboard, Point } from '@nut-tree-fork/nut-js';

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
	return new Int16Array(paramsBuffer, 0, 4).values();
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

const INSTRUCTION_HANDLER = {
	[CODE.MOUSE.POINTER.SET]: {
		parse: PARSE_POSITION,
		async action(x, y) {
			await mouse.setPosition(new Point(x, y));
		},
	},
	[CODE.MOUSE.BUTTON.DOWN]: {
		parse: PARSE_MOUSE_BUTTON_CODE,
		async action(buttonCode) {
			await mouse.pressButton(buttonCode);
		},
	},
	[CODE.MOUSE.BUTTON.UP]: {
		parse: PARSE_MOUSE_BUTTON_CODE,
		async action(buttonCode) {
			await mouse.releaseButton(buttonCode);
		},
	},
	[CODE.KEYBOARD.KEY.DOWN]: {
		parse: PARSE_KEYBOARD_KEY_CODE,
		async action(keyCode) {
			await keyboard.pressKey(keyCode);
		},
	},
	[CODE.KEYBOARD.KEY.UP]: {
		parse: PARSE_KEYBOARD_KEY_CODE,
		async action(keyCode) {
			await keyboard.releaseKey(keyCode);
		},
	},
};

/**
 * @param {ArrayBuffer} message
 */
function isMessage(message) {
	return message instanceof ArrayBuffer && message.byteLength === 6;
}

/**
 * @type {Duck.AnyDefiner<(message: ArrayBuffer) => void>}
 * @param {ArrayBuffer} message
 */
export const Provider = Duck.inject(function RobotProtocolMessageHandler({
	Log, Options,
}) {
	/**
	 * @param {ArrayBuffer} message
	 * @param {import('ws').WebSocket} ws
	 */
	return async function RobotProtocol(message, ws) {
		if (!isMessage(message)) {
			return Log;
		}

		const [id, code] = new Uint8Array(message, 0, 2);
		const handler = INSTRUCTION_HANDLER[code];

		if (handler === undefined) {
			return Log;
		}

		const { parse, action } = handler;

		await action(...parse(message.slice(2)));
		ws.send(new Uint8Array([id]));
	};
});
