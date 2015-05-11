/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * Returns additional information about an error
 * @return {string}
 */
DirObj.prototype.genErrorAdvInfo = function () {
	const
		nl = this.eol,
		info = this.info;

	let str = '';
	if (!info) {
		return str;
	}

	forIn(info, (el, key) => {
		if (el == null) {
			return;
		}

		if (el.innerHTML) {
			str += `${key}: (class: ${el.className || 'undefined'}, id: ${el.id || 'undefined'}), `;

		} else {
			str += `${key}: ${el}, `;
		}
	});

	str = str.replace(/, $/, '');
	const
		line = info.line;

	const
		cutRgxp = /\/\*!!= (.*?) =\*\//g,
		privateRgxp = new RegExp(`${ADV_LEFT_BLOCK}?${LEFT_BLOCK}__.*?__.*?${RIGHT_BLOCK}`, 'g'),
		styleRgxp = /\t|[ ]{4}/g;

	if (line) {
		let
			prfx = '',
			max = 0;

		for (let i = 8; i--;) {
			let
				pos = line - i - 2,
				prev = this.lines[pos];

			const
				space = new Array(String(line - 1).length - String(pos).length + 1)
					.join(' ');

			if (prev != null) {
				prev = prev
					.replace(styleRgxp, '  ')
					.replace(privateRgxp, '')
					.replace(cutRgxp, '$1');

				let part;
				if (prev.trim()) {
					part = `${nl}  ${pos + 1} ${space}${prev}`;

				} else {
					part = `${nl}  ...`;
				}

				prfx += part;
				if (max < part.length) {
					max = part.length;
				}
			}
		}

		const
			current = (this.lines[line - 1] || '')
				.replace(styleRgxp, '  ')
				.replace(privateRgxp, '')
				.replace(cutRgxp, '$1');

		const
			chunk = `> ${line} ${current}`,
			sep = new Array(
					Math.max(max, chunk.length) || 5
			).join('-');

		str += nl + sep + prfx + nl + chunk + nl + sep;
	}

	return str;
};

/**
 * @private
 * @type {?boolean}
 */
DirObj.prototype._error = null;

/**
 * Returns an error object
 * @param {string} msg - the error message
 */
DirObj.prototype.error = function (msg) {
	if (this._error) {
		return;
	}

	this._error = true;
	const
		report = `${msg}, ${this.genErrorAdvInfo()}`,
		error = new Error(report);

	error.name = 'SnakeskinError';
	this.brk = true;

	if (this.proto) {
		this.parent.brk = true;
	}

	if (this.onError) {
		this.onError(error);

	} else {
		if (typeof console === 'undefined' || typeof console.error !== 'function' || this.throws) {
			throw error;
		}

		console.error(`SnakeskinError: ${report}`);
	}
};
