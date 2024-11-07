import { Normalizer, S, P } from '@produck/mold';

export const Schema = S.Object({
	server: S.Object({
		host: P.String('::'),
		port: P.Port(8080),
	}),
	session: S.Object({
		read: P.Function(() => {}),
		write: P.Function(() => {}),
		remove: P.Function(() => {}),
	}),
});

export const normalize = Normalizer(Schema);
