Snakeskin.DirObj = DirObj;

/**
 * Объект управления директивами
 *
 * @constructor
 * @param {string} src - исходный текст шаблона
 *
 * @param {!Object} params - дополнительные параметры
 * @param {?function(!Error)=} [params.onError] - функция обратного вызова для обработки ошибок при трансляции
 *
 * @param {boolean} params.throws - если true, то в случае ошибки и отсутствия обработчика ошибок -
 *     будет сгенерирована ошибка
 *
 * @param {string} params.exports - тип экспорта шаблонов:
 *     1) global;
 *     2) commonJS.
 *
 * @param {boolean} params.inlineIterators - если true, то итераторы forEach и forIn
 *     будут развёрнуты в циклы
 *
 * @param {boolean} params.autoReplace - если false, то Snakeskin не делает дополнительных преобразований
 *     последовательностей
 *
 * @param {Object=} [params.macros] - таблица символов для преобразования последовательностей
 * @param {?string=} [params.renderAs] - тип рендеринга шаблонов, доступные варианты:
 *
 *     1) placeholder - все шаблоны рендерятся как placeholder-ы;
 *     2) interface - все шаблоны рендерятся как interface-ы;
 *     3) template - все шаблоны рендерятся как template-ы.
 *
 * @param {string|boolean} [params.doctype] - тип генерируемого документа HTML:
 *     1) html;
 *     2) xml.
 *
 * @param {boolean} params.localization - если false, то блоки ` ... ` не заменяются на вызов i18n
 * @param {string} params.i18nFn - название функции для i18n
 * @param {Object=} [params.language] - таблица фраз для локализации (найденные фразы будут заменены по ключу)
 *
 * @param {string} params.lineSeparator - символ перевода строки
 * @param {boolean} params.tolerateWhitespace - если true, то пробельные символы
 *     вставляются "как есть"
 *
 * @param {boolean} params.replaceUndef - если false, то на вывод значений через директиву output
 *     не будет накладываться фильтр undef
 *
 * @param {boolean} params.escapeOutput - если false, то на вывод значений через директиву output
 *     не будет накладываться фильтр html
 *
 * @param {string} params.renderMode - режим рендеринга шаблонов, доступные варианты:
 *
 *     1) stringConcat - рендеринг шаблона в строку с простой конкатенацией через оператор сложения;
 *     2) stringBuffer - рендеринг шаблона в строку с конкатенацией через Snakeskin.StringBuffer;
 *     3) dom - рендеринг шаблона в набор команд из DOM API.
 *
 * @param {Array=} [params.lines] - массив строк шаблона (листинг)
 * @param {DirObj=} [params.parent] - ссылка на родительский объект
 *
 * @param {?boolean=} [params.needPrfx] - если true, то директивы декларируются как #{ ... }
 * @param {RegExp=} [params.ignore] - регулярное выражение, которое задаёт пробельные символы для игнорирования
 *
 * @param {Array=} [params.scope] - область видимости (контекст) директив
 * @param {Object=} [params.vars] - объект локальных переменных
 * @param {Array=} [params.consts] - массив деклараций констант
 *
 * @param {Object=} [params.proto] - объект корневого прототипа
 * @param {Object=} [params.info] - дополнительная информация о запуске
 *     (используется для сообщений об ошибках)
 */
