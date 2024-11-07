import * as Duck from '@produck/duck';
import { WebSocketServer } from 'ws';

export const Provider = Duck.inject(function ServiceProvider({
	Session,
}) {
	/**
	 * @param server {import('node:http').Server}
	 */
	return function ServiceWebSocket(server) {

	};
});
