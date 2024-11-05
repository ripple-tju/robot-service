import globals from 'globals';
import pluginJs from '@eslint/js';
import ProduckLint from '@produck/eslint-rules';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{languageOptions: { globals: {...globals.browser, ...globals.node} }},
	pluginJs.configs.recommended,
	ProduckLint,
];
