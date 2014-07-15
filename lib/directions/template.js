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

	for (var i = 0; i < str.length; i++) {
		var el = str[i];

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
		this.error((("invalid \"" + (this.name)) + "\" declaration"));
		return [];
	}

	if (arg) {
		res.push(arg);
	}

	res.params = params;
	return res;
};

for (var i = 0; i < template.length; i++) {
	Snakeskin.addDirective(
		template[i],

		{
			block: true,
			placement: 'global',
			notEmpty: true,
			group: 'template'
		},

		function (command, commandLength, type, jsDoc) {var this$0 = this;
			this.startDir(type === 'template' && this.interface ? 'interface' : null);

			this.startTemplateI = this.i + 1;
			this.startTemplateLine = this.info['line'];

			var file = this.info['file'];

			if (IS_NODE && file) {
				var path = require('path');
				command = this.replaceDangerBlocks(command.replace(/(.?)%fileName%/, function(sstr, $1)  {
					var str = path.basename(this$0.info['file'], '.ss');

					if ($1) {
						if ($1 !== '.') {
							str = (("" + $1) + ("'" + str) + "'");

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
				command = command.replace(prfx, '');
			}

			this.generator = Boolean(prfx);

			var nameRgxp = /^[^a-z_$]/i;
			var tmpTplName = getFnName(command),
				tplName = this.pasteDangerBlocks(tmpTplName);

			try {
				if (!tplName || nameRgxp.test(tplName)) {
					throw false;
				}

				esprima.parse(tplName);

			} catch (ignore) {
				return this.error((("invalid \"" + (this.name)) + "\" name"));
			}

			var iface =
				this.name === 'interface';

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

			var proto = this.proto;

			if (proto) {
				this.superStrongSpace = proto.superStrongSpace;
				this.strongSpace = proto.strongSpace;
				this.space = proto.space;
				return;
			}

			var parentTplName;
			if (/\bextends\b/m.test(command)) {
				try {
					parentTplName = this.pasteDangerBlocks(/\s+extends\s+(.*)/m.exec(command)[1]);
					this.parentTplName = parentTplName;

					if (!parentTplName || nameRgxp.test(parentTplName)) {
						throw false;
					}

				} catch (ignore) {
					return this.error((("invalid \"" + (this.name)) + "\" name for extend"));
				}

				if (cache[parentTplName] === void 0) {
					return this.error((("the specified template \"" + parentTplName) + "\" for inheritance is not defined"));
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
				(pos = (("/* Snakeskin template: " + tplName) + ("; " + (args.replace(/=(.*?)(?:,|$)/g, ''))) + " */")),
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
				var tmpArr = tmpTplName

					// Заменяем [] на .
					.replace(/\[/gm, '.')
					.replace(/]/gm, '')

					.split('.');

				var str = tmpArr[0],
					length = tmpArr.length;

				for (var i = 1; i < length; i++) {
					var el = tmpArr[i];

					this.save(
						(pos = (("\
\n							if (this." + str) + (" === void 0) {\
\n								this." + str) + " = {};\
\n							}\
\n						")),

						iface,
						jsDoc
					);

					if (jsDoc) {
						jsDoc += pos.length;
					}

					if (escaperRgxp.test(el) || !isNaN(Number(el))) {
						str += (("[" + el) + "]");
						continue;

					} else if (i === length - 1) {
						lastName = el;
					}

					str += ("." + el);
				}
			}

			this.save((("this." + tmpTplName) + (" = function " + prfx) + ("" + (lastName !== null ? lastName : tmpTplName)) + "("), iface);

			// Входные параметры
			var parentArgs = paramsCache[parentTplName],
				argsTable = paramsCache[tplName] = {},
				scope;

			for (var i$0 = 0; i$0 < argsList.length; i$0++) {
				var arg = argsList[i$0].split('=');
				arg[0] = arg[0].trim();

				if (arg.length > 1) {
					arg[1] = arg.slice(1).join('=').trim();
					arg.splice(2, arg.length);
				}

				if (scopeModRgxp.test(arg[0])) {
					if (scope) {
						return this.error((("invalid \"" + (this.name)) + "\" declaration"));

					} else {
						scope = arg[0].replace(scopeModRgxp, '');
					}
				}

				argsTable[arg[0]] = {
					i: i$0,
					key: arg[0],
					value: arg[1] && this.pasteDangerBlocks(arg[1].trim())
				};
			}

			// Если шаблон наследуется,
			// то подмешиваем ко входым параметрам шаблона
			// входные параметры родителя
			if (parentArgs) {
				for (var key in parentArgs) {
					if (!parentArgs.hasOwnProperty(key)) {
						continue;
					}

					var el$0 = parentArgs[key],
						current = argsTable[key];

					var cVal = current &&
						current.value === void 0;

					if (el$0.value !== void 0) {
						if (!argsTable[key]) {
							argsTable[key] = {
								local: true,
								i: el$0.i,
								key: key,
								value: el$0.value
							};

						} else if (cVal) {
							argsTable[key].value = el$0.value;
						}
					}
				}
			}

			if (scope) {
				this.scope.push(scope);
			}

			argsList = [];
			var localVars = [];

			for (var key$0 in argsTable) {
				if (!argsTable.hasOwnProperty(key$0)) {
					continue;
				}

				var el$1 = argsTable[key$0];

				if (el$1.local) {
					localVars[el$1.i] = el$1;

				} else {
					argsList[el$1.i] = el$1;
				}
			}

			// Инициализация параметров по умолчанию
			// (эээххх, когда же настанет ECMAScript 6 :()
			var defParams = '';
			for (var i$1 = 0; i$1 < argsList.length; i$1++) {
				var el$2 = argsList[i$1];
				el$2.key = el$2.key.replace(scopeModRgxp, '');

				this.save(el$2.key, iface);
				constICache[tplName][el$2.key] = el$2;

				if (el$2.value !== void 0) {
					defParams += (("" + (el$2.key)) + (" = " + (el$2.key)) + (" != null ? " + (el$2.key)) + (" : " + (this.prepareOutput(el$2.value, true))) + ";");
				}

				// После последнего параметра запятая не ставится
				if (i$1 !== argsList.length - 1) {
					this.save(',', iface);
				}
			}

			this.save(') {', iface);

			// Входные параметры родительского шаблона,
			// для которых есть значение по умолчанию,
			// ставятся как локальные переменные
			var defs = '';
			for (var i$2 = 0; i$2 < localVars.length; i$2++) {
				var el$3 = localVars[i$2];

				if (!el$3) {
					continue;
				}

				defs += (("{__const__ " + (el$3.key.replace(scopeModRgxp, ''))) + (" = " + (el$3.value)) + "}");
			}

			if (defs) {
				this.source = this.source.substring(0, this.i + 1) +
					defs +
					this.source.substring(this.i + 1);
			}

			var $CExport = this.prepareOutput('$C', true),
				asyncExport = this.prepareOutput('async', true);

			this.save((("\
\n				" + defParams) + ("\
\n\
\n				var __THIS__ = this;\
\n				var __RESULT__ = " + (this.declResult())) + (",\
\n					$_;\
\n\
\n				var __RETURN__ = false,\
\n					__RETURN_VAL__;\
\n\
\n				var TPL_NAME = '" + (applyDefEscape(this.pasteDangerBlocks(tmpTplName)))) + ("',\
\n					PARENT_TPL_NAME" + (parentTplName ? ((" = '" + (applyDefEscape(this.pasteDangerBlocks(parentTplName)))) + "'") : '')) + (";\
\n\
\n				var $C = typeof " + $CExport) + (" !== 'undefined' ? " + $CExport) + (" : Snakeskin.Vars.$C,\
\n					async = typeof " + asyncExport) + (" !== 'undefined' ? " + asyncExport) + " : Snakeskin.Vars.async;\
\n			"));

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
				var cache$0 = Object(this.backTable),
					ctx = this.proto.ctx;

				ctx.backTableI += this.backTableI;
				for (var key in cache$0) {
					if (!cache$0.hasOwnProperty(key)) {
						continue;
					}

					for (var i = 0; i < cache$0[key].length; i++) {
						var el = cache$0[key][i];

						el.pos += this.proto.pos;
						el.outer = true;
						el.vars = this.structure.vars;
					}

					ctx.backTable[key] = ctx.backTable[key] ? ctx.backTable[key].concat(cache$0[key]) : cache$0[key];
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

				this.blockTable = {};
				this.varCache[tplName] = {};

				return;
			}

			// Вызовы не объявленных прототипов
			if (this.backTableI) {
				var cache$1 = Object(this.backTable);

				for (var key$1 in cache$1) {
					if (!cache$1.hasOwnProperty(key$1)) {
						continue;
					}

					for (var i$3 = 0; i$3 < cache$1[key$1].length; i$3++) {
						var el$4 = cache$1[key$1][i$3];

						if (!el$4.outer) {
							continue;
						}

						var proto = protoCache[tplName][key$1];
						if (!proto) {
							return this.error((("proto \"" + key$1) + "\" is not defined"));
						}

						this.res = this.res.substring(0, el$4.pos) +
							this.res.substring(el$4.pos).replace(
								el$4.label,
									(el$4.argsStr || '') + (el$4.recursive ? proto.i + '++;' : proto.body)
							);
					}
				}

				this.backTable = {};
			}

			var iface = this.structure.name === 'interface';

			if (iface) {
				this.save('};', true);

			} else {
				this.save((("\
\n						" + (this.returnResult())) + ("\
\n					};\
\n\
\n					Snakeskin.cache['" + (applyDefEscape(this.pasteDangerBlocks(tplName)))) + ("'] = this." + tplName) + ";\
\n				"));
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