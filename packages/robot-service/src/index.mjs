import * as Quack from '@produck/quack';

import * as Duck from '@produck/duck';
import * as DuckWorkspace from '@produck/duck-workspace';
import * as DuckWeb from '@produck/duck-web';
import * as DuckRunner from '@produck/duck-runner';
import * as DuckLog from '@produck/duck-log';

import * as DuckLogQuack from '@produck/duck-log-quack';

import * as meta from './meta.gen.mjs';
import ServerPlay from './Play/server.mjs';

export const Product = Duck.define({
	id: 'cn.edu.tju.ripple.robot',
	name: meta.name,
	version: meta.version,
	description: meta.description,
	components: [
		DuckRunner.Component({
			modes: {
				solo: DuckRunner.Template.Solo(),
				processes: DuckRunner.Template.Processes(),
			},
			roles: {
				server: ServerPlay,
			},
		}),
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
	],
}, function Robot({

}) {

});
