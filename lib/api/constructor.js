Snakeskin.DirObj = DirObj;

/**
 * Объект управления директивами
 *
 * @constructor
 * @implements {$$SnakeskinDirObj}
 *
 * @param {string} src - исходный текст шаблона
 * @param {$$SnakeskinDirObjParams} params - дополнительные параметры
 */
function DirObj(src, params) {
	for (let key in this) {
		if (this[key] && this[key].init) {
			this[key] = this[key].init();
		}
	}

	/** @type {DirObj} */
	this.parent = params.parent || null;

	/** @type {boolean} */
	this.throws = params.throws;

	/** @type {boolean} */
	this.useStrict = params.useStrict;

	/** @type {?function(!Error)} */
	this.onError = params.onError || null;

	/** @type {!Array} */
	this.scope = params.scope || [];

	/** @type {Object} */
	this.proto = params.proto || null;

	/** @type {!Object} */
	this.info = params.info;

	/** @type {boolean} */
	this.needPrfx = params.needPrfx || false;

	/** @type {!Array} */
	this.lines = params.lines || [''];

	/** @type {string} */
	this.lineSeparator = params.lineSeparator;

	/** @type {string} */
	this.renderMode = params.renderMode;

	/** @type {boolean} */
	this.tolerateWhitespace = params.tolerateWhitespace;

	/** @type {boolean} */
	this.inlineIterators = params.inlineIterators;

	/** @type {(string|boolean)} */
	this.doctype = params.doctype;

	/** @type {boolean} */
	this.replaceUndef = params.replaceUndef;

	/** @type {boolean} */
	this.escapeOutput = params.escapeOutput;

	/** @type {(?string|undefined)} */
	this.renderAs = params.renderAs;

	/** @type {string} */
	this.exports = params.exports;

	/** @type {boolean} */
	this.autoReplace = params.autoReplace !== false;

	/** @type {(Object|undefined)} */
	this.macros = params.macros;

	/** @type {string} */
	this.bemFilter = params.bemFilter;

	/** @type {boolean} */
	this.localization = params.localization;

	/** @type {string} */
	this.i18nFn = params.i18nFn;

	/** @type {(Object|undefined)} */
	this.language = params.language;

	/** @type {(RegExp|undefined)} */
	this.ignore = params.ignore;

	/**
	 * Стек изменяемых параметров
	 * (те параметры, которые можно изменить директивой)
	 * @type {!Array}
	 */
	this.params = [
		{
			'@root': true,
			'renderMode': this.renderMode,
			'inlineIterators': this.inlineIterators,
			'doctype': this.doctype,
			'escapeOutput': this.escapeOutput,
			'renderAs': this.renderAs,
			'replaceUndef': this.replaceUndef,
			'autoReplace': this.autoReplace,
			'macros': this.macros,
			'localization': this.localization,
			'i18nFn': this.i18nFn,
			'bemFilter': this.bemFilter,
			'language': this.language,
			'ignore': this.ignore,
			'tolerateWhitespace': this.tolerateWhitespace
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

	/** @type {boolean} */
	this.sysSpace = false;

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
		filename: this.info.file,
		parent: IS_NODE ?
			module : null,

		children: [],
		loaded: true
	};

	/**
	 * Исходный текст шаблона
	 * @type {string}
	 */
	this.source = this.replaceCData(String(src));

	/**
	 * Результирующий JS код
	 * @type {string}
	 */
	this.res = '';

	if (!this.proto) {
		this.res += /* cbws */`
			This code is generated automatically, don\'t alter it. */
			(function () {
				${this.useStrict ? '\'use strict\';' : ''}

				var __IS_NODE__ = false,
					__AMD__ = typeof define === 'function' && define.amd,
					__HAS_EXPORTS__ = typeof exports !== 'undefined',
					__EXPORTS__ = __HAS_EXPORTS__ ? exports : __AMD__ ? {} : this;

				try {
					__IS_NODE__ = typeof process === 'object' && Object.prototype.toString.call(process) === '[object process]';

				} catch (ignore) {}

				var Snakeskin = (__IS_NODE__ ? global : this).Snakeskin;

				function __INIT__(obj) {
					Snakeskin = Snakeskin ||
						(obj instanceof Object ? obj : void 0);

					if (__HAS_EXPORTS__) {
						delete __EXPORTS__.init;
					}

					if (__AMD__) {
						define(['Snakeskin'], function (ss) {
							Snakeskin = Snakeskin || ss;
							__EXEC__.call(__EXPORTS__);
							return __EXPORTS__;
						});

					} else {
						if (__IS_NODE__) {
							Snakeskin = Snakeskin || require(obj);
						}

						__EXEC__.call(__EXPORTS__);
						return __EXPORTS__;
					}
				}

				if (__HAS_EXPORTS__) {
					__EXPORTS__.init = __INIT__;
				}

				function __EXEC__() {
					var __ROOT__ = this,
						self = this;

					var __APPEND__ = Snakeskin.appendChild,
						__FILTERS__ = Snakeskin.Filters,
						__VARS__ = Snakeskin.Vars,
						__LOCAL__ = Snakeskin.LocalVars;

					${this.multiDeclVar('$_')}
		`;
	}
}
