import * as assert from 'node:assert/strict';
import { describe, it } from 'mocha';
import { WebSocketServer } from 'ws';
import { Instruction, Key, Button } from '@ripple.tju/robot-protocol';
import { Setup, control } from '../src/index.mjs';

describe('::Setup', function () {
	describe('.timeout', function () {
		describe('.get()', function () {
			it('should get timeout value.', function () {
				assert.equal(Setup.timeout.get(), 1000);
			});
		});

		describe('.set()', function () {
			it('should set new time out value.', function () {
				Setup.timeout.set(2000);
				assert.equal(Setup.timeout.get(), 2000);
				Setup.timeout.set(1000);
			});
		});
	});
});

describe('::control', function () {
	describe('.connect()', function () {
		it('should connect to a robot service.', async function () {
			let flag = false;

			const server = new WebSocketServer({
				host: '::',
				port: 8081,
			}).on('connection', () => {
				flag = true;
			});

			await control.connect('ws://127.0.0.1:8081/');
			assert.equal(flag, true);
			server.close();
			control.disconnect();
		});

		it('should throw if cannot connect correctly.', async function () {
			await assert.rejects(() => control.connect('ws://127.0.0.1:9000'), {
				name: 'Error',
				message: 'Connection failed.',
			});
		});
	});

	describe('.disconnect()', function () {
		it('should disconnect from a robot service.', async function () {
			let flag = false;

			const server = new WebSocketServer({
				host: '::',
				port: 8082,
			}).on('connection', () => {
				flag = true;
			});

			await control.connect('ws://127.0.0.1:8082/');
			assert.equal(flag, true);
			server.close();
			control.disconnect();
		});
	});

	it('should throw if NOT connected.', async function () {
		await assert.rejects(() => control.to(1, 2), {
			name: 'Error',
			message: 'Disconnected.',
		});
	});

	describe('(in robot-serice)', function () {
		const ROBOT_URL = 'ws://127.0.0.1:8080';
		const buffer = new Uint8Array(6);

		{
			/** @type {WebSocketServer} */
			let server;

			this.beforeAll(async function () {
				server = new WebSocketServer({
					host: '::',
					port: 8080,
				});

				server.addListener('connection', ws => {
					ws.on('message', message => {
						message.copy(buffer);
						ws.send(message.slice(0, 1));
					});
				});

				await control.connect(ROBOT_URL);
			});

			this.afterAll(function closeServer() {
				server.close();
				control.disconnect();
			});
		}

		describe('.to()', function () {
			it('should send a "Mouse.Pointer.Set" instruction.', async function () {
				await control.to(100, 200);

				assert.deepEqual([
					...buffer.slice(1),
				], [
					Instruction.Mouse.Pointer.Set, 100, 0, 200, 0,
				]);
			});
		});

		describe('.buttonDown()', function () {
			it('should send a "Mouse.Button.Down" instruction.', async function () {
				for (const key of Object.keys(Button)) {
					await control.buttonDown(Button[key]);

					assert.deepEqual([
						...buffer.slice(1),
					], [
						Instruction.Mouse.Button.Down, Button[key], 0, 0, 0,
					]);
				}
			});

			it('should throw if bad button code.', async function () {
				await assert.rejects(() => control.buttonDown(-1), {
					name: 'Error',
					message: 'Bad button code.',
				});
			});
		});

		describe('.buttonUp()', function () {
			it('should send a "Mouse.Button.Up" instruction.', async function () {
				for (const key of Object.keys(Button)) {
					await control.buttonUp(Button[key]);

					assert.deepEqual([
						...buffer.slice(1),
					], [
						Instruction.Mouse.Button.Up, Button[key], 0, 0, 0,
					]);
				}
			});

			it('should throw if bad button code.', async function () {
				await assert.rejects(() => control.buttonUp(-1), {
					name: 'Error',
					message: 'Bad button code.',
				});
			});
		});

		describe('.keyDown()', function () {
			it('should send a "Keyboard.Key.down" instruction.', async function () {
				for (const key of Object.keys(Key)) {
					await control.keyDown(Key[key]);

					assert.deepEqual([
						...buffer.slice(1),
					], [
						Instruction.Keyboard.Key.Down, Key[key], 0, 0, 0,
					]);
				}
			});

			it('should throw if bad key code.', async function () {
				await assert.rejects(() => control.keyDown(-1), {
					name: 'Error',
					message: 'Bad key code.',
				});
			});
		});

		describe('.keyUp()', function () {
			it('should send a "Keyboard.Key.down" instruction.', async function () {
				for (const key of Object.keys(Key)) {
					await control.keyUp(Key[key]);

					assert.deepEqual([
						...buffer.slice(1),
					], [
						Instruction.Keyboard.Key.Up, Key[key], 0, 0, 0,
					]);
				}
			});

			it('should throw if bad key code.', async function () {
				await assert.rejects(() => control.keyUp(-1), {
					name: 'Error',
					message: 'Bad key code.',
				});
			});
		});
	});

});