function DirObj(src, params) {
	for (let key in this) {
		if (this[key] && this[key].init) {
			this[key] = this[key].init();
		}
	}

	/** @type {DirObj} */
	this.parent = params.parent;

	/** @type {boolean} */
	this.throws = params.throws;

	/** @type {?function(!Error)} */
	this.onError = params.onError || null;

	/** @type {!Array} */
	this.scope = params.scope || [];

	/** @type {Object} */
	this.proto = params.proto;

	/** @type {Object} */
	this.info = params.info;

	/** @type {boolean} */
	this.needPrfx = params.needPrfx || false;

	/** @type {!Array} */
	this.lines = params.lines || [''];

	/** @type {string} */
	this.lineSeparator = params.lineSeparator;

	/**
	 * @expose
	 * @type {string}
	 */
	this.renderMode = params.renderMode;

	/**
	 * @expose
	 * @type {boolean}
	 */
	this.tolerateWhitespace = params.tolerateWhitespace;

	/**
	 * @expose
	 * @type {boolean}
	 */
	this.inlineIterators = params.inlineIterators;

	/**
	 * @expose
	 * @type {(string|boolean)}
	 */
	this.doctype = params.doctype;

	/**
	 * @expose
	 * @type {boolean}
	 */
	this.replaceUndef = params.replaceUndef;

	/**
	 * @expose
	 * @type {boolean}
	 */
	this.escapeOutput = params.escapeOutput;

	/**
	 * @expose
	 * @type {(?string|undefined)}
	 */
	this.renderAs = params.renderAs;

	/**
	 * @expose
	 * @type {string}
	 */
	this.exports = params.exports;

	/**
	 * @expose
	 * @type {boolean}
	 */
	this.autoReplace = params.autoReplace !== false;

	/**
	 * @expose
	 * @type {(Object|undefined)}
	 */
	this.macros = params.macros;

	/**
	 * @expose
	 * @type {boolean}
	 */
	this.localization = params.localization;

	/**
	 * @expose
	 * @type {string}
	 */
	this.i18nFn = params.i18nFn;

	/**
	 * @expose
	 * @type {(Object|undefined)}
	 */
	this.language = params.language;

	/**
	 * @expose
	 * @type {(RegExp|undefined)}
	 */
	this.ignore = params.ignore;

	/**
	 * Стек изменямых параметров локализации
	 * (те параметры, которые можно изменить директивой)
	 * @type {!Array}
	 */
	this.params = [
		{
			'@root': true,
			renderMode: this.renderMode,
			inlineIterators: this.inlineIterators,
			doctype: this.doctype,
			escapeOutput: this.escapeOutput,
			renderAs: this.renderAs,
			exports: this.exports,
			replaceUndef: this.replaceUndef,
			autoReplace: this.autoReplace,
			macros: this.macros,
			localization: this.localization,
			i18nFn: this.i18nFn,
			language: this.language,
			ignore: this.ignore,
			tolerateWhitespace: this.tolerateWhitespace
		}
	];

	if (params.consts) {
		/** @type {(Array|undefined)} */
		this.consts = params.consts;
	}

	/**
	 * Если true, то трансляция сбрасывается
	 * @type {boolean}
	 */
	this.brk = false;

	/**
	 * Название активной директивы
	 * @type {?string}
	 */
	this.name = null;

	/**
	 * Таблица директив, которые могут идти после исходной
	 * @type {Object}
	 */
	this.after = null;

	/**
	 * Если false, то шаблон не вставляется в результирующую JS строку
	 * @type {boolean}
	 */
	this.canWrite = true;

	// Флаги работы с пробельными символами
	// >>>

	/** @type {boolean} */
	this.space = false;

	/** @type {boolean} */
	this.skipSpace = false;

	/** @type {boolean} */
	this.prevSpace = false;

	/** @type {boolean} */
	this.chainSpace = false;

	/** @type {number} */
	this.strongSpace = 0;

	/** @type {number} */
	this.sysSpace = 0;

	/** @type {number} */
	this.freezeLine = 0;

	/** @type {boolean} */
	this.attr = false;

	/** @type {boolean} */
	this.attrEscape = false;

	// <<<

	/**
	 * Номер активной итерации
	 * @type {number}
	 */
	this.i = -1;

	/**
	 * Дерево блоков (прототипы, блоки, константы)
	 * @type {Object}
	 */
	this.blockStructure = null;

	/**
	 * Таблица блоков (прототипы, блоки, константы)
	 * @type {Object}
	 */
	this.blockTable = null;

	/**
	 * Кеш внешних блоков и прототипов
	 * @type {!Object}
	 */
	this.preDefs = {};

	/**
	 * Название активного внешнего прототипа или блока
	 * @type {?string}
	 */
	this.outerLink = null;

	/**
	 * Структура шаблонов
	 * @type {!Object}
	 */
	this.structure = {
		name: 'root',

		/** @type {?{name: string, parent: Object, params: !Object, stack: !Array, vars: Object, children: Array, sys: boolean, strong: boolean}} */
		parent: null,

		params: {},
		stack: [],

		vars: params.vars || {},
		children: [],

		sys: false,
		strong: false
	};

	/**
	 * Если true, то директива не имеет закрывающей части
	 * @type {?boolean}
	 */
	this.inline = null;

	/**
	 * Если true, то директива считается текстовой
	 * @type {boolean}
	 */
	this.text = false;

	/**
	 * Содержимое скобок (Escaper)
	 * @type {!Array}
	 */
	this.quotContent = [];

	/**
	 * Содержимое директив (для replaceTplVars)
	 * @type {!Array}
	 */
	this.dirContent = [];

	/**
	 * Содержимое блоков cdata
	 * @type {!Array}
	 */
	this.cDataContent = [];

	/**
	 * Таблица подключённых файлов
	 * @type {!Object}
	 */
	this.files = {};

	/**
	 * Объект модуля
	 * @type {{exports, require, id, key, root, filename, parent, children, loaded}}
	 */
	this.module = {
		exports: {},
		require: IS_NODE ?
			require : null,

		id: 0,
		key: [],

		root: null,
		filename: this.info['file'],
		parent: IS_NODE ?
			module : null,

		children: [],
		loaded: true
	};

	var s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

	/**
	 * Исходный текст шаблона
	 * @type {string}
	 */
	this.source = String(src)
		.replace(new RegExp(`${s}cdata${e}([\\s\\S]*?)${s}(?:\\/cdata|end cdata)${e}`, 'g'), (sstr, data) => {
			this.cDataContent.push(data);

			return '' +
				// Количество добавляемых строк
				`${s}__appendLine__ ${(data.match(new RegExp(nextLineRgxp.source, 'g')) || '').length}${e}` +

				// Метка для замены CDATA
				`__CDATA__${this.cDataContent.length - 1}_`
			;
		});

	/**
	 * Результирующий JS код
	 * @type {string}
	 */
	this.res = '';

	if (!this.proto) {
		let decl = /* cbws */`
			var __ROOT__ = this,
				self = this;

			var \$C = this.\$C != null ? this.\$C : Snakeskin.Vars.\$C,
				async = this.async != null ? this.async: Snakeskin.Vars.async;

			var __\$C__ = \$C,
				__async__ = async;

			var __APPEND__ = Snakeskin.appendChild,
				__FILTERS__ = Snakeskin.Filters,
				__VARS__ = Snakeskin.Vars,
				__LOCAL__ = Snakeskin.LocalVars,
				__STR__,
				__TMP__,
				__J__;

			var \$_ = __LOCAL__['\$_${uid}'];
		`;

		this.res += /* cbws */`
			This code is generated automatically, don\'t alter it. */
			(function () {
		`;

		if (this.exports === 'commonJS') {
			this.res += /* cbws */`
				var Snakeskin = global.Snakeskin;

				exports['init'] = function (obj) {
					Snakeskin = Snakeskin || obj instanceof Object ?
						obj : require(obj);

					delete exports.init;
					exec.call(exports);

					return exports;
				};

				function exec() {
					${decl}
			`;

		} else {
			this.res += decl;
		}
	}
}
