/**
 * Номер итерации,
 * где был декларирован активный шаблон
 * @type {number}
 */
DirObj.prototype.startTemplateI = 0;

/**
 * Номер строки,
 * где был декларирован активный шаблон
 * @type {?number}
 */
DirObj.prototype.startTemplateLine = null;

/**
 * True, если декларируется шаблон-генератор
 * @type {?boolean}
 */
DirObj.prototype.generator = null;

/**
 * Название активного шаблона
 * @type {?string}
 */
DirObj.prototype.tplName = null;

/**
 * Название родительского активного шаблона
 * @type {?string}
 */
DirObj.prototype.parentTplName = null;

/**
 * Массив декларированных констант
 * @type {Array}
 */
DirObj.prototype.consts = null;

/**
 * Название родительского BEM класса
 * @type {string}
 */
DirObj.prototype.bemRef = '';

var template = ['template', 'interface', 'placeholder'],
	scopeModRgxp = new RegExp(`^${G_MOD}+`);

function concatProp(str) {
	return str.charAt(0) === '[' ? str : `.${str}`;
}

for (let i = -1; ++i < template.length;) {
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
			var lastName = null,
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
			this.startTemplateLine = this.info['line'];

			var nameRgxp = new RegExp(`^[^${symbols}_$[]`, 'i'),
				esprimaNameHackRgxp = new RegExp(`[${G_MOD}${L_MOD}]`, 'g');

			var tmpTplName = this.getFnName(command),
				tplName = this.pasteDangerBlocks(tmpTplName);

			if (!proto) {
				tmpTplName = this.replaceFileName(tmpTplName);

				let prfx = '',
					pos;

				// Шаблон-генератор
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
					return this.error(`can't declare template "${tplName}", try another name`);
				}

				this.info['template'] =
					this.tplName = tplName;

				if (this.name !== 'template' && !write[tplName]) {
					write[tplName] = false;
				}

				// Для возможности удобного пост-парсинга,
				// каждая функция снабжается комментарием вида:
				// /* Snakeskin template: название шаблона; параметры через запятую */
				this.save(
					(pos = `/* Snakeskin template: ${tplName}; ${this.getFnArgs(command).join(',').replace(/=(.*?)(?:,|$)/g, '')} */`),
					iface,
					jsDoc
				);

				if (jsDoc) {
					jsDoc += pos.length;
				}

				lastName = '';
				let tmpArr = tmpTplName
					.replace(nmssRgxp, '%')
					.replace(nmsRgxp, '.%')
					.replace(nmeRgxp, '')
					.split('.');

				let str = tmpArr[0],
					length = tmpArr.length,
					first = str.charAt(0),
					short = '';

				if (first === '%') {
					try {
						str = /* cbws */`['${
							applyDefEscape(
								this.returnEvalVal(
									this.prepareOutput(str.substring(1), true)
								)
							)
						}']`;

					} catch (err) {
						return this.error(err.message);
					}

				} else {
					short = str;
				}

				for (let i = 0; ++i < length;) {
					let el = tmpArr[i],
						custom = el.charAt(0) === '%';

					if (custom) {
						el = el.substring(1);
					}

					let def = `this${concatProp(str)}`;

					this.save(
						(pos = /* cbws */`
							if (${def} == null) {
								${def} = {};
							}

							${i === 1 && short ? `var ${short} = ${def};` : ''}
						`),

						iface,
						jsDoc
					);

					if (jsDoc) {
						jsDoc += pos.length;
					}

					if (custom) {
						try {
							str += /* cbws */`['${
								applyDefEscape(
									this.returnEvalVal(
										this.prepareOutput(el, true)
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
				this.save(`${length === 1 && short ? `var ${short} = ` : ''}this${concatProp(tplName)} = function ${prfx}${lastName !== null ? lastName : tplName}(`, iface);
			}

			this.info['template'] =
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

			// Валидация шаблона для наследования
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

			argsCache[tplName] = {};
			argsResCache[tplName] = {};
			outputCache[tplName] = {};
			extMap[tplName] = parentTplName;

			var flags = command.split('@=');

			if (this.parentTplName && flags.length === 1) {
				flags.push('@skip true');
			}

			for (let i = 0; ++i < flags.length;) {
				Snakeskin.Directions['__setSSFlag__'].call(this, flags[i].trim());
			}

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
				'$_',
				'TPL_NAME',
				'PARENT_TPL_NAME'
			];

			for (let i = -1; ++i < predefs.length;) {
				this.structure.vars[predefs[i]] = {
					value: predefs[i],
					scope: 0
				};
			}

			this.save(/* cbws */`
				var __THIS__ = this,
					__CALLEE__ = __ROOT__${concatProp(tplName)},
					callee = __CALLEE__;

				if (!callee.Blocks) {
					var __BLOCKS__ = __CALLEE__.Blocks = {},
						blocks = __BLOCKS__;
				}

				var __RESULT__ = ${this.declResult()},
					__COMMENT_RESULT__,
					__NODE__,
					\$_;

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

			// Подкючение внешних блоков и прототипов
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
				// Вызовы не объявленных прототипов внутри прототипа
				if (this.backTableI) {
					let cache = Object(this.backTable),
						ctx = proto.ctx;

					ctx.backTableI += this.backTableI;
					for (let key in cache) {
						/* istanbul ignore if */
						if (!cache.hasOwnProperty(key)) {
							continue;
						}

						for (let i = -1; ++i < cache[key].length;) {
							let el = cache[key][i];
							el.pos += proto.pos;
							el.outer = true;
							el.vars = this.structure.vars;
						}

						ctx.backTable[key] = ctx.backTable[key] ?
							ctx.backTable[key].concat(cache[key]) : cache[key];
					}
				}

				return;
			}

			var diff = this.getDiff(commandLength);

			cache[tplName] = this.source.substring(this.startTemplateI, this.i - diff);
			table[tplName] = this.blockTable;

			// Обработка наследования:
			// тело шаблона объединяется с телом родителя
			// и обработка шаблона начинается заново,
			// но уже как атомарного (без наследования)
			if (this.parentTplName) {
				this.info['line'] = this.startTemplateLine;
				this.lines.splice(this.startTemplateLine, this.lines.length);

				this.source = this.source.substring(0, this.startTemplateI) +
					this.getFullBody(tplName) +
					this.source.substring(this.i - diff);

				this.initTemplateCache(tplName);
				this.startDir(this.structure.name);

				this.i = this.startTemplateI - 1;
				this.parentTplName = null;

				this.blockTable = {};
				this.varCache[tplName] = {};

				return;
			}

			// Вызовы не объявленных прототипов
			if (this.backTableI) {
				let cache = Object(this.backTable);

				for (let key in cache) {
					/* istanbul ignore if */
					if (!cache.hasOwnProperty(key)) {
						continue;
					}

					for (let i = -1; ++i < cache[key].length;) {
						let el = cache[key][i];

						if (!el.outer) {
							continue;
						}

						let tmp = protoCache[tplName][key];
						if (!tmp) {
							return this.error(`proto "${key}" is not defined`);
						}

						this.res = this.res.substring(0, el.pos) +
							this.res.substring(el.pos).replace(
								el.label,
									(el.argsStr || '') + (el.recursive ? tmp.i + '++;' : tmp.body)
							);
					}
				}

				this.backTable = {};
				this.backTableI = 0;
			}

			var iface = this.structure.name === 'interface';

			if (iface) {
				this.save('};', true);

			} else {
				this.save(/* cbws */`
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

			delete this.info['template'];

			if (this.scope.length) {
				this.scope.pop();
			}
		}
	);
}
