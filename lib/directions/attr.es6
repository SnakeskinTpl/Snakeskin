Snakeskin.addDirective(
	'attr',

	{
		placement: 'template',
		notEmpty: true,
		text: true
	},

	function (command) {
		this.startInlineDir();
		if (this.isReady()) {
			let str = '',
				groups = this.splitAttrsGroup(command);

			for (let i = -1; ++i < groups.length;) {
				let el = groups[i];

				str += this.returnAttrDecl(
					el.attr,
					el.group,
					el.separator
				);
			}

			this.append(str);
		}
	}
);

var escapeEqRgxp = /===|==|\\=/g,
	escapeOrRgxp = /\|\||\\\|/g;

var unEscapeEqRgxp = /__SNAKESKIN_EQ__(\d+)_/g,
	unEscapeOrRgxp = /__SNAKESKIN_OR__(\d+)_/g;

function escapeEq(sstr) {
	return `__SNAKESKIN_EQ__${sstr.split('=').length}_`;
}

function escapeOr(sstr) {
	return `__SNAKESKIN_OR__${sstr.split('|').length}_`;
}

function unEscapeEq(sstr, $1) {
	return new Array(Number($1)).join('=');
}

function unEscapeOr(sstr, $1) {
	return new Array(Number($1)).join('|');
}

/**
 * Вернуть строку декларации XML атрибутов
 *
 * @param {string} str - исходная строка
 * @param {?string=} [opt_group] - название группы
 * @param {?string=} [opt_separator='-'] - разделитель группы
 * @param {?boolean=} [opt_classLink=false] - если true, то значения для атрибута class
 *     будут сохраняться во временную переменную
 *
 * @return {string}
 */
DirObj.prototype.returnAttrDecl = function (str, opt_group, opt_separator, opt_classLink) {
	var rAttr = this.attr;
	this.attr = true;

	opt_group = opt_group || '';
	opt_separator = opt_separator || '-';
	str = str
		.replace(escapeHTMLRgxp, escapeHTML)
		.replace(escapeOrRgxp, escapeOr);

	var parts = str.split('|'),
		res = '',
		ref = this.bemRef;

	var s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

	for (let i = -1; ++i < parts.length;) {
		parts[i] = parts[i]
			.replace(unEscapeOrRgxp, unEscapeOr)
			.replace(escapeEqRgxp, escapeEq);

		let arg = parts[i].split('=');

		if (arg.length !== 2) {
			arg[1] = arg[0];
		}

		arg[0] = arg[0].trim().replace(unEscapeEqRgxp, unEscapeEq);
		arg[1] = arg[1].trim().replace(unEscapeEqRgxp, unEscapeEq);

		res += `
			__STR__ = \'\';
			__J__ = 0;
		`;

		if (opt_group) {
			arg[0] = opt_group + opt_separator + arg[0];

		} else {
			arg[0] = arg[0].charAt(0) === '-' ?
				`data-${arg[0].slice(1)}` : arg[0];
		}

		arg[0] = `'${this.pasteTplVarBlocks(arg[0])}'`;
		let vals = arg[1].split(' ');

		for (let j = -1; ++j < vals.length;) {
			let val = vals[j].trim();

			if (val.charAt(0) === '&' && ref) {
				val = `${s}'${this.replaceTplVars(ref, true)}'|bem '${this.replaceTplVars(val.substring(1), true)}'${e}`;
				val = this.replaceTplVars(val);
			}

			val = this.prepareOutput(`'${this.pasteTplVarBlocks(val)}'`, true) || '';

			res += `
				if ((${val}) != null && (${val}) !== '') {
					__STR__ += __J__ ? ' ' + ${val} : ${val};
					__J__++;
				}
			`;
		}

		res += `if ((${arg[0]}) != null && (${arg[0]}) != '' && __STR__) {`;
		let tmp = this.wrap(`' ' + ${arg[0]} + '="' + __STR__ + '"'`);

		if (opt_classLink) {
			res += `
				if (__TMP__[(${arg[0]})] != null) {
					__TMP__[(${arg[0]})] += __STR__;

				} else {
					${tmp}
				}
			`;

		} else {
			res += tmp;
		}

		res += '}';
	}

	this.attr = rAttr;
	return res;
};

/**
 * Разбить строку декларации атрибута на группы
 *
 * @param {string} str - исходная строка
 * @return {!Array}
 */
DirObj.prototype.splitAttrsGroup = function (str) {
	var rAttr = this.attr;
	this.attr = true;

	str = this.replaceTplVars(str, null, true);
	var groups = [];

	var group = '',
		attr = '',
		sep = '';

	var pOpen = 0;
	var separator = {
		'-': true,
		':': true,
		'_': true
	};

	for (let i = -1; ++i < str.length;) {
		let el = str.charAt(i),
			next = str.charAt(i + 1);

		if (!pOpen) {
			if (separator[el] && next === '(') {
				pOpen++;
				i++;
				sep = el;
				continue;
			}

			if (el === '(') {
				pOpen++;
				sep = '';
				continue;
			}
		}

		if (pOpen) {
			if (el === '(') {
				pOpen++;

			} else if (el === ')') {
				pOpen--;

				if (!pOpen) {
					groups.push({
						group: group.trim(),
						separator: sep,
						attr: attr.trim()
					});

					group = '';
					attr = '';
					sep = '';

					i++;
					continue;
				}
			}
		}

		if (!pOpen) {
			group += el;

		} else {
			attr += el;
		}
	}

	if (group && !attr) {
		groups.push({
			group: null,
			separator: null,
			attr: group.trim()
		});
	}

	this.attr = rAttr;
	return groups;
};