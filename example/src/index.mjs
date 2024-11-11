import * as Robot from '@ripple.tju/robot-control';

console.log(Robot);

Object.assign(document.body.style, {
	position: 'fixed',
	top: '0',
	left: '0',
	height: '100%',
	width: '100%',
	margin: '0',
	padding: '0',
});

const { searchParams } = new URL(location.href);
const protocol = searchParams.get('protocol') || 'ws:';
const hostname = searchParams.get('hostname') || '127.0.0.1';
const port = searchParams.get('port') || '80';
const control = new Robot.Control(`${protocol}//${hostname}:${port}`);

(async function () {
	await control.connect();

	document.body.addEventListener('mousemove', event => {
		const { x, y } = event;

		control.to(x, y);
	});
})();
