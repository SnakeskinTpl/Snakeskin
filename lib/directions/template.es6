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
		block: true,
		placement: 'global',
		notEmpty: true,
		group: 'template'
	},

	(start = function (command, commandLength, jsDoc) {
		this.startDir();

		this.startTemplateI = this.i + 1;
		this.startTemplateLine = this.info['line'];

		try {
			var tmpTplName = /(.*?)\(/.exec(command)[1],
				tplName = this.pasteDangerBlocks(tmpTplName);

		} catch (ignore) {}

		if (!tplName) {
			return this.error(`invalid "${this.name}" declaration: ${command}`);
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

		if (this.proto) {
			return;
		}

		var parentTplName;
		if (/\s+extends\s+/m.test(command)) {
			try {
				parentTplName = this.pasteDangerBlocks(/\s+extends\s+(.*)/m.exec(command)[1]);
				this.parentTplName = parentTplName;

			} catch (ignore) {
				return this.error(`invalid "${this.name}" declaration: ${command}`);
			}

			if (cache[parentTplName] === void 0) {
				return this.error(`the specified template ("${parentTplName}" -> "${tplName}") for inheritance is not defined`);
			}
		}

		this.initTemplateCache(tplName);
		extMap[tplName] = parentTplName;

		// Входные параметры
		try {
			var args = /\((.*?)\)/.exec(command)[1];

		} catch (ignore) {
			return this.error(`invalid "${this.name}" declaration: ${command}`);
		}

		var pos;

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
		if (/\.|\[/m.test(tmpTplName) || this.commonJS) {
			let lastName = '';
			let escaperRgxp = /^__ESCAPER_QUOT__\d+_/;

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
		for (let i = 0; i < argsList.length; i++) {
			let arg = argsList[i].split('=');
			arg[0] = arg[0].trim();

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

				if (el.value !== void 0) {
					if (!argsTable[key]) {
						argsTable[key] = {
							local: true,
							i: el.i,
							key: key,
							value: el.value
						};

					} else if (current && current.value === void 0) {
						argsTable[key].value = el.value;
					}
				}
			}
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

			this.save(el.key, iface);
			constICache[tplName][el.key] = el;

			if (el.value !== void 0) {
				defParams += el.key + ' = ' + el.key + ' !== void 0 && ' +
					el.key + ' !== null ? ' + el.key + ' : ' + this.prepareOutput(el.value, true) + ';';
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

			defs += '{__const__ ' + el.key + ' = ' + el.value + '}';
		}

		if (defs) {
			this.source = this.source.substring(0, this.i + 1) +
				defs +
				this.source.substring(this.i + 1);
		}

		this.save(`${defParams}var __SNAKESKIN_RESULT__ = ${this.stringBuffer ? '[]' : '\'\''}, \$_;`);
		this.save(
			'var __RETURN__ = false, __RETURN_VAL__;' +
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
						return this.error('proto "' + key + '" is not defined');
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
			this.save(
					`return __SNAKESKIN_RESULT__${this.stringBuffer ? '.join(\'\')' : ''}; ` +
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
		block: true,
		placement: 'global',
		notEmpty: true,
		group: 'template'
	},

	start,
	end
);

Snakeskin.addDirective(
	'interface',

	{
		block: true,
		placement: 'global',
		notEmpty: true,
		group: 'template'
	},

	start,
	end
);