var $freeze$0 = Object.freeze;var $defProps$0 = Object.defineProperties;var $TS$0 = ["\n				__TMP__ = {\n					'class': ''\n				};\n			"];$TS$0 = $freeze$0($defProps$0($TS$0, {"raw": {"value": $TS$0}}));var $TS$1 = ["\n					__NODE__ = document.createElement('", "');\n				"];$TS$1 = $freeze$0($defProps$0($TS$1, {"raw": {"value": $TS$1}}));var $TS$2 = ["\n					__TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '", "';\n				"];$TS$2 = $freeze$0($defProps$0($TS$2, {"raw": {"value": $TS$2}}));var $TS$3 = ["\n					if (__TMP__['class']) {\n						__NODE__.className = __TMP__['class'];\n					}\n\n					", "\n				"];$TS$3 = $freeze$0($defProps$0($TS$3, {"raw": {"value": $TS$3}}));var $TS$4 = ["\n					(__TMP__['class'] ? ' class=\"' + __TMP__['class'] + '\"' : '') + '", ">'\n				"];$TS$4 = $freeze$0($defProps$0($TS$4, {"raw": {"value": $TS$4}}));var emptyCommandParamsRgxp = /^([^\s]+?\(|\()/;

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
		this.startDir(null, {
			bemRef: this.bemRef
		});

		if (!this.tolerateWhitespace) {
			this.skipSpace = true;
		}

		if (this.isReady()) {
			if (command) {
				command = command.replace(emptyCommandParamsRgxp, 'div $1');

			} else {
				command = 'div';
			}

			var parts = command.split(' '),
				desc = this.returnTagDesc(parts[0]);

			var params = this.structure.params;

			params.tag = desc.tag;
			params.block = inlineTagMap[desc.tag] !== void 0 ?
				!inlineTagMap[desc.tag] : !desc.inline;

			var groups = this.splitAttrsGroup(parts.slice(1).join(' ')),
				dom = !this.domComment && this.renderMode === 'dom';

			var str = cbws($TS$0



);

			if (dom) {
				str += cbws($TS$1
, desc.tag
);

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
				str += cbws($TS$2
, desc.classes.join(' ')
);
			}

			if (dom) {
				str += cbws($TS$3




, this.returnPushNodeDecl(!params.block)
);

			} else {
				str += this.wrap(cbws($TS$4
, 
						!params.block && this.doctype === 'xml' ? '/' : ''
					
));
			}

			this.append(str);
		}
	},

	function () {
		var params = this.structure.params;

		this.bemRef = params.bemRef;
		this.prevSpace = false;

		if (params.block) {
			var str;

			if (!this.domComment && this.renderMode === 'dom') {
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
 * @return {{tag: string, id: string, classes: !Array, pseudo: !Array, inline: boolean}}
 */
DirObj.prototype.returnTagDesc = function (str) {
	var action = '';
	var tag = '',
		id = '',
		inline = false;

	var pseudo = [],
		classes = [];

	var s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

	var sys = {
		'#': true,
		'.': true,
		':': true
	};

	for (var i = -1; ++i < str.length;) {
		var el = str.charAt(i);

		if (sys[el]) {
			if (!tag) {
				tag = 'div';
			}

			action = el;

			if (el === '.') {
				classes.push('');

			} else if (el === ':') {
				if (!inline) {
					inline = pseudo[pseudo.length - 1] === 'inline';
				}

				pseudo.push('');
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

			case ':': {
				pseudo[pseudo.length - 1] += el;

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

	if (!inline) {
		inline = pseudo[pseudo.length - 1] === 'inline';
	}

	return {
		ref: ref,
		tag: this.replaceTplVars(tag),
		id: this.replaceTplVars(id),
		classes: classes,
		pseudo: pseudo,
		inline: inline
	};
};
