export const Mouse = Object.freeze({
	Pointer: Object.freeze({
		Set: 0b0000,
	}),
	Button: Object.freeze({
		Down: 0b0100,
		Up: 0b0101,
	}),
});

export const Keyboard = Object.freeze({
	Key: Object.freeze({
		Down: 0b1000,
		Up: 0b1001,
	}),
});
