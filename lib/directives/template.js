/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * The number of iteration,
 * where the active template was declared
 * @type {number}
 */
DirObj.prototype.startTemplateI = 0;

/**
 * The number of a line,
 * where the active template was declared
 * @type {?number}
 */
DirObj.prototype.startTemplateLine = null;

/**
 * If is true, then the active template is generator
 * @type {?boolean}
 */
DirObj.prototype.generator = null;

/**
 * The name of the active template
 * @type {?string}
 */
DirObj.prototype.tplName = null;

/**
 * The parent name of the active template
 * @type {?string}
 */
DirObj.prototype.parentTplName = null;

/**
 * The array of declared constants
 * @type {Array}
 */
DirObj.prototype.consts = null;

/**
 * The name of the parent BEM class
 * @type {string}
 */
DirObj.prototype.bemRef = '';

for (
	let i = -1,
		template = ['template', 'interface', 'placeholder']
	;

	++i < template.length
	;
) {

	Snakeskin.addDirective(
		template[i],

		{
			block: true,
			placement: 'global',
			notEmpty: true,
			group: [
				'template',
				'rootTemplate',
				'define'
			]
		},

		function (command, commandLength, type, jsDoc) {
			var lastName = '',
				proto = this.proto;

			var rank = {
				'template': 2,
				'interface': 1,
				'placeholder': 0
			};

			this.startDir(
				!proto && this.renderAs && rank[this.renderAs] < rank[type] ?
					this.renderAs : null
			);

			var iface =
				this.name === 'interface';

			this.startTemplateI = this.i + 1;
			this.startTemplateLine = this.info.line;

			var nameRgxp = new RegExp(`^[^${symbols}_$[]`, 'i'),
				esprimaNameHackRgxp = new RegExp(`[${G_MOD}${L_MOD}]`, 'g');

			var tmpTplName = this.getFnName(command),
				tplName = this.pasteDangerBlocks(tmpTplName);

			if (!proto) {
				tmpTplName = this.replaceFileNamePatterns(tmpTplName);

				let prfx = '',
					pos;

				if (/\*/.test(tmpTplName)) {
					prfx = '*';
					tmpTplName = tmpTplName.replace(prfx, '');
				}

				tplName = this.pasteDangerBlocks(tmpTplName);
				this.generator = Boolean(prfx);

				try {
					if (!tplName || nameRgxp.test(tplName)) {
						throw false;
					}

					esprima.parse(tplName.replace(esprimaNameHackRgxp, ''));

				} catch (ignore) {
					return this.error(`invalid "${this.name}" name`);
				}

				if (tplName === 'init') {
					return this.error(`can't declare the template "${tplName}", try another name`);
				}

				this.info.template =
					this.tplName = tplName;

				if (this.name !== 'template' && !write[tplName]) {
					write[tplName] = false;
				}

				this.save(
					(pos = `/* Snakeskin template: ${tplName}; ${this.getFnArgs(command).join(',').replace(/=(.*?)(?:,|$)/g, '')} */`),
					iface,
					jsDoc
				);

				if (jsDoc) {
					jsDoc += pos.length;
				}

				let tmpArr = tmpTplName
					.replace(nmssRgxp, '%')
					.replace(nmsRgxp, '.%')
					.replace(nmeRgxp, '')
					.split('.');

				let str = tmpArr[0],
					length = tmpArr.length,
					first = str.charAt(0),
					shortcut = '';

				if (first === '%') {
					try {
						str = ws`['${
							applyDefEscape(
								this.returnEvalVal(
									this.out(str.substring(1), true)
								)
							)
						}']`;

					} catch (err) {
						return this.error(err.message);
					}

				} else {
					shortcut = str;
				}

				for (let i = 0; ++i < length;) {
					let el = tmpArr[i],
						custom = el.charAt(0) === '%';

					if (custom) {
						el = el.substring(1);
					}

					let def = `this${concatProp(str)}`;

					this.save(
						(pos = ws`
							if (${def} == null) {
								${def} = {};
							}

							${i === 1 && shortcut ? `var ${shortcut} = ${def};` : ''}
						`),

						iface,
						jsDoc
					);

					if (jsDoc) {
						jsDoc += pos.length;
					}

					if (custom) {
						try {
							str += ws`['${
								applyDefEscape(
									this.returnEvalVal(
										this.out(el, true)
									)
								)
							}']`;

						} catch (err) {
							return this.error(err.message);
						}

						continue;

					} else if (i === length - 1) {
						lastName = el;
					}

					str += `.${el}`;
				}

				tplName = str;
				this.save(`${length === 1 && shortcut ? `var ${shortcut} = ` : ''}this${concatProp(tplName)} = function ${prfx}${length > 1 ? lastName : shortcut}(`, iface);
			}

			this.info.template =
				this.tplName = tplName;

			this.blockStructure = {
				name: 'root',
				parent: null,
				children: []
			};

			this.blockTable = {};
			this.varCache[tplName] = {};

			if (proto) {
				this.sysSpace = proto.sysSpace;
				this.strongSpace = proto.strongSpace;
				this.chainSpace = proto.chainSpace;
				this.space = proto.space;
				return;
			}

			var parentTplName;
			if (/\)\s+extends\s+/.test(command)) {
				try {
					parentTplName = /\)\s+extends\s+(.*?(?:@|$))/
						.exec(command)[1]
						.replace(/\s*@$/, '');

					if (!parentTplName || nameRgxp.test(parentTplName)) {
						throw false;
					}

					esprima.parse(parentTplName.replace(esprimaNameHackRgxp, ''));

				} catch (ignore) {
					return this.error(`invalid "${this.name}" name for extend`);
				}

				try {
					parentTplName =
						this.parentTplName = this.prepareNameDecl(parentTplName);

				} catch (err) {
					return this.error(err.message);
				}

				if (cache[parentTplName] == null) {
					if (!this.renderAs || this.renderAs === 'template') {
						return this.error(`the specified template "${parentTplName}" for inheritance is not defined`);
					}

					parentTplName =
						this.parentTplName = null;
				}
			}

			this.initTemplateCache(tplName);

			if (tplName in extMap) {
				clearScopeCache(tplName);
			}

			let scope = scopeCache['template'],
				parent = scope[parentTplName];

			scope[tplName] = {
				id: this.environment.id,
				parent: parent,
				children: {}
			};

			scope[tplName].root = parent ?
				parent.root : scope[tplName];

			if (parent) {
				parent.children[tplName] = scope[tplName];
			}

			argsCache[tplName] = {};
			argsResCache[tplName] = {};
			outputCache[tplName] = {};

			extMap[tplName] = parentTplName;
			delete extListCache[tplName];

			var baseParams = {};

			if (!parentTplName) {
				forIn(this.params[this.params.length - 1], (el, key) => {
					if (key !== 'renderAs' && key.charAt(0) !== '@' && el !== undefined) {
						baseParams[key] = el;
					}
				});
			}

			var flags = command.split('@=');

			if (parentTplName && flags.length === 1) {
				flags.push('@skip true');
			}

			for (let i = 0; ++i < flags.length;) {
				let el = flags[i].trim(),
					name = el.split(' ')[0];

				delete baseParams[name];
				Snakeskin.Directives['__setSSFlag__'].call(this, el);
			}

			forIn(baseParams, (el, key) => {
				Snakeskin.Directives['__setSSFlag__'].call(this, [key, el]);
			});

			var args = this.prepareArgs(command, 'template', tplName, parentTplName);
			this.save(`${args.str}) {`, iface);

			if (args.scope) {
				this.scope.push(args.scope);
			}

			var predefs = [
				'callee',
				'blocks',
				'getTplResult',
				'clearTplResult',
				'$0',
				'TPL_NAME',
				'PARENT_TPL_NAME'
			];

			for (let i = -1; ++i < predefs.length;) {
				this.structure.vars[predefs[i]] = {
					value: predefs[i],
					scope: 0
				};
			}

			this.save(ws`
				var __THIS__ = this,
					__CALLEE__ = __ROOT__${concatProp(tplName)},
					callee = __CALLEE__;

				var __BLOCKS__ = __CALLEE__.Blocks = {},
					blocks = __BLOCKS__;

				var __RESULT__ = ${this.declResult()},
					__COMMENT_RESULT__,
					__NODE__,
					$0;

				function getTplResult(opt_clear) {
					var res = ${this.returnResult()};

					if (opt_clear) {
						__RESULT__ = ${this.declResult()};
					}

					return res;
				}

				function clearTplResult() {
					__RESULT__ = ${this.declResult()};
				}

				var __RETURN__ = false,
					__RETURN_VAL__;

				var TPL_NAME = "${escapeDoubleQuote(tplName)}",
					PARENT_TPL_NAME${parentTplName ? ` = "${escapeDoubleQuote(parentTplName)}"` : ''};

				${args.defParams}
			`);

			var preDefs = this.preDefs[tplName];
			if ((!extMap[tplName] || parentTplName) && preDefs) {
				this.source = this.source.substring(0, this.i + 1) +
					preDefs.text +
					this.source.substring(this.i + 1);

				delete this.preDefs[tplName];
			}
		},

		function (command, commandLength) {
			var tplName = String(this.tplName),
				proto = this.proto;

			if (proto) {
				if (this.backTableI) {
					let ctx = proto.ctx;
					ctx.backTableI += this.backTableI;

					forIn(this.backTable, (arr, key) => {
						for (let i = -1; ++i < arr.length;) {
							let el = arr[i];
							el.pos += proto.pos;
							el.outer = true;
							el.vars = this.structure.vars;
						}

						ctx.backTable[key] = ctx.backTable[key] ?
							ctx.backTable[key].concat(arr) : arr;
					});
				}

				return;
			}

			var diff = this.getDiff(commandLength);

			cache[tplName] = this.source.substring(this.startTemplateI, this.i - diff);
			table[tplName] = this.blockTable;

			if (this.parentTplName) {
				this.info.line = this.startTemplateLine;
				this.lines.splice(this.startTemplateLine, this.lines.length);

				this.source = this.source.substring(0, this.startTemplateI) +
					this.getTplFullBody(tplName) +
					this.source.substring(this.i - diff);

				this.initTemplateCache(tplName);
				this.startDir(this.structure.name);

				this.i = this.startTemplateI - 1;
				this.parentTplName = null;

				this.blockTable = {};
				this.varCache[tplName] = {};

				return;
			}

			if (this.backTableI) {
				forIn(this.backTable, (arr, key) => {
					for (let i = -1; ++i < arr.length;) {
						let el = arr[i];

						if (!el.outer) {
							continue;
						}

						let tmp = protoCache[tplName][key];
						if (!tmp) {
							return this.error(`the proto "${key}" is not defined`);
						}

						this.res = this.res.substring(0, el.pos) +
						this.res.substring(el.pos).replace(
							el.label,
							(el.argsStr || '') + (el.recursive ? tmp.i + '++;' : tmp.body)
						);
					}
				});

				this.backTable = {};
				this.backTableI = 0;
			}

			var iface = this.structure.name === 'interface';

			if (iface) {
				this.save('};', true);

			} else {
				this.save(ws`
						${this.consts.join('')}
						return ${this.returnResult()};
					};

					Snakeskin.cache["${escapeDoubleQuote(tplName)}"] = this${concatProp(tplName)};
				`);
			}

			this.save('/* Snakeskin template. */', iface);

			if (this.params[this.params.length - 1]['@tplName'] === this.tplName) {
				this.popParams();
			}

			this.canWrite = true;
			this.tplName = null;

			delete this.info.template;

			if (this.scope.length) {
				this.scope.pop();
			}
		}
	);
}
