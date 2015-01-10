/**
 * Выполнить заданную строку как JavaScript
 *
 * @param {string} str - исходная строка
 * @return {?}
 */
DirObj.prototype.evalStr = function (str) {
	str = this.pasteDangerBlocks(str);
	var root = this.module;
	var filename = root.filename,
		dirname;

	if (IS_NODE) {
		dirname = require('path').dirname(filename);
		return new Function(
			'Snakeskin',

			'__FILTERS__',
			'__VARS__',
			'__LOCAL__',

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

			root,
			root.exports,
			require,

			dirname,
			filename
		);

	} else {
		return new Function(
			'Snakeskin',

			'__FILTERS__',
			'__VARS__',
			'__LOCAL__',

			str

		).call(
			root,
			Snakeskin,
			Snakeskin.Filters,
			Snakeskin.Vars,
			Snakeskin.LocalVars
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
	return this.evalStr(`return ${str}`);
};
