import { defineKoaApp } from '@produck/duck-web-koa';

import * as Router from './Router/index.mjs';

export const Provider = defineKoaApp(function AgentApplication(app, {
	Forker,
}) {
	app.use(Forker());
}, [
	Router.plugin,
]);
