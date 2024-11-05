import * as DuckWebKoaForker from '@produck/duck-web-koa-forker';

import * as Session from './Session.mjs';

export const plugin = DuckWebKoaForker.Plugin({
	name: 'API',
	path: '/api',
	provider: () => {},
	uses: [{
		name: 'Session',
		path: '/session',
		provider: Session.Router,
		uses: [{
			name: 'Device',
			path: '/device',
			provider: () => {},
			uses: [{
				name: 'Mouse',
			}, {
				name: 'Keyboard',
			}, {
				name: 'Screen'
			}]
		}],
	}],
});
