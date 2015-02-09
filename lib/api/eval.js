/**
 * Executes a string
 *
 * @param {string} str - the source string
 * @return {?}
 */
DirObj.prototype.evalStr = function (str) {
	str = this.pasteDangerBlocks(str);
	var ctx = this.module;
	var filename = ctx.filename,
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

			ctx,
			ctx.exports,
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
 * ВExecutes a string and returns result
 *
 * @param {string} str - the source string
 * @return {?}
 */
DirObj.prototype.returnEvalVal = function (str) {
	return this.evalStr(`return ${str}`);
};
