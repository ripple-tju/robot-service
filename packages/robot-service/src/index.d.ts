import "@produck/duck";

interface Options {
	server: {
		host: string;
		port: number;
	};

}

declare module "@produck/duck" {
	interface ProductKit {
		Options: Options;
	}
}

declare class Robot {
	boot(mode: 'solo' | 'processes'): Promise<undefined>;
}

export function Product(options: Options): Robot;
