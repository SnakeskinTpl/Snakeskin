var inlineTagMap = {
	'img': true,
	'link': true,
	'embed': true,
	'br': true,
	'hr': true,
	'wbr': true,
	'meta': true,
	'input': true,
	'source': true,
	'track': true,
	'base': true
};

Snakeskin.addDirective(
	'tag',

	{
		block: true,
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'<': function(cmd)  {return cmd.replace('<', 'tag ')}
		}
	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			var parts = command.split(' '),
				desc = this.returnTagDesc(parts[0]);

			var params = this.structure.params;

			params.tag = desc.tag;
			params.block = !inlineTagMap[desc.tag];

			var groups = splitAttrGroup(parts.slice(1).join(' '));
			var str = (("\
\n				__TMP__ = {\
\n					'class': ''\
\n				};\
\n\
\n				" + (this.wrap((("'<" + (desc.tag)) + "'")))) + "\
\n			");

			for (var i = 0; i < groups.length; i++) {
				var el = groups[i];
				str += this.returnTagAttrDecl(el.attr, el.group, el.separator);
			}

			if (desc.id) {
				str += this.wrap((("' id=\"" + (desc.id)) + "\"'"));
			}

			if (desc.classes.length) {
				str += (("\
\n					__TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '" + (desc.classes.join(' '))) + ("';\
\n					" + (this.wrap(("' class=\"' + __TMP__['class'] + '\"'")))) + "\
\n				");
			}

			str += this.wrap((("'" + (!params.block ? '/' : '')) + ">'"));
			this.save(str);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			var params = this.structure.params;

			if (params.block) {
				this.save(this.wrap((("'</" + (params.tag)) + ">'")));
			}
		}
	}
);

/**
 * Вернуть строку декларации XML атрибутов
 * (отличие от returnAttrDecl
 *     returnAttrDecl: foo + '-bar'
 *         ==
 *     returnTagAttrDecl #{foo}-bar
 * )
 *
 * @param {string} str - исходная строка
 * @param {?string=} [opt_group] - название группы
 * @param {?string=} [opt_separator='-'] - разделитель группы
 * @return {string}
 */
DirObj.prototype.returnTagAttrDecl = function (str, opt_group, opt_separator) {
	opt_group = opt_group || '';
	opt_separator = opt_separator || '-';
	var parts = str.split(';'),
		res = '';

	for (var i = 0; i < parts.length; i++) {
		var arg = parts[i].split('=>');

		if (arg.length !== 2) {
			arg[1] = arg[0];
		}

		res += ("\
\n			__STR__ = \'\';\
\n			__J__ = 0;\
\n		");

		if (opt_group) {
			arg[0] = opt_group + opt_separator + arg[0];

		} else {
			arg[0] = arg[0].charAt(0) === '-' ?
				("data-" + (arg[0].slice(1))) : arg[0];
		}

		arg[0] = (("'" + (this.replaceTplVars(arg[0].trim()))) + "'");
		var vals = arg[1].split(',');

		for (var j = 0; j < vals.length; j++) {
			var val = this.prepareOutput((("'" + (this.replaceTplVars(vals[j].trim()))) + "'"), true) || '';

			res += (("\
\n				if ((" + val) + (") != null && (" + val) + (") !== '') {\
\n					__STR__ += __J__ ? ' ' + " + val) + (" : " + val) + ";\
\n					__J__++;\
\n				}\
\n			");
		}

		res += (("\
\n			if ((" + (arg[0])) + (") != null && (" + (arg[0])) + (") != '' && __STR__) {\
\n				if (__TMP__[(" + (arg[0])) + (")] != null) {\
\n					__TMP__[(" + (arg[0])) + (")] += __STR__;\
\n\
\n				} else {\
\n					" + (this.wrap((("' ' + " + (arg[0])) + " + '=\"' + __STR__ + '\"'")))) + "\
\n				}\
\n			}\
\n		");
	}

	return res;
};

/**
 * Анализировать заданную строку декларации тега
 * и вернуть объект-описание
 *
 * @param {string} str - исходная строка
 * @return {{tag: string, id: string, classes: !Array}}
 */
DirObj.prototype.returnTagDesc = function (str) {
	var action = '';

	var tag = '',
		id = '',
		classes = [];

	for (var i = 0; i < str.length; i++) {
		var el = str.charAt(i);

		if (el === '#' || el === '.') {
			if (!tag) {
				tag = 'div';
			}

			action = el;

			if (el === '.') {
				classes.push('');
			}

			continue;
		}

		switch (action) {
			case '#': {
				id += el;
			} break;

			case '.': {
				classes[classes.length - 1] += el;
			} break;

			default: {
				tag += el;
			}
		}
	}

	for (var i$0 = 0; i$0 < classes.length; i$0++) {
		classes[i$0] = this.replaceTplVars(classes[i$0]);
	}

	return {
		tag: this.replaceTplVars(tag),
		id: this.replaceTplVars(id),
		classes: classes
	};
};
