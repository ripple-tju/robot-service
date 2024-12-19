import { RobotControl } from './Control.mjs';
export * as Setup from './Setup.mjs';
export { Button, Key } from '@ripple.tju/robot-protocol';

export const control = Object.freeze(new RobotControl());
