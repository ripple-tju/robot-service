import { defineRouter } from '@produck/duck-web-koa-forker';

export const Router = defineRouter(function SessionRouter(router, {
	Log,
}) {
	router
		.get(async function getSession(ctx) {

		})
		.post(async function setSession(ctx) {

		})
		.delete(async function deleteSession(ctx) {

		});
});
