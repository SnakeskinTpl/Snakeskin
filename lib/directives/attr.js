(() => {
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
					groups = this.splitXMLAttrsGroup(command);

				for (let i = -1; ++i < groups.length;) {
					let el = groups[i];

					str += this.returnXMLAttrDecl(
						el.attr,
						el.group,
						el.separator
					);
				}

				this.append(str);
			}
		}
	);

	var escapeEqRgxp = /===|==|([\\]+)=/g,
		escapeOrRgxp = /\|\||([\\]+)\|/g;

	var unEscapeEqRgxp = /__SNAKESKIN_EQ__(\d+)_(\d+)_/g,
		unEscapeOrRgxp = /__SNAKESKIN_OR__(\d+)_(\d+)_/g;

	function escapeEq(sstr, $1) {
		if ($1 && $1.length % 2 === 0) {
			return sstr;
		}

		return `__SNAKESKIN_EQ__${sstr.split('=').length}_${$1.length}_`;
	}

	function escapeOr(sstr, $1) {
		if ($1 && $1.length % 2 === 0) {
			return sstr;
		}

		return `__SNAKESKIN_OR__${sstr.split('|').length}_${$1.length}_`;
	}

	function unEscapeEq(ignore, $1, $2) {
		return new Array(Number($2)).join('\\') + new Array(Number($1)).join('=');
	}

	function unEscapeOr(ignore, $1, $2) {
		return new Array(Number($2)).join('\\') + new Array(Number($1)).join('|');
	}

	/**
	 * Returns string declaration of XML attribute
	 *
	 * @param {string} str - the source string
	 * @param {?string=} [opt_group] - a group name
	 * @param {?string=} [opt_separator='-'] - a group separator
	 * @param {?boolean=} [opt_classLink=false] - if is true, then a value of a class attribute
	 *   will be saved to a variable
	 *
	 * @return {string}
	 */
	DirObj.prototype.returnXMLAttrDecl = function (str, opt_group, opt_separator, opt_classLink) {
		var rAttr = this.attr,
			rEscape = this.attrEscape;

		this.attr = true;
		this.attrEscape = true;

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

			let arg = parts[i].split('='),
				empty = arg.length !== 2;

			if (empty) {
				if (this.doctype === 'xml') {
					arg[1] = arg[0];
					empty = false;

				} else {
					arg[1] = '';
				}
			}

			arg[0] = arg[0].trim().replace(unEscapeEqRgxp, unEscapeEq);
			arg[1] = arg[1].trim().replace(unEscapeEqRgxp, unEscapeEq);

			res += /* cbws */`
				var __ATTR_STR__ = \'\',
					__ATTR_J__ = 0;
			`;

			if (opt_group) {
				arg[0] = opt_group + opt_separator + arg[0];

			} else {
				arg[0] = arg[0].charAt(0) === '-' ?
					`data-${arg[0].slice(1)}` : arg[0];
			}

			arg[0] = `'${this.pasteTplVarBlocks(arg[0])}'`;
			let vals = splitBySpace(arg[1]);

			for (let j = -1; ++j < vals.length;) {
				let val = vals[j].trim();

				if (parentLinkRgxp.test(val) && ref) {
					val = `${s}'${ref}'${FILTER}${this.bemFilter} '${val.substring('&amp;'.length)}',$0${e}`;
					val = this.pasteDangerBlocks(this.replaceTplVars(val));
				}

				val = `'${this.pasteTplVarBlocks(val)}'`;

				res += /* cbws */`
					if ((${val}) != null && (${val}) !== '') {
						__ATTR_STR__ += __ATTR_J__ ? ' ' + ${val} : ${val};
						__ATTR_J__++;
					}
				`;
			}

			res += `if ((${arg[0]}) != null && (${arg[0]}) != '') {`;
			let tmp = /* cbws */`
				if (__NODE__) {
					__NODE__.setAttribute(${arg[0]}, ${empty} ? ${arg[0]} : __ATTR_STR__ );

				} else {
					${this.wrap(`' ' + ${arg[0]} + (${empty} ? '' : '="' + __ATTR_STR__ + '"')`)}
				}
			`;

			if (opt_classLink) {
				res += /* cbws */`
					if (__ATTR_TMP__[(${arg[0]})] != null) {
						__ATTR_TMP__[(${arg[0]})] += __ATTR_STR__;

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
		this.attrEscape = rEscape;

		return res;
	};

	/**
	 * Splits a string of attribute declaration into groups
	 *
	 * @param {string} str - the source string
	 * @return {!Array}
	 */
	DirObj.prototype.splitXMLAttrsGroup = function (str) {
		var rAttr = this.attr,
			rEscape = this.attrEscape;

		this.attr = true;
		this.attrEscape = true;

		str = this.replaceTplVars(str, false, true);
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
							group: Snakeskin.Filters.html(group, true).trim(),
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
		this.attrEscape = rEscape;

		return groups;
	};
})();
