import * as Quack from '@produck/quack';

import * as Duck from '@produck/duck';
import * as DuckWorkspace from '@produck/duck-workspace';
import * as DuckWeb from '@produck/duck-web';
import * as DuckRunner from '@produck/duck-runner';
import * as DuckLog from '@produck/duck-log';

import * as DuckLogQuack from '@produck/duck-log-quack';

import * as meta from './meta.gen.mjs';
import ServerPlay from './Play/server.mjs';
import * as Session from './Feature/Session.mjs';
import * as Options from './Options.mjs';

export const Product = Duck.define({
	id: 'cn.edu.tju.ripple.robot',
	name: meta.name,
	version: meta.version,
	description: meta.description,
	components: [
		DuckWorkspace.Component({
			root: '.data', log: 'log', temp: 'tmp',
		}),
		DuckLog.Component({
			System: {},
			Robot: {},
			Access: {
				Transcriber: DuckLogQuack.Transcriber({
					format: Quack.Format.Apache.Preset.CLF,
					assert: () => true,
				}),
			},
		}),
		DuckWeb.Component([

		]),
		DuckRunner.Component({
			modes: {
				solo: DuckRunner.Template.Solo(),
				processes: DuckRunner.Template.Processes(),
			},
			roles: {
				server: ServerPlay,
			},
		}),
	],
}, function Robot({
	Kit, Workspace, Runner,
}, options) {
	const _options = Options.normalize(options);
	Kit.Options = options;

	Kit.Session = new Session.Manager({
		read: _options.session.read,
		write: _options.session.write,
		remove: _options.session.remove,
	});

	return {
		async install() {
			await Workspace.buildAll();
		},
		async boot(mode = 'solo') {
			await Runner.start(mode);
		},
	};
});
