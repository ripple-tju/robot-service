import "@produck/duck";

interface Options {
	server: {
		host: string;
		port: number;
	};
	session: {
		read: () => Promise<SessionData | null>;
		write: (data: SessionData) => Promise<undefined>;
		remove: () => Promise<undefined>;
	}
}

interface SessionData {
	id: string;
	at: number;
}

interface Session {
	get(): Promise<SessionData | null>;
	set(): Promise<SessionData>;
	destroy(): Promise<undefined>;
}

declare module "@produck/duck" {
	interface ProductKit {
		Options: Options;
		Session: Session;
	}
}

declare class Robot {
	install(): Promise<undefined>;
	boot(mode: 'solo' | 'processes'): Promise<undefined>;
}

export function Product(options: Options): Robot;
