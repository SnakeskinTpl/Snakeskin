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
		this.space = true;
		this.startDir(null, {
			bemRef: this.bemRef
		});

		if (this.isReady()) {
			var parts = command.split(' '),
				desc = this.returnTagDesc(parts[0]);

			var params = this.structure.params;
			params.tag = desc.tag;
			params.block = !inlineTagMap[desc.tag];

			var groups = this.splitAttrsGroup(parts.slice(1).join(' '));
			var str = (("\
\n				__TMP__ = {\
\n					'class': ''\
\n				};\
\n\
\n				" + (this.wrap((("'<" + (desc.tag)) + "'")))) + "\
\n			");

			for (var i = -1; ++i < groups.length;) {
				var el = groups[i];
				str += this.returnAttrDecl(el.attr, el.group, el.separator, true);
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
			this.append(str);
		}
	},

	function () {
		var params = this.structure.params;
		this.bemRef = params.bemRef;

		if (params.block) {
			this.append(this.wrap((("'</" + (params.tag)) + ">'")));
		}
	}
);

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

	for (var i = -1; ++i < str.length;) {
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

	var ref = this.bemRef,
		newRef = '';

	for (var i$0 = classes.length; i$0--;) {
		var el$0 = classes[i$0];

		if (el$0.charAt(0) === '&') {
			if (ref) {
				el$0 = (("#{'" + (this.replaceTplVars(ref, true))) + ("'|bem '" + (this.replaceTplVars(el$0.substring(1), true))) + "'}");
			}

		} else if (!newRef && el$0) {
			newRef = el$0;
		}

		classes[i$0] = this.replaceTplVars(el$0);
	}

	if (newRef) {
		this.bemRef = newRef;
	}

	return {
		ref: ref,
		tag: this.replaceTplVars(tag),
		id: this.replaceTplVars(id),
		classes: classes
	};
};
