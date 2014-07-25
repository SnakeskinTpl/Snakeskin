Snakeskin.addDirective(
	'attr',

	{
		placement: 'template',
		notEmpty: true,
		text: true
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			let groups = splitAttrGroup(command);

			for (let i = 0; i < groups.length; i++) {
				let el = groups[i];
				this.save(this.returnAttrDecl(el.attr, el.group, el.separator));
			}
		}
	}
);

/**
 * Вернуть строку декларации XML атрибутов
 *
 * @param {string} command - исходная команда
 * @param {?string=} [opt_group] - название группы
 * @param {?string=} [opt_separator='-'] - разделитель группы
 * @return {string}
 */
DirObj.prototype.returnAttrDecl = function (command, opt_group, opt_separator) {
	opt_group = opt_group || '';
	opt_separator = opt_separator || '-';
	var parts = command.split(';'),
		res = '';

	for (let i = 0; i < parts.length; i++) {
		let arg = parts[i].split('=>');

		if (arg.length !== 2) {
			arg[1] = arg[0];
		}

		res += `
			__STR__ = \'\';
			__J__ = 0;
		`;

		if (opt_group) {
			arg[0] = `'${opt_group + opt_separator}' + ${arg[0]}`;

		} else {
			arg[0] = arg[0].charAt(0) === '-' ?
				`'data-' + ${arg[0].slice(1)}` : arg[0];
		}

		let vals = arg[1].split(',');

		for (let j = 0; j < vals.length; j++) {
			let val = this.prepareOutput(vals[j], true) || '';

			res += `
				if ((${val}) != null && (${val}) !== '') {
					__STR__ += __J__ ? ' ' + ${val} : ${val};
					__J__++;
				}
			`;
		}

		res += `
			if ((${arg[0]}) != null && (${arg[0]}) != '' && __STR__) {
				${this.wrap(`' ' + ${arg[0]} + ' = "' + __STR__ + '"'`)}
			}
		`;
	}

	return res;
};

/**
 * Разбить строку декларации атрибута на группы
 *
 * @param {string} str - исходная строка
 * @return {!Array}
 */
function splitAttrGroup(str) {
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

	for (let i = 0; i < str.length; i++) {
		let el = str.charAt(i),
			next = str.charAt(i + 1);

		if (separator[el] && !pOpen && next === '(') {
			pOpen++;
			i++;

			sep = el;
			continue;
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

	return groups;
}