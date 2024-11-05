import * as http from 'node:http';
import * as Quack from '@produck/quack';
import * as DuckRunner from '@produck/duck-runner';

export default DuckRunner.definePlay(function ServerPlay({
	Log, Web, Options
}) {
	const app = Web.Application('Service');
	const loggerWarpedApp = Quack.Format.Apache.HttpAdapter(app, Log.Access);

	return async function play() {
		const { host, port } = Options.server;
		const server = http.createServer(loggerWarpedApp);

		server.listen(host, port);
		Log.System(`Robot listening: host=${1} port=${1}`);
	};
});
