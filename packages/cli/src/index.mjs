// import { program } from 'commander';
import * as RobotService from '@ripple.tju/robot-service';

let session = null;

const robot = RobotService.Product({
	server: {
		host: '::',
		port: 8080,
	},
	session: {
		read: () => session,
		write: data => session = data,
		remove: () => session = null,
	},
});

await robot.boot('processes');
