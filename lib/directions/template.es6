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

var template = ['template', 'interface', 'placeholder'];
var scopeModRgxp = new RegExp(`^${G_MOD}`);

/**
 * Вернуть имя функции из заданной строки
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.getFnName = function (str) {
	var tmp = /[^(]+/.exec(str),
		val = tmp ? tmp[0].trim() : '';

	if (!val) {
		this.error(`invalid "${this.name}" declaration`);
	}

	return val;
};

/**
 * Вернуть массив аргументов функции
 * из заданной строки
 *
 * @param {string} str - исходная строка
 * @return {!Array}
 */
DirObj.prototype.getFnArgs = function (str) {
	var res = [],
		params = false;

	var pOpen = 0,
		arg = '';

	for (let i = 0; i < str.length; i++) {
		let el = str[i];

		if (el === '(') {
			pOpen++;
			params = true;

			if (pOpen === 1) {
				continue;
			}

		} else if (el === ')') {
			pOpen--;

			if (!pOpen) {
				break;
			}
		}

		if (el === ',' && pOpen === 1) {
			res.push(arg);
			arg = '';
			continue;
		}

		if (pOpen) {
			arg += el;
		}
	}

	if (pOpen) {
		this.error(`invalid "${this.name}" declaration`);
		return [];
	}

	if (arg) {
		res.push(arg);
	}

	res.params = params;
	return res;
};

/**
 * Заменить %fileName% в заданной строке на имя активного файла
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.replaceFileName = function (str) {
	var file = this.info['file'];

	if (IS_NODE && file) {
		let path = require('path');
		str = this.replaceDangerBlocks(str.replace(/(.?)%fileName%/g, (sstr, $1) => {
			var str = path['basename'](file, '.ss');

			if ($1) {
				if ($1 !== '.') {
					str = `${$1}'${str}'`;

				} else {
					str = $1 + str;
				}
			}

			return str;
		}));
	}

	return str;
};

var nmRgxp = /\.|\[/m,
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
			.replace(nmsRgxp, '.%')
			.replace(nmeRgxp, '')
			.split('.');

		let str = tmpArr[0],
			length = tmpArr.length;

		for (let i = 1; i < length; i++) {
			let el = tmpArr[i],
				custom = el.charAt(0) === '%';

			if (custom) {
				el = el.substring(1);
			}

			if (custom) {
				str += `['${this.evalStr(`return ${this.pasteDangerBlocks(this.prepareOutput(el, true))}`)}']`;
				continue;
			}

			str += `.${el}`;
		}

		name = str;
	}

	return name.trim();
};

for (let i = 0; i < template.length; i++) {
	Snakeskin.addDirective(
		template[i],

		{
			block: true,
			placement: 'global',
			notEmpty: true,
			group: 'template'
		},

		function (command, commandLength, type, jsDoc) {
			this.startDir(type === 'template' && this.interface ? 'interface' : null);

			this.startTemplateI = this.i + 1;
			this.startTemplateLine = this.info['line'];

			var nameRgxp = /^[^a-z_$]/i;
			var tmpTplName = this.getFnName(command),
				tplName = this.pasteDangerBlocks(tmpTplName);

			var iface =
				this.name === 'interface';

			var lastName = null,
				proto = this.proto;

			var argsList,
				args,
				pos;

			if (!proto) {
				tmpTplName = this.replaceFileName(tmpTplName);
				let prfx = '';

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

					esprima.parse(tplName);

				} catch (ignore) {
					return this.error(`invalid "${this.name}" name`);
				}

				argsList = this.getFnArgs(command);
				args = argsList.join(',');

				// Для возможности удобного пост-парсинга,
				// каждая функция снабжается комментарием вида:
				// /* Snakeskin template: название шаблона; параметры через запятую */
				this.save(
					(pos = `/* Snakeskin template: ${tplName}; ${args.replace(/=(.*?)(?:,|$)/g, '')} */`),
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
						.replace(nmsRgxp, '.%')
						.replace(nmeRgxp, '')
						.split('.');

					let str = tmpArr[0],
						length = tmpArr.length;

					for (let i = 1; i < length; i++) {
						let el = tmpArr[i],
							custom = el.charAt(0) === '%';

						if (custom) {
							el = el.substring(1);
						}

						this.save(
							(pos = `
								if (this.${str} == null) {
									this.${str} = {};
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

				this.save(`this.${tplName} = function ${prfx}${lastName !== null ? lastName : tplName}(`, iface);
			}

			this.info['template'] = tplName;
			if (this.name !== 'template' && !write[tplName]) {
				write[tplName] = false;
			}

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
			if (/\bextends\b/m.test(command)) {
				try {
					parentTplName = /\s+extends\s+(.*)/m.exec(command)[1];
					this.parentTplName = parentTplName;

					if (!parentTplName || nameRgxp.test(parentTplName)) {
						throw false;
					}

				} catch (ignore) {
					return this.error(`invalid "${this.name}" name for extend`);
				}

				parentTplName = this.prepareNameDecl(parentTplName);
				if (cache[parentTplName] == null) {
					if (!this.interface) {
						return this.error(`the specified template "${parentTplName}" for inheritance is not defined`);
					}

					parentTplName =
						this.parentTplName = null;
				}
			}

			this.initTemplateCache(tplName);
			extMap[tplName] = parentTplName;

			// Входные параметры
			var parentArgs = paramsCache[parentTplName],
				argsTable = paramsCache[tplName] = {},
				scope;

			for (let i = 0; i < argsList.length; i++) {
				let arg = argsList[i].split('=');
				arg[0] = arg[0].trim();

				if (arg.length > 1) {
					arg[1] = arg.slice(1).join('=').trim();
					arg.splice(2, arg.length);
				}

				if (scopeModRgxp.test(arg[0])) {
					if (scope) {
						return this.error(`invalid "${this.name}" declaration`);

					} else {
						scope = arg[0].replace(scopeModRgxp, '');
					}
				}

				argsTable[arg[0]] = {
					i: i,
					key: arg[0],
					value: arg[1] && this.pasteDangerBlocks(arg[1].trim())
				};
			}

			// Если шаблон наследуется,
			// то подмешиваем ко входым параметрам шаблона
			// входные параметры родителя
			if (parentArgs) {
				for (let key in parentArgs) {
					if (!parentArgs.hasOwnProperty(key)) {
						continue;
					}

					let el = parentArgs[key],
						current = argsTable[key];

					let cVal = current &&
						current.value === void 0;

					if (el.value !== void 0) {
						if (!argsTable[key]) {
							argsTable[key] = {
								local: true,
								i: el.i,
								key: key,
								value: el.value
							};

						} else if (cVal) {
							argsTable[key].value = el.value;
						}
					}
				}
			}

			if (scope) {
				this.scope.push(scope);
			}

			argsList = [];
			var localVars = [];

			for (let key in argsTable) {
				if (!argsTable.hasOwnProperty(key)) {
					continue;
				}

				let el = argsTable[key];

				if (el.local) {
					localVars[el.i] = el;

				} else {
					argsList[el.i] = el;
				}
			}

			// Инициализация параметров по умолчанию
			// (эээххх, когда же настанет ECMAScript 6 :()
			var defParams = '';
			for (let i = 0; i < argsList.length; i++) {
				let el = argsList[i];
				el.key = el.key.replace(scopeModRgxp, '');

				this.save(el.key, iface);
				constICache[tplName][el.key] = el;

				if (el.value !== void 0) {
					defParams += `${el.key} = ${el.key} != null ? ${el.key} : ${this.prepareOutput(el.value, true)};`;
				}

				// После последнего параметра запятая не ставится
				if (i !== argsList.length - 1) {
					this.save(',', iface);
				}
			}

			this.save(') {', iface);

			// Входные параметры родительского шаблона,
			// для которых есть значение по умолчанию,
			// ставятся как локальные переменные
			var defs = '';
			for (let i = 0; i < localVars.length; i++) {
				let el = localVars[i];

				if (!el) {
					continue;
				}

				defs += `${this.needPrfx ? ALB : ''}{__const__ ${el.key.replace(scopeModRgxp, '')} = ${el.value}}`;
			}

			if (defs) {
				this.source = this.source.substring(0, this.i + 1) +
					defs +
					this.source.substring(this.i + 1);
			}

			var $CExport = this.prepareOutput('$C', true),
				asyncExport = this.prepareOutput('async', true);

			this.save(`
				${defParams}

				var __THIS__ = this;
				var __RESULT__ = ${this.declResult()},
					\$_;

				var __RETURN__ = false,
					__RETURN_VAL__;

				var TPL_NAME = '${applyDefEscape(tplName)}',
					PARENT_TPL_NAME${parentTplName ? ` = '${applyDefEscape(this.pasteDangerBlocks(parentTplName))}'` : ''};

				var \$C = __\$C__ || typeof ${$CExport} !== 'undefined' ?
					${$CExport} : Snakeskin.Vars.\$C;

				var async = __async__ || typeof ${asyncExport} !== 'undefined' ?
					${asyncExport} : Snakeskin.Vars.async;
			`);

			var preProtos = this.preProtos[tplName];

			// Подкючение "внешних" прототипов
			if ((!extMap[tplName] || parentTplName) && preProtos) {
				this.source = this.source.substring(0, this.i + 1) +
					preProtos.text +
					this.source.substring(this.i + 1);

				delete this.preProtos[tplName];
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

						for (let i = 0; i < cache[key].length; i++) {
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

					for (let i = 0; i < cache[key].length; i++) {
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
						return ${this.returnResult()};
					};

					Snakeskin.cache['${applyDefEscape(this.pasteDangerBlocks(tplName))}'] = this.${tplName};
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