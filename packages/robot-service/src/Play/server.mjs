import * as http from 'node:http';
import * as DuckRunner from '@produck/duck-runner';
import { WebSocketServer } from 'ws';

import * as Robot from './robot.mjs';

export default DuckRunner.definePlay(function ServerPlay({
	Kit, Log, Options, Session,
}) {
	const RobotMessageHandler = Robot.Provider(Kit('APP::ROBOT'));

	return async function play() {
		const { host, port } = Options.server;
		const server = http.createServer();

		new WebSocketServer({ server }).on('connection', async ws => {
			const session = await Session.get();

			if (session !== null) {
				return ws.close();
			}

			await Session.set();
			ws.on('close', () => Session.destroy());

			ws.on('message', async message => {
				const { byteLength: length, byteOffset: offset } = message;
				const arraybuffer = message.buffer.slice(offset, offset + length);

				await RobotMessageHandler(arraybuffer, ws);
			});
		});

		server.listen(port, host);
		Log.System(`Robot listening: host=${host} port=${port}`);
	};
});
