/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

var emptyCommandParamsRgxp = /^([^\s]+?\(|\()/;

Snakeskin.addDirective(
	'tag',

	{
		block: true,
		placement: 'template',
		text: true,
		replacers: {
			'<': (cmd) => cmd.replace('<', 'tag '),
			'/<': (cmd) => cmd.replace('\/<', 'end tag')
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

			let parts = splitBySpace(command),
				desc = this.returnTagDesc(parts[0]);

			let params = this.structure.params;

			params.tag = desc.tag;
			params.block = inlineTagMap[desc.tag] !== undefined ?
				!inlineTagMap[desc.tag] : !desc.inline;

			let groups = this.splitXMLAttrsGroup(parts.slice(1).join(' ')),
				dom = !this.domComment && this.renderMode === 'dom';

			let str = ws`
				var __ATTR_TMP__ = {
					'class': ''
				};
			`;

			if (dom) {
				str += ws`
					$0 = __NODE__ = document.createElement('${desc.tag}');
				`;

			} else {
				str += this.wrap(`'<${desc.tag}'`);
			}

			for (let i = -1; ++i < groups.length;) {
				let el = groups[i];
				str += this.returnXMLAttrDecl(el.attr, el.group, el.separator, true);
			}

			if (desc.id) {
				if (dom) {
					str += `__NODE__.id = '${desc.id}';`;

				} else {
					str += this.wrap(`' id="${desc.id}"'`);
				}
			}

			if (desc.classes.length) {
				str += ws`
					__ATTR_TMP__['class'] += (__ATTR_TMP__['class'] ? ' ' : '') + '${desc.classes.join(' ')}';
				`;
			}

			if (dom) {
				str += ws`
					if (__ATTR_TMP__['class']) {
						__NODE__.className = __ATTR_TMP__['class'];
					}

					${this.returnPushNodeDecl(!params.block)}
				`;

			} else {
				str += this.wrap(ws`
					(__ATTR_TMP__['class'] ? ' class="' + __ATTR_TMP__['class'] + '"' : '') + '${
						!params.block && this.doctype === 'xml' ? '/' : ''
					}>'
				`);
			}

			this.append(str);
		}
	},

	function () {
		var params = this.structure.params;

		this.bemRef = params.bemRef;
		this.prevSpace = false;

		if (params.block) {
			let str;

			if (!this.domComment && this.renderMode === 'dom') {
				str = ws`
					__RESULT__.pop();
					$0 = __RESULT__.length > 1 ?
						__RESULT__[__RESULT__.length - 1] : void 0;
				`;

			} else {
				str = this.wrap(`'</${params.tag}>'`);
			}

			this.append(str);
		}
	}
);

var parentLinkRgxp = /^&/;

/**
 * Analyzes a string of tag declaration
 * and returns a reporting object
 *
 * @param {string} str - the source string
 * @return {{tag: string, id: string, classes: !Array, pseudo: !Array, inline: boolean}}
 */
DirObj.prototype.returnTagDesc = function (str) {
	str = this.replaceTplVars(str, {replace: true});

	var points = [],
		types = [],
		action = '';

	var tag = '',
		id = '',
		inline = false;

	var hasId = false;
	var pseudo = [],
		classes = [];

	var s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

	var bOpen = 0,
		bStart = false;

	var bMap = {
		'[': true,
		']': true
	};

	var sys = {
		'#': true,
		'.': true,
		':': true
	};

	var error = {
		tag: '',
		id: '',
		classes: [],
		pseudo: [],
		inline: false
	};

	for (let i = -1; ++i < str.length;) {
		let el = str.charAt(i);

		if (bMap[el]) {
			if (el === '[') {
				bOpen++;
				bStart = true;

			} else {
				bOpen--;
			}

			continue;
		}

		if (bStart && el !== '.') {
			this.error('invalid syntax');
			return error;

		} else {
			bStart = false;
		}

		if (sys[el] && (el !== '#' || !bOpen)) {
			if (el === '#') {
				if (hasId) {
					this.error('invalid syntax');
					return error;
				}

				hasId = true;
			}

			tag = tag || 'div';
			action = el;

			if (el === '.') {
				if (bOpen) {
					if (points.length) {
						for (let j = points.length; j--;) {
							let point = points[j];

							if (point) {
								if (point.stage < bOpen) {
									let tmp = classes[j],
										pos = point.from;

									if (point.val != null) {
										tmp = tmp.replace(parentLinkRgxp, point.val)
									}

									while (points[pos] != null) {
										let parent = points[pos];
										tmp = tmp.replace(parentLinkRgxp, parent.val);
										pos = parent.from;
									}

									points.push({
										stage: bOpen,
										val: tmp,
										from: j
									});

									break;
								}

							} else {
								points.push({
									stage: bOpen,
									val: classes[j],
									from: j
								});

								break;
							}
						}

					} else {
						points.push({
							stage: bOpen,
							val: null,
							from: null
						});
					}

				} else {
					points.push(null);
				}

				types.push(!bOpen);
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
			case '#':
				id += el;
				break;

			case '.':
				classes[classes.length - 1] += el;
				break;

			case ':':
				pseudo[pseudo.length - 1] += el;
				break;

			default:
				tag += el;
		}
	}

	if (bOpen) {
		this.error('invalid syntax');
		return error;
	}

	var ref = this.bemRef;

	for (let i = -1; ++i < classes.length;) {
		let el = classes[i],
			point = points[i];

		if (point && point.val != null) {
			el = el.replace(parentLinkRgxp, point.val);
		}

		if (parentLinkRgxp.test(el) && ref) {
			el = `${s}'${ref}'${FILTER}${this.bemFilter} '${el.slice(1)}',$0${e}`;
			el = this.pasteDangerBlocks(this.replaceTplVars(el));

		} else if (el && types[i]) {
			ref = this.pasteTplVarBlocks(el);
		}

		classes[i] = this.pasteTplVarBlocks(el);
	}

	this.bemRef = ref;

	if (!inline) {
		inline = pseudo[pseudo.length - 1] === 'inline';
	}

	return {
		tag: this.pasteTplVarBlocks(tag),
		id: this.pasteTplVarBlocks(id),
		classes: classes,
		pseudo: pseudo,
		inline: inline
	};
};
