import { S, P, Normalizer } from '@produck/mold';

const OptionsSchema = S.Object({
	read: P.Function(() => null),
	write: P.Function(),
	remove: P.Function(),
});

const normalizeOptions = Normalizer(OptionsSchema);

export class SessionManager {
	#options = {};

	constructor(options) {
		Object.assign(this.#options, normalizeOptions(options));
		Object.freeze(this);
	}

	async get() {
		const data = await this.#options.read();

		return data;
	}

	async set() {
		const data = {
			id: crypto.randomUUID(),
			at: Date.now(),
		};

		await this.#options.write(data);

		return data;
	}

	async destroy() {
		await this.#options.remove();
	}
}

export { SessionManager as Manager };
