var uid;

/**
 * Выполнить заданную строку как JavaScript
 *
 * @param {string} str - исходная строка
 * @return {?}
 */
DirObj.prototype.evalStr = function (str) {
	var module = this.module;
	var filename = module.filename,
		dirname;

	if (IS_NODE) {
		dirname = require('path')['dirname'](filename);
		return new Function(
			'Snakeskin',

			'__FILTERS__',
			'__VARS__',
			'__LOCAL__',

			'__STR__',
			'__J__',
			'$_',

			'$C',
			'async',

			'module',
			'exports',
			'require',

			'__dirname',
			'__filename',

			str

		).call(
			root,
			Snakeskin,

			Snakeskin.Filters,
			Snakeskin.Vars,
			Snakeskin.LocalVars,

			void 0,
			void 0,
			Snakeskin.LocalVars[`\$_${uid}`],

				root['$C'] != null ?
				root['$C'] : Snakeskin.LocalVars['$C'] || Snakeskin.Vars['$C'],

				root['async'] != null ?
				root['async'] : Snakeskin.LocalVars['async'] || Snakeskin.Vars['async'],

			module,
			module.exports,
			IS_NODE ?
				require : void 0,

			dirname,
			filename
		);

	} else {
		return new Function(
			'Snakeskin',

			'__FILTERS__',
			'__VARS__',
			'__LOCAL__',

			'__STR__',
			'__J__',
			'$_',

			'$C',
			'async',

			str

		).call(
			root,
			Snakeskin,

			Snakeskin.Filters,
			Snakeskin.Vars,
			Snakeskin.LocalVars,

			void 0,
			void 0,
			Snakeskin.LocalVars[`\$_${uid}`],

				root['$C'] != null ?
				root['$C'] : Snakeskin.LocalVars['$C'] || Snakeskin.Vars['$C'],

				root['async'] != null ?
				root['async'] : Snakeskin.LocalVars['async'] || Snakeskin.Vars['async']
		);
	}
};

/**
 * Выполнить заданную строку как JavaScript
 * и вернуть результат
 *
 * @param {string} str - исходная строка
 * @return {?}
 */
DirObj.prototype.returnEvalVal = function (str) {
	return this.evalStr('return ' + str);
};
