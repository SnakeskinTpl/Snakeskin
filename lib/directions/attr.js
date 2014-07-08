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
			var groups = splitGroup(command);

			for (var i = 0; i < groups.length; i++) {
				var el = groups[i];
				this.save(this.returnDeclAttr(el.attr, el.group, el.separator));
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
DirObj.prototype.returnDeclAttr = function declAttr(command, opt_group, opt_separator) {
	opt_group = opt_group || '';
	opt_separator = opt_separator || '-';
	var parts = command.split(';'),
		res = '';

	for (var i = 0; i < parts.length; i++) {
		var arg = parts[i].split('=>');

		if (arg.length !== 2) {
			this.error((("invalid \"" + (this.name)) + "\" declaration"));
			return '';
		}

		res += '__STR__ = \'\';';

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
\n				if (" + val) + (") {\
\n					__STR__ += ' ' + " + val) + ";\
\n				}\
\n			");
		}

		res += (("\
\n			if (__STR__) {\
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
function splitGroup(str) {
	var groups = [];

	var group = '',
		attr = '',
		sep = '';

	var pOpen = 0;
	var separator = {
		'-': true,
		':': true
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