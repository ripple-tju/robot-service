export namespace Setup {
	interface Item<T> {
		get(): T;
		set(value: T): undefined;
	}

	/**
	 * Set timeout value on action request.
	 */
	export const timeout: Item<number>;
}

declare class RobotControl {
	/**
	 * Connect to a robot service.
	 */
	connect(): Promise<undefined>;

	/**
	 * Set mouse pointer position.
	 * @param x
	 * @param y
	 */
	to(x: number, y: number): Promise<undefined>;

	/**
	 * Press mouse button.
	 * @param code
	 */
	buttonDown(code: number): Promise<undefined>;

	/**
	 * Release mouse button.
	 * @param code
	 */
	buttonUp(code: number): Promise<undefined>;

	/**
	 * Press keyboard key.
	 * @param code
	 */
	keyDown(code: number): Promise<undefined>;

	/**
	 * Release keyboard key.
	 * @param code
	 */
	keyUp(code: number): Promise<undefined>;
}
