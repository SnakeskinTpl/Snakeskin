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
			var groups = splitAttrGroup(command);

			for (var i = 0; i < groups.length; i++) {
				var el = groups[i];

				this.save(
					this.returnAttrDecl(
						el.attr,
						el.group,
						el.separator
					)
				);
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

	for (var i = 0; i < parts.length; i++) {
		var arg = parts[i].split('=>');

		if (arg.length !== 2) {
			arg[1] = arg[0];
		}

		res += ("\
\n			__STR__ = '';\
\n			__J__ = 0;\
\n		");

		if (opt_group) {
			arg[0] = (("'" + (opt_group + opt_separator)) + ("' + " + (arg[0])) + "");

		} else {
			arg[0] = arg[0].charAt(0) === '-' ?
				("'data-' + " + (arg[0].slice(1))) : arg[0];
		}

		var vals = arg[1].split(',');

		for (var j = 0; j < vals.length; j++) {
			var val = this.prepareOutput(vals[j], true) || '';

			res += (("\
\n				if ((" + val) + (") != null && (" + val) + (") !== '') {\
\n					__STR__ += __J__ ? ' ' + " + val) + (" : " + val) + ";\
\n					__J__++;\
\n				}\
\n			");
		}

		res += (("\
\n			if ((" + (arg[0])) + (") != null && (" + (arg[0])) + (") != '' && __STR__) {\
\n				" + (this.wrap((("' ' + " + (arg[0])) + " + ' = \"' + __STR__ + '\"'")))) + "\
\n			}\
\n		");
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

	for (var i = 0; i < str.length; i++) {
		var el = str.charAt(i),
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