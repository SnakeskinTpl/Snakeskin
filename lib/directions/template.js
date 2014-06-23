/**
 * Номер итерации объявления шаблона
 * @type {number}
 */
DirObj.prototype.startTemplateI = 0;

/**
 * Номер строки объявления шаблона
 * @type {?number}
 */
DirObj.prototype.startTemplateLine = null;

/**
 * Название шаблона
 * @type {?string}
 */
DirObj.prototype.tplName = null;

/**
 * Название родительского шаблона
 * @type {?string}
 */
DirObj.prototype.parentTplName = null;

var start,
	end;

Snakeskin.addDirective(
	'template',

	{
		placement: 'global',
		notEmpty: true
	},

	(start = function (command, commandLength, jsDoc) {
		this.startDir();

		// Начальная позиция шаблона
		// +1 => } >>
		this.startTemplateI = this.i + 1;
		this.startTemplateLine = this.info['line'];

		// Имя + пространство имён шаблона
		try {
			var tmpTplName = /(.*?)\(/.exec(command)[1],
				tplName = this.pasteDangerBlocks(tmpTplName);

		} catch (ignore) {
			throw this.error('Invalid syntax');
		}

		if (!tplName) {
			throw this.error('Invalid ' + this.name + ' declaration');
		}

		var iface = this.name === 'interface';
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
			childs: []
		};

		this.blockTable = {};
		this.varCache[tplName] = {};

		if (this.proto) {
			return;
		}

		var parentTplName;
		if (/\s+extends\s+/m.test(command)) {
			try {
				parentTplName = this.pasteDangerBlocks(/\s+extends\s+(.*)/m.exec(command)[1]);
				this.parentTplName = parentTplName;

			} catch (ignore) {
				throw this.error('Invalid syntax');
			}

			if (cache[parentTplName] === void 0) {
				throw this.error(
					'The specified template ("' + parentTplName + '" -> "' + tplName + '") ' +
						'for inheritance is not defined'
				);
			}
		}

		this.initTemplateCache(tplName);
		extMap[tplName] = parentTplName;

		// Входные параметры
		try {
			var args = /\((.*?)\)/.exec(command)[1];

		} catch (ignore) {
			throw this.error('Invalid syntax');
		}

		var pos;

		// Для возможности удобного пост-парсинга,
		// каждая функция снабжается комментарием вида:
		// /* Snakeskin template: название шаблона; параметры через запятую */
		this.save(
			(pos = '/* Snakeskin template: ' +
				tplName +
				'; ' +
				args.replace(/=(.*?)(?:,|$)/g, '') +
			' */'),

			iface,
			jsDoc
		);

		if (jsDoc) {
			jsDoc += pos.length;
		}

		// Декларация функции
		// с пространством имён или при экспорте в common.js
		if (/\.|\[/m.test(tmpTplName) || this.commonJS) {
			var lastName = '';
			var escaperRgxp = /^__ESCAPER_QUOT__\d+_/;

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
					(pos = 'if (typeof ' + (this.commonJS ? 'exports.' : '') + str + ' === \'undefined\') { ' +
						(this.commonJS ? 'exports.' : i === 1 ? IS_NODE ? 'var ' : 'window.' : '') + str + ' = {};' +
					'}'),

					iface,
					jsDoc
				);

				if (jsDoc) {
					jsDoc += pos.length;
				}

				if (escaperRgxp.test(el)) {
					str += '[' + el + ']';
					continue;

				} else if (i === length - 1) {
					lastName = el;
				}

				str += '.' + el;
			}

			this.save(
				(this.commonJS ? 'exports.' : '') + tmpTplName + '= function ' + lastName + '(',
				iface
			);

		// Без простраства имён
		} else {
			this.save(
				(!IS_NODE ? 'window.' + tmpTplName + ' = ': '') + 'function ' + tmpTplName + '(',
				iface
			);
		}

		// Входные параметры
		var argsList = args.split(','),
			parentArgs = paramsCache[parentTplName];

		var argsTable = paramsCache[tplName] = {};
		for (var i$0 = 0; i$0 < argsList.length; i$0++) {
			var arg = argsList[i$0].split('=');
			arg[0] = arg[0].trim();

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

				if (el$0.value !== void 0) {
					if (!argsTable[key]) {
						argsTable[key] = {
							local: true,
							i: el$0.i,
							key: key,
							value: el$0.value
						};

					} else if (current && current.value === void 0) {
						argsTable[key].value = el$0.value;
					}
				}
			}
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

			this.save(el$2.key, iface);
			constICache[tplName][el$2.key] = el$2;

			if (el$2.value !== void 0) {
				defParams += el$2.key + ' = ' + el$2.key + ' !== void 0 && ' +
					el$2.key + ' !== null ? ' + el$2.key + ' : ' + this.prepareOutput(el$2.value, true) + ';';
			}

			// После последнего параметра запятая не ставится
			if (i$1 !== argsList.length - 1) {
				this.save(',', iface);

			} else {
				this.save(') {', iface);
			}
		}

		// Входные параметры родительского шаблона,
		// для которых есть значение по умолчанию,
		// ставятся как локальные переменные
		var defs = '';
		for (var i$2 = 0; i$2 < localVars.length; i$2++) {
			var el$3 = localVars[i$2];

			if (!el$3) {
				continue;
			}

			defs += '{__const__ ' + el$3.key + ' = ' + el$3.value + '}';
		}

		if (defs) {
			this.source = this.source.substring(0, this.i + 1) +
				defs +
				this.source.substring(this.i + 1);
		}

		this.save(defParams + 'var __SNAKESKIN_RESULT__ = \'\', $_;');
		this.save(
			'var TPL_NAME = \'' + this.applyDefEscape(this.pasteDangerBlocks(tmpTplName)) + '\';' +
			'var PARENT_TPL_NAME;'
		);

		if (parentTplName) {
			this.save('PARENT_TPL_NAME = \'' + this.applyDefEscape(this.pasteDangerBlocks(parentTplName)) + '\';');
		}

		// Подкючение "внешних" прототипов
		if ((!extMap[tplName] || parentTplName) && this.preProtos[tplName]) {
			this.source = this.source.substring(0, this.i + 1) +
				this.preProtos[tplName].text +
				this.source.substring(this.i + 1);

			this.info['line'] -= this.preProtos[tplName].line;
			delete this.preProtos[tplName];
		}
	}),

	(end = function (command, commandLength) {
		var tplName = this.tplName;

		// Вызовы не объявленных прототипов внутри прототипа
		if (this.backTableI && this.proto) {
			var cache$0 = Object(this.backTable);
			var ctx = this.proto.ctx;

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
						throw this.error('Proto "' + key$1 + '" is not defined');
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
			this.save(
					'return __SNAKESKIN_RESULT__; ' +
				'};' +

				'if (typeof Snakeskin !== \'undefined\') {' +
					'Snakeskin.cache[\'' +
						this.applyDefEscape(this.pasteDangerBlocks(tplName)) +
					'\'] = ' + (this.commonJS ? 'exports.' : '') + tplName + ';' +
				'}'
			);
		}

		this.save('/* Snakeskin template. */', iface);

		this.canWrite = true;
		this.tplName = null;

		delete this.info['template'];
	})
);

Snakeskin.addDirective(
	'placeholder',

	{
		placement: 'global',
		notEmpty: true
	},

	start,
	end
);

Snakeskin.addDirective(
	'interface',

	{
		placement: 'global',
		notEmpty: true
	},

	start,
	end
);