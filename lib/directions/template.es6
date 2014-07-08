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
var scopeModRgxp = /^@/;

/**
 * Вернуть имя функции из заданной строки
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
function getFnName(str) {
	var val = /[^(]+/.exec(str);
	return val ? val[0] : '';
}

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
		this.error('invalid syntax');
		return [];
	}

	if (arg) {
		res.push(arg);
	}

	res.params = params;
	return res;
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

			var file = this.info['file'];

			if (IS_NODE && file) {
				let path = require('path');
				command = this.replaceDangerBlocks(command.replace(/(.?)%fileName%/, (sstr, $1) => {
					var str = path.basename(this.info['file'], '.ss');

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

			var prfx = '';

			if (/\*/.test(command)) {
				prfx = '*';
				command = command.replace(/\*/, '');
			}

			var tmpTplName = getFnName(command),
				tplName = this.pasteDangerBlocks(tmpTplName);

			if (!tplName) {
				return this.error(`invalid "${this.name}" declaration`);
			}

			var iface =
				this.name === 'interface';

			this.info['template'] = tplName;

			if (this.name !== 'template') {
				if (!write[tplName]) {
					write[tplName] = false;
				}
			}

			this.tplName = tplName;
			this.blockStructure = {
				name: 'root',
				parent: null,
				children: []
			};

			this.blockTable = {};
			this.varCache[tplName] = {};

			var proto = this.proto;

			if (proto) {
				this.superStrongSpace = proto.superStrongSpace;
				this.strongSpace = proto.strongSpace;
				this.space = proto.space;
				return;
			}

			var parentTplName;
			if (/\s+extends\s+/m.test(command)) {
				try {
					parentTplName = this.pasteDangerBlocks(/\s+extends\s+(.*)/m.exec(command)[1]);
					this.parentTplName = parentTplName;

				} catch (ignore) {
					return this.error(`invalid "${this.name}" declaration`);
				}

				if (cache[parentTplName] === void 0) {
					return this.error(`the specified template ("${parentTplName}" -> "${tplName}") for inheritance is not defined`);
				}
			}

			this.initTemplateCache(tplName);
			extMap[tplName] = parentTplName;

			var argsList = this.getFnArgs(command);
			var args = argsList.join(','),
				pos;

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

			var lastName = null;

			// Декларация функции
			// с пространством имён или при экспорте в common.js
			if (/\.|\[/m.test(tmpTplName) || this.commonJS) {
				lastName = '';
				let tmpArr = tmpTplName

					// Заменяем [] на .
					.replace(/\[/gm, '.')
					.replace(/]/gm, '')

					.split('.');

				let str = tmpArr[0],
					length = tmpArr.length;

				for (let i = 1; i < length; i++) {
					let el = tmpArr[i];

					this.save(
						(pos = `
							if (this.${str} === void 0) {
								this.${str} = {};
							}
						`),

						iface,
						jsDoc
					);

					if (jsDoc) {
						jsDoc += pos.length;
					}

					if (escaperRgxp.test(el)) {
						str += `[${el}]`;
						continue;

					} else if (i === length - 1) {
						lastName = el;
					}

					str += `.${el}`;
				}
			}

			this.save(`this.${tmpTplName} = function ${prfx}${lastName !== null ? lastName : tmpTplName}(`, iface);

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

				} else {
					this.save(') {', iface);
				}
			}

			// Входные параметры родительского шаблона,
			// для которых есть значение по умолчанию,
			// ставятся как локальные переменные
			var defs = '';
			for (let i = 0; i < localVars.length; i++) {
				let el = localVars[i];

				if (!el) {
					continue;
				}

				defs += `{__const__ ${el.key.replace(scopeModRgxp, '')} = ${el.value}}`;
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
				var __RESULT__ = ${this.stringBuffer ? '[]' : '\'\''},
					\$_;

				var __FILTERS__ = Snakeskin.Filters,
					__VARS__ = Snakeskin.Vars,
					__STR__;

				var __RETURN__ = false,
					__RETURN_VAL__;

				var TPL_NAME = '${applyDefEscape(this.pasteDangerBlocks(tmpTplName))}',
					PARENT_TPL_NAME${parentTplName ? ` = '${applyDefEscape(this.pasteDangerBlocks(parentTplName))}'` : ''};

				var \$C = typeof ${$CExport} !== 'undefined' ? ${$CExport} : Snakeskin.Vars.\$C,
					async = typeof ${asyncExport} !== 'undefined' ? ${asyncExport} : Snakeskin.Vars.async;
			`);

			// Подкючение "внешних" прототипов
			if ((!extMap[tplName] || parentTplName) && this.preProtos[tplName]) {
				this.source = this.source.substring(0, this.i + 1) +
					this.preProtos[tplName].text +
					this.source.substring(this.i + 1);

				this.info['line'] -= this.preProtos[tplName].line;
				delete this.preProtos[tplName];
			}
		},

		function (command, commandLength) {
			var tplName = String(this.tplName);

			// Вызовы не объявленных прототипов внутри прототипа
			if (this.backTableI && this.proto) {
				let cache = Object(this.backTable);
				let ctx = this.proto.ctx;

				ctx.backTableI += this.backTableI;
				for (let key in cache) {
					if (!cache.hasOwnProperty(key)) {
						continue;
					}

					for (let i = 0; i < cache[key].length; i++) {
						let el = cache[key][i];

						el.pos += this.proto.pos;
						el.outer = true;
						el.vars = this.structure.vars;
					}

					ctx.backTable[key] = ctx.backTable[key] ? ctx.backTable[key].concat(cache[key]) : cache[key];
				}
			}

			if (this.proto) {
				return;
			}

			cache[tplName] = this.source.substring(this.startTemplateI, this.i - commandLength - 1);
			table[tplName] = this.blockTable;

			// Обработка наследования:
			// тело шаблона объединяется с телом родителя
			// и обработка шаблона начинается заново,
			// но уже как атомарного (без наследования)
			if (this.parentTplName) {
				this.info['line'] = this.startTemplateLine;

				this.source = this.source.substring(0, this.startTemplateI) +
					this.getExtStr(tplName) +
					this.source.substring(this.i - commandLength - 1);

				this.initTemplateCache(tplName);
				this.startDir(this.structure.name);

				this.i = this.startTemplateI - 1;
				this.parentTplName = null;
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

						let proto = protoCache[tplName][key];
						if (!proto) {
							return this.error(`proto "${key}" is not defined`);
						}

						this.res = this.res.substring(0, el.pos) +
							this.res.substring(el.pos).replace(
								el.label,
									(el.argsStr || '') + (el.recursive ? proto.i + '++;' : proto.body)
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
						${this.returnResult()}
					};

					if (typeof Snakeskin !== 'undefined') {
						Snakeskin.cache['${applyDefEscape(this.pasteDangerBlocks(tplName))}'] = this.${tplName};
					}
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