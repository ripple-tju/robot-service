import * as Duck from '@produck/duck';
import { mouse, keyboard } from '@nut-tree-fork/nut-js';

/**
 * @type {Duck.AnyDefiner<(message: ArrayBuffer) => void>}
 * @param {ArrayBuffer} message
 */
export const Provider = Duck.inject(function RobotProtocolMessageHandler({
	Options,
}) {
	return function RobotProtocol(message) {

	};
});
