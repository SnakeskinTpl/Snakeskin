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

var template = ['template', 'interface', 'placeholder'];
var scopeModRgxp = new RegExp(`^${G_MOD}+`);

/**
 * Заменить %fileName% в заданной строке на имя активного файла
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.replaceFileName = function (str) {
	var file = this.info['file'],
		basename;

	str = this.replaceDangerBlocks(str.replace(/(.?)%fileName%/g, (sstr, $1) => {
		if (!file) {
			this.error('placeholder %fileName% can\'t be used without "file" option');
			return '';
		}

		if (!IS_NODE) {
			this.error('placeholder %fileName% can\'t be used with live compilation in browser');
			return '';
		}

		if (!basename) {
			let path = require('path');
			basename = path['basename'](file, path['extname'](file));
		}

		var str = basename;

		if ($1) {
			if ($1 !== '.') {
				str = `${$1}'${str}'`;

			} else {
				str = $1 + str;
			}
		}

		return str;
	}));

	return str;
};

var nmRgxp = /\.|\[/m,
	nmssRgxp = /^\[/,
	nmsRgxp = /\[/gm,
	nmeRgxp = /]/gm;

/**
 * Подготовить заданную строку декларации имени шаблона
 * (вычисление выражений и т.д.)
 *
 * @param {string} name - исходная строка
 * @return {string}
 */
DirObj.prototype.prepareNameDecl = function (name) {
	name = this.replaceFileName(name);
	if (nmRgxp.test(name)) {
		let tmpArr = name
			.replace(nmssRgxp, '%')
			.replace(nmsRgxp, '.%')
			.replace(nmeRgxp, '')
			.split('.');

		let str = '',
			length = tmpArr.length;

		for (let i = -1; ++i < length;) {
			let el = tmpArr[i],
				custom = el.charAt(0) === '%';

			if (custom) {
				el = el.substring(1);
			}

			if (custom) {
				str += `['${this.evalStr(`return ${this.pasteDangerBlocks(this.prepareOutput(el, true))}`)}']`;
				continue;
			}

			str += str ? `.${el}` : el;
		}

		name = str;
	}

	return name.trim();
};

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
			var rank = {
				'template': 2,
				'interface': 1,
				'placeholder': 0
			};

			this.startDir(
				this.renderAs && rank[this.renderAs] < rank[type] ?
					this.renderAs : null
			);

			this.startTemplateI = this.i + 1;
			this.startTemplateLine = this.info['line'];

			var nameRgxp = /^[^a-z_$[]/i,
				esprimaNameHackRgxp = new RegExp(`[${G_MOD + L_MOD}]`, 'g');

			var tmpTplName = this.getFnName(command),
				tplName = this.pasteDangerBlocks(tmpTplName);

			var iface =
				this.name === 'interface';

			var lastName = null,
				proto = this.proto;

			if (!proto) {
				tmpTplName = this.replaceFileName(tmpTplName);

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

				// Декларация функции
				// с пространством имён или при экспорте в common.js
				if (nmRgxp.test(tmpTplName) || this.commonJS) {
					lastName = '';
					let tmpArr = tmpTplName
						.replace(nmssRgxp, '%')
						.replace(nmsRgxp, '.%')
						.replace(nmeRgxp, '')
						.split('.');

					let str = tmpArr[0],
						length = tmpArr.length,
						first = str.charAt(0);

					if (first === '%') {
						str = `['${this.evalStr(`return ${this.pasteDangerBlocks(this.prepareOutput(str.substring(1), true))}`)}']`;
					}

					for (let i = 0; ++i < length;) {
						let el = tmpArr[i],
							custom = el.charAt(0) === '%';

						if (custom) {
							el = el.substring(1);
						}

						let def = `this${concatProp(str)}`;

						this.save(
							(pos = `
								if (${def} == null) {
									${def} = {};
								}
							`),

							iface,
							jsDoc
						);

						if (jsDoc) {
							jsDoc += pos.length;
						}

						if (custom) {
							str += `['${this.evalStr(`return ${this.pasteDangerBlocks(this.prepareOutput(el, true))}`)}']`;
							continue;

						} else if (i === length - 1) {
							lastName = el;
						}

						str += `.${el}`;
					}

					tplName = str;
				}

				this.save(`this${concatProp(tplName)} = function ${prfx}${lastName !== null ? lastName : tplName}(`, iface);
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
				this.superStrongSpace = proto.superStrongSpace;
				this.strongSpace = proto.strongSpace;
				this.space = proto.space;
				return;
			}

			// Валидация шаблона для наследования
			var parentTplName;
			if (/\)\s+extends\s+/m.test(command)) {
				try {
					parentTplName = /\)\s+extends\s+(.*)/m.exec(command)[1];
					this.parentTplName = parentTplName;

					if (!parentTplName || nameRgxp.test(parentTplName)) {
						throw false;
					}

					esprima.parse(parentTplName.replace(esprimaNameHackRgxp, ''));

				} catch (ignore) {
					return this.error(`invalid "${this.name}" name for extend`);
				}

				parentTplName = this.prepareNameDecl(parentTplName);
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

			var args = this.prepareArgs(command, 'template', tplName, parentTplName);
			this.save(`${args.str}) {`, iface);

			if (args.scope) {
				this.scope.push(args.scope);
			}

			var predefs = ['callee', 'blocks', 'getTplResult', 'clearTplResult', '$_', 'TPL_NAME', 'PARENT_TPL_NAME'];

			for (let i = -1; ++i < predefs.length;) {
				this.structure.vars[predefs[i]] = {
					value: predefs[i],
					scope: 0
				};
			}

			this.save(`
				var __THIS__ = this,
					callee = __ROOT__${concatProp(tplName)};

				if (!callee.Blocks) {
					var __BLOCKS__ = callee.Blocks = {},
						blocks = __BLOCKS__;
				}

				var __RESULT__ = ${this.declResult()},
					__TMP_RESULT__,
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

				var TPL_NAME = '${applyDefEscape(tplName)}',
					PARENT_TPL_NAME${parentTplName ? ` = '${applyDefEscape(this.pasteDangerBlocks(parentTplName))}'` : ''};

				${args.defParams}
			`);

			var preProtos = this.preDefs[tplName];

			// Подкючение внешних блоков и прототипов
			if ((!extMap[tplName] || parentTplName) && preProtos) {
				this.source = this.source.substring(0, this.i + 1) +
					preProtos.text +
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
			}

			var iface = this.structure.name === 'interface';

			if (iface) {
				this.save('};', true);

			} else {
				this.save(`
						${this.consts.join('')}
						return ${this.returnResult()};
					};

					Snakeskin.cache['${applyDefEscape(this.pasteDangerBlocks(tplName))}'] = this${concatProp(tplName)};
				`);
			}

			this.save('/* Snakeskin template. */', iface);

			this.canWrite = true;
			this.tplName = null;

			delete this.info['template'];

			if (this.scope.length) {
				this.scope.pop();
			}
		}
	);
}