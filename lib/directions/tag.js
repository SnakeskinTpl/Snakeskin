var tagRgxp = /^([^\s]+?\(|\()/;
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
	'base': true,
	'area': true,
	'col': true,
	'param': true
};

Snakeskin.addDirective(
	'tag',

	{
		block: true,
		placement: 'template',
		text: true,
		replacers: {
			'<': function(cmd)  {return cmd.replace('<', 'tag ')},
			'/<': function(cmd)  {return cmd.replace('\/<', 'end tag')}
		}
	},

	function (command) {
		this.space = true;
		this.startDir(null, {
			bemRef: this.bemRef
		});

		if (this.isReady()) {
			if (command) {
				command = command.replace(tagRgxp, 'div $1');

			} else {
				command = 'div';
			}

			var parts = command.split(' '),
				desc = this.returnTagDesc(parts[0]);

			var params = this.structure.params;
			params.tag = desc.tag;
			params.block = !inlineTagMap[desc.tag];

			var groups = this.splitAttrsGroup(parts.slice(1).join(' ')),
				dom = this.renderMode === 'dom';

			var str = ("\
\n				__TMP__ = {\
\n					'class': ''\
\n				};\
\n			");

			if (dom) {
				str += (("\
\n					__NODE__ = document.createElement('" + (desc.tag)) + "');\
\n				");

			} else {
				str += this.wrap((("'<" + (desc.tag)) + "'"));
			}

			for (var i = -1; ++i < groups.length;) {
				var el = groups[i];
				str += this.returnAttrDecl(el.attr, el.group, el.separator, true);
			}

			if (desc.id) {
				if (dom) {
					str += (("__NODE__.id = '" + (desc.id)) + "';");

				} else {
					str += this.wrap((("' id=\"" + (desc.id)) + "\"'"));
				}
			}

			if (desc.classes.length) {
				str += (("\
\n					__TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '" + (desc.classes.join(' '))) + "';\
\n				");
			}

			if (dom) {
				str += (("\
\n					if (__TMP__['class']) {\
\n						__NODE__ .className = __TMP__['class'];\
\n					}\
\n\
\n					" + (this.wrap('__NODE__'))) + "\
\n\
\n					__RESULT__.push(__NODE__);\
\n					__NODE__ = null;\
\n				");

			} else {
				str += this.wrap((("(__TMP__['class'] ? ' class=\"' + __TMP__['class'] + '\"' : '') + '" + (!params.block ? '/' : '')) + ">'"));
			}

			this.append(str);
		}
	},

	function () {
		var params = this.structure.params;
		this.bemRef = params.bemRef;

		if (params.block) {
			var str;

			if (this.renderMode === 'dom') {
				str = '__RESULT__.pop();';

			} else {
				str = this.wrap((("'</" + (params.tag)) + ">'"));
			}

			this.append(str);
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

	var s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

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
				el$0 = (("" + s) + ("'" + (this.replaceTplVars(ref, true))) + ("'|bem '" + (this.replaceTplVars(el$0.substring(1), true))) + ("'" + e) + "");
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