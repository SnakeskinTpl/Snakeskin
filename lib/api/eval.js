var uid;

/**
 * Выполнить заданную строку как JavaScript
 *
 * @param {string} str - исходная строка
 * @return {?}
 */
DirObj.prototype.evalStr = function (str) {
	str = this.pasteDangerBlocks(str);
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
			'$_',

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
			Snakeskin.LocalVars[`\$_${uid}`],

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
			'$_',

			str

		).call(
			root,
			Snakeskin,
			Snakeskin.Filters,
			Snakeskin.Vars,
			Snakeskin.LocalVars,
			Snakeskin.LocalVars[`\$_${uid}`]
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
