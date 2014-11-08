var nextLineRgxp = /\r?\n|\r/,
	whiteSpaceRgxp = /\s/,
	lineWhiteSpaceRgxp = / |\t/;

var startWhiteSpaceRgxp = new RegExp(`^[ \\t]*(?:${nextLineRgxp.source})`),
	endWhiteSpaceRgxp = new RegExp(`^(?:${nextLineRgxp.source})[ \\t]*$`);

var bEndRgxp = /[^\s\/]/,
	partRgxp = /[a-z]/,
	filterStartRgxp = new RegExp(`[!$${symbols}_]`);

var uid;

/**
 * Скомпилировать указанные шаблоны Snakeskin
 *
 * @expose
 * @param {(Element|string)} src - ссылка на DOM узел, где декларированы шаблоны,
 *     или исходный текст шаблонов
 *
 * @param {(Object|boolean)=} [opt_params] - дополнительные параметры запуска
 * @param {?string=} [opt_params.exports='default'] - тип экспорта шаблонов
 *
 * @param {Object=} [opt_params.context=false] - контекст для сохранение скомпилированного шаблона
 *     (устанавливает экспорт commonJS)
 *
 * @param {Object=} [opt_params.vars] - таблица суперглобальных переменных,
 *     которые будут добавлены в Snakeskin.Vars
 *
 * @param {?boolean=} [opt_params.cache=true] - если false, то наличие шаблона в кеше не будет проверятся
 * @param {Object=} [opt_params.debug] - объект, который будет содержать в себе отладочную информацию
 * @param {?boolean=} [opt_params.throws=false] - если true, то в случае ошибки и отсутствия обработчика ошибок -
 *     будет сгенерирована ошибка
 *
 * @param {?boolean=} [opt_params.localization=true] - если false, то блоки ` ... ` не заменяются на вызов i18n
 * @param {?string=} [opt_params.i18nFn='i18n'] - название функции для i18n
 * @param {Object=} [opt_params.language] - таблица фраз для локализации (найденные фразы будут заменены по ключу)
 * @param {Object=} [opt_params.words] - таблица, которая будет заполнена всеми фразами для локализации,
 *     которые используются в шаблоне
 *
 * @param {RegExp=} [opt_params.ignore] - регулярное выражение, которое задаёт пробельные символы для игнорирования
 * @param {?boolean=} [opt_params.autoReplace=false] - если false, то Snakeskin не делает дополнительных преобразований
 *     последовательностей
 *
 * @param {Object=} [opt_params.macros] - таблица символов для преобразования последовательностей
 * @param {?string=} [opt_params.renderAs] - тип рендеринга шаблонов, доступные варианты:
 *
 *     1) placeholder - все шаблоны рендерятся как placeholder-ы;
 *     2) interface - все шаблоны рендерятся как interface-ы;
 *     3) template - все шаблоны рендерятся как template-ы.
 *
 * @param {?string=} [opt_params.renderMode='stringConcat'] - режим рендеринга шаблонов, доступные варианты:
 *
 *     1) stringConcat - рендеринг шаблона в строку с простой конкатенацией через оператор сложения;
 *     2) stringBuffer - рендеринг шаблона в строку с конкатенацией через Snakeskin.StringBuffer;
 *     3) dom - рендеринг шаблона в набор команд из DOM API.
 *
 * @param {?string=} [opt_params.lineSeparator='\n'] - символ перевода строки
 * @param {?boolean=} [opt_params.tolerateWhitespace=false] - если true, то пробельные символы
 *     вставляются "как есть"
 *
 * @param {?boolean=} [opt_params.inlineIterators=false] - если true, то итераторы forEach и forIn
 *     будут развёрнуты в циклы
 *
 * @param {(string|boolean|null)=} [opt_params.doctype='html'] - тип генерируемого документа HTML:
 *     1) html;
 *     2) xml.
 *
 * @param {?boolean=} [opt_params.replaceUndef=true] - если false, то на вывод значений через директиву output
 *     не будет накладываться фильтр undef
 *
 * @param {?boolean=} [opt_params.escapeOutput=true] - если false, то на вывод значений через директиву output
 *     не будет накладываться фильтр html
 *
 * @param {?function(!Error)=} [opt_params.onError] - функция обратного вызова для обработки ошибок при трансляции
 * @param {?boolean=} [opt_params.prettyPrint] - если true, то полученный JS код шаблона
 *     отображается в удобном для чтения виде
 *
 * @param {Object=} [opt_info] - дополнительная информация о запуске (используется для сообщений об ошибках)
 * @param {?string=} [opt_info.file] - адрес исходного файла шаблонов
 *
 * @param {Object=} [opt_sysParams] - служебные параметры запуска
 * @param {?boolean=} [opt_sysParams.cacheKey=false] - если true, то возвращается кеш-ключ шаблона
 *
 * @param {Array=} [opt_sysParams.scope] - область видимости (контекст) директив
 * @param {Object=} [opt_sysParams.vars] - объект локальных переменных
 * @param {Array=} [opt_sysParams.consts] - массив деклараций констант
 *
 * @param {Object=} [opt_sysParams.proto] - объект настроек прототипа
 * @param {DirObj=} [opt_sysParams.parent] - ссылка на родительский объект
 *
 * @param {Array=} [opt_sysParams.lines] - массив строк шаблона (листинг)
 * @param {?boolean=} [opt_sysParams.needPrfx] - если true, то директивы декларируются как #{ ... }
 *
 * @return {(string|boolean|null)}
 */
Snakeskin.compile = function (src, opt_params, opt_info, opt_sysParams) {
	src = src || '';

	var NULL = {};
	var sp = opt_sysParams || {},
		p = opt_params ?
			Object(opt_params) : {};

	// GCC экспорт
	// >>>

	var ctx = s(p.context, p['context'])
		|| NULL;

	p.exports = s(p.exports, p['exports'])
		|| 'default';

	p.onError = s(p.onError, p['onError']);
	p.renderAs = s(p.renderAs, p['renderAs']);

	p.prettyPrint = s(p.prettyPrint, p['prettyPrint']) ||
		false;

	p.renderMode = s(p.renderMode, p['renderMode']) ||
		'stringConcat';

	var nl =
		p.lineSeparator = s(p.lineSeparator, p['lineSeparator']) || '\n';

	p.inlineIterators = s(p.inlineIterators, p['inlineIterators']) || false;
	p.tolerateWhitespace = s(p.tolerateWhitespace, p['tolerateWhitespace']) || false;

	p.replaceUndef = s(p.replaceUndef, p['replaceUndef']) !== false;
	p.escapeOutput = s(p.escapeOutput, p['escapeOutput']) !== false;

	p.throws = s(p.throws, p['throws']) || false;
	p.cache = s(p.cache, p['cache']) !== false;

	p.ignore = s(p.ignore, p['ignore']);
	p.autoReplace = s(p.autoReplace, p['autoReplace']) || false;
	p.macros = s(p.macros, p['macros']);

	p.debug = s(p.debug, p['debug']);
	p.doctype = s(p.doctype, p['doctype']);
	p.doctype = p.doctype !== false &&
		(p.doctype || 'xml');

	if (p.renderMode === 'dom') {
		p.doctype = false;
	}

	var vars =
		p.vars = s(p.vars, p['vars']) || {};

	for (let key in vars) {
		/* istanbul ignore if */
		if (!vars.hasOwnProperty(key)) {
			continue;
		}

		Snakeskin.Vars[key] = vars[key];
	}

	p.i18nFn = s(p.i18nFn, p['i18nFn']) || 'i18n';
	p.localization = s(p.localization, p['localization']) !== false;
	p.language = s(p.language, p['language']);

	var words =
		p.words = s(p.words, p['words']);

	// <<<
	// Отладочная информация
	// >>>

	var info = opt_info || {};

	info['line'] = info['line'] || 1;
	info['file'] = s(info.file, info['file']);

	var text;

	if (typeof src === 'object' && 'innerHTML' in src) {
		info['node'] = src;
		text = src.innerHTML.replace(startWhiteSpaceRgxp, '');

	} else {
		text = String(src);
	}

	// <<<
	// Работа с кешем
	// >>>

	var cacheKey = returnCacheKey(p, ctx, NULL);

	if (sp.cacheKey || sp['cacheKey']) {
		return cacheKey;
	}

	if (p.cache) {
		let tmp = returnCache(cacheKey, text, p, ctx,  NULL);

		if (tmp) {
			return tmp;
		}
	}

	// <<<
	// Работа с макросами
	// >>>

	var alb = ADV_LEFT_BLOCK,
		lb = LEFT_BLOCK,
		rb = RIGHT_BLOCK;

	var macros = {},
		mGroups = {};

	var inlineMacro = {},
		comboMacro = {};

	var blackMSymbolsRgxp = new RegExp(`[<\\/>${lb}${alb}${rb}]`);

	function clearMacroExpr() {
		expr = '';
		advExprPos = 0;
	}

	/**
	 * @param {Object} obj
	 * @param {?string=} [opt_include]
	 * @param {?boolean=} [opt_init]
	 */
	function setMacros(obj, opt_include, opt_init) {
		if (opt_init) {
			macros = {};
			mGroups = {};

			inlineMacro = {'\\': true};
			comboMacro = {};

			setMacros({
				'@quotes': {
					'"': [['«', '»'], ['‘', '’']],
					'\'': [['“', '”'], ['„', '“']]
				},

				'@shorts': {
					'(c)': '©',
					'(tm)': '™',

					'+-': '±',

					'[v]': '☑',
					'[x]': '☒',
					'[_]': '☐',

					'...': {
						inline: true,
						value: '…'
					},

					'-': {
						inline: true,
						value: '−'
					},

					'--': {
						inline: true,
						value: '—'
					}
				},

				'@adv': {
					'%lorem%':
						'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
						'Dolor dolores error facilis iusto magnam nisi praesentium voluptas. ' +
						'Delectus laudantium minus quia sapiente sunt temporibus voluptates! ' +
						'Explicabo iusto molestias quis voluptatibus.'
				},

				'@symbols': {
					'\\n': '\\n',
					'\\r': '\\r',
					'\\t': '\\t',
					'\\s': '&nbsp;'
				}
			});
		}

		if (obj == null) {
			obj = mGroups[opt_include];

			if (obj) {
				for (let key in obj) {
					/* istanbul ignore if */
					if (!obj.hasOwnProperty(key)) {
						continue;
					}

					delete obj[key];
					delete macros[key];
					delete comboMacro[key];
				}
			}

		} else {
			for (let key in obj) {
				/* istanbul ignore if */
				if (!obj.hasOwnProperty(key)) {
					continue;
				}

				let el = obj[key];

				if (key.charAt(0) === '@' && !opt_include) {
					setMacros(el, key);

				} else {
					if (opt_include) {
						mGroups[opt_include] =
							mGroups[opt_include] || {};
					}

					if (el) {
						if (blackMSymbolsRgxp.test(key)) {
							throw new Error(`Invalid macro "${key}"`);
						}

						macros[key] = el.value || el;

						if (Array.isArray(macros[key])) {
							comboMacro[key] = true;
						}

						let inline = el['inline'] ||
							el.inline;

						if (inline) {
							inlineMacro[key.charAt(0)] = true;
						}

						if (opt_include) {
							mGroups[opt_include][key] = macros[key];
						}

					} else {
						delete macros[key];
						delete comboMacro[key];

						if (opt_include) {
							delete mGroups[opt_include][key];
						}
					}
				}
			}
		}

		return macros;
	}

	if (sp.proto) {
		macros = p.macros;

	} else {
		setMacros(p.macros, null, true);
	}

	// <<<
	// Обработка подключений файлов
	// >>>

	var label = '';
	var dirname,
		filename;

	if (!sp.proto) {
		uid = Math.random()
			.toString(16)
			.replace('0.', '')
			.substring(0, 5);

		/** @expose */
		Snakeskin.LocalVars.include = {};

		if (IS_NODE && info['file']) {
			let path = require('path'),
				fs = require('fs');

			filename =
				info['file'] = path['normalize'](path['resolve'](info['file']));

			dirname = path['dirname'](filename);
			Snakeskin.LocalVars.include[filename] = 'index';

			if (fs['existsSync'](filename)) {
				let stat = fs['statSync'](filename);
				label = stat['mtime'];
			}
		}
	}

	// <<<
	// Основная логика
	// >>>

	var dir = new DirObj(String(text), {
		info: info,
		onError: p.onError,

		parent: sp.parent,
		proto: sp.proto,
		scope: sp.scope,
		vars: sp.vars,
		consts: sp.consts,

		needPrfx: sp.needPrfx,
		lines: sp.lines,

		doctype: p.doctype,
		exports: p.exports,

		renderAs: p.renderAs,
		renderMode: p.renderMode,

		lineSeparator: nl,
		tolerateWhitespace: p.tolerateWhitespace,
		inlineIterators: p.inlineIterators,

		replaceUndef: p.replaceUndef,
		escapeOutput: p.escapeOutput,

		ignore: p.ignore,
		autoReplace: p.autoReplace,
		macros: macros,

		localization: p.localization,
		i18nFn: p.i18nFn,
		language: p.language,

		throws: p.throws
	});

	dir.setMacros = setMacros;

	// Если true, то идёт содержимое директивы,
	// т.е. { ... }
	var begin = false,
		pseudoI = false;

	// Содержимое директивы
	var command = '';

	var commandTypeRgxp = /[^\s]+/,
		commandRgxp = /[^\s]+\s*/;

	var filterStart = false;

	// Количество открытых { внутри директивы
	var fakeBegin = 0;

	// Если true, то идёт запись простой строки
	var beginStr = false;

	// Если true, то предыдущий символ был не экранированный \
	var escape = false;

	// Если содержит значение отличное от false,
	// то значит идёт блок комметариев comment (///, /*, /**)
	var comment = false,
		commentStart = 0;

	// Если true, то значит идёт JSDoc
	var jsDoc = false,
		jsDocStart = false;

	// Флаги для обработки литералов строк и регулярных выражений внутри директивы
	var bOpen = false,
		bEnd,
		bEscape = false;

	var part = '',
		rPart = '';

	// Флаги для обработки XML тегов и атрибутов
	var tOpen = 0,
		tAttr = false,
		tAttrBegin = false,
		tAttrEscape = false;

	var tAttrBMap = {
		'"': true,
		'\'': true
	};

	// Флаги для обработки скобок при типографии
	var qOpen = 0,
		qType = null;

	var prfxI = 0;

	// Флаги для обработки типографских последовательностей
	var expr = '',
		exprPos = 0,
		advExprPos = 0;

	var prevCommentSpace = false,
		freezeI = 0,
		freezeTmp = 0;

	// Флаги для обработки строк-локализации
	var i18nStr = '',
		i18nStart = false,
		i18nDirStart = false;

	var clrL = true,
		templateMap = dir.getGroup('rootTemplate');

	/** @return {{macros, mGroups, inlineMacro, comboMacro, tOpen, tAttr, tAttrBegin, tAttrEscape, qOpen, qType, prfxI}} */
	dir.getCompileVars = function () {
		return {
			mGroups,
			inlineMacro,
			comboMacro,
			tOpen,
			tAttr,
			tAttrBegin,
			tAttrEscape,
			qOpen,
			qType,
			prfxI
		};
	};

	/** @param {{macros, mGroups, inlineMacro, comboMacro, tOpen, tAttr, tAttrBegin, tAttrEscape, qOpen, qType, prfxI}} obj */
	dir.setCompileVars = function (obj) {
		mGroups = obj.mGroups;
		inlineMacro = obj.inlineMacro;
		comboMacro = obj.comboMacro;
		tOpen = obj.tOpen;

		tAttr =
			dir.attr = obj.tAttr;

		tAttrBegin = obj.tAttrBegin;
		tAttrEscape =
			dir.attrEscape = obj.tAttrEscape;

		qOpen = obj.qOpen;
		qType = obj.qType;
		prfxI = obj.prfxI;
	};

	// Устанавливаем значения переменных родительской операции
	if (sp.proto) {
		dir.setCompileVars(sp.parent.getCompileVars());
	}

	while (++dir.i < dir.source.length) {
		let str = dir.source,
			struct = dir.structure;

		let el = str.charAt(dir.i),
			prev = str.charAt(dir.i - 1),
			next = str.charAt(dir.i + 1),
			next2str = str.substr(dir.i, 2);

		let rEl = el;
		let line = info['line'],
			lastLine = line - 1;

		let modLine = !dir.freezeLine &&
			!dir.proto &&
			dir.lines.length === line;

		if (freezeI) {
			freezeI--;
			modLine = false;
		}

		let nextLine = nextLineRgxp.test(el),
			currentClrL = clrL;

		if (nextLine) {
			if (next2str === '\r\n') {
				continue;
			}

			el = nl;
			clrL = true;
		}

		if (!dir.freezeLine) {
			if (nextLine) {
				if (modLine) {
					dir.lines[line] = '';
				}

				info['line']++;

			} else if (modLine) {
				dir.lines[lastLine] += el;
			}
		}

		let currentEscape = escape;
		let isPrefStart = !currentEscape &&
			!begin &&
			el === alb &&
			next === lb;

		if (whiteSpaceRgxp.test(el)) {
			// Внутри директивы
			if (begin) {
				if (bOpen) {
					el = escapeNextLine(el);

				} else {
					if (!dir.space) {
						el = ' ';
						dir.space = true;

					} else if (!comment) {
						continue;
					}
				}

			// Простой ввод вне деклараций шаблона
			} else if (!dir.tplName) {
				// Для JSDoc все символы остаются неизменны,
				// а в остальных случаях они игнорируются
				if (!comment && !jsDoc) {
					continue;
				}

			// Простой ввод внутри декларации шаблона
			} else {
				if (!dir.space && !dir.chainSpace && !dir.strongSpace && !dir.sysSpace) {
					el = dir.ignore && dir.ignore.test(el) ?
						'' : el;

					if (el && !dir.tolerateWhitespace) {
						el = ' ';
						dir.space = true;
					}

				} else if (!comment && !jsDoc) {
					continue;
				}
			}

		} else {
			clrL = false;

			if (!begin && !dir.chainSpace && !dir.strongSpace && !dir.sysSpace) {
				if (!currentEscape && (isPrefStart ? el === alb : el === lb)) {
					dir.prevSpace = dir.space;

				} else {
					dir.prevSpace = false;
				}
			}

			if (!comment) {
				prevCommentSpace = dir.space;
			}

			dir.space = false;
		}

		if (!bOpen) {
			// Обработка экранирования
			if (el === '\\' && sysEscapeMap[next] && (!begin || next === I18N) || escape) {
				escape = !escape;
			}

			if (escape) {
				continue;
			}

			// Обработка комментариев
			if (!currentEscape) {
				let commentType = returnComment(str, dir.i),
					endComment = returnComment(str, dir.i - MULT_COMMENT_END.length + 1) === MULT_COMMENT_END;

				let map = {
					[SINGLE_COMMENT]: true,
					[MULT_COMMENT_START]: true
				};

				if (map[commentType] || endComment) {
					if (!comment && !jsDoc) {
						if (commentType === SINGLE_COMMENT) {
							comment = commentType;

							if (modLine) {
								dir.lines[lastLine] += commentType.substring(1);
							}

							dir.i += commentType.length - 1;

						} else if (commentType === MULT_COMMENT_START) {
							if (str.substr(dir.i, JS_DOC.length) === JS_DOC && !begin) {
								if (beginStr && dir.isSimpleOutput()) {
									dir.save(`'${dir.$$()};`);
								}

								beginStr = true;
								jsDoc = true;
								jsDocStart = dir.res.length;

							} else {
								comment = commentType;
								commentStart = dir.i;

								if (modLine) {
									dir.lines[lastLine] += commentType.substring(1);
								}

								dir.i += commentType.length - 1;
							}
						}

					} else if (endComment && dir.i - commentStart > MULT_COMMENT_START.length) {
						if (comment === MULT_COMMENT_START) {
							comment = false;
							dir.space = prevCommentSpace;
							prevCommentSpace = false;
							continue;

						} else if (beginStr) {
							beginStr = false;
						}
					}

				} else if (nextLineRgxp.test(rEl) && comment === SINGLE_COMMENT) {
					comment = false;
					dir.space = prevCommentSpace;
					prevCommentSpace = false;
					continue;
				}
			}

			if (comment) {
				continue;
			}

			if (!jsDoc) {
				if (i18nStart) {
					if (!currentEscape && el === '"' && !dir.language) {
						el = '\\"';
					}

					if (currentEscape || el !== I18N) {
						if (pseudoI !== false) {
							continue;
						}

						i18nStr += el;

						if (dir.language) {
							continue;
						}
					}
				}

				// Начало управляющей конструкции
				// (не забываем следить за уровнем вложенностей {)
				if (isPrefStart || (el === lb && (begin || !currentEscape))) {
					if (begin) {
						fakeBegin++;

					} else if (!dir.needPrfx || isPrefStart) {
						if (isPrefStart) {
							dir.i++;
							dir.needPrfx = true;

							if (modLine) {
								dir.lines[lastLine] += lb;
							}
						}

						bEnd = true;
						begin = true;

						continue;
					}

				// Упраляющая конструкция завершилась
				} else if (el === rb && begin && (!fakeBegin || !(fakeBegin--))) {
					begin = false;

					let commandLength = command.length;
					command = command.trim();

					if (!command) {
						continue;
					}

					let short1 = command.charAt(0),
						short2 = command.substr(0, 2);

					let replacer = replacers[short2] ||
						replacers[short1];

					if (replacer) {
						command = replacer(command);
					}

					let commandType = commandTypeRgxp.exec(command)[0],
						isConst = commandType === 'const';

					commandType = Snakeskin.Directions[commandType] ?
						commandType : 'const';

					clearMacroExpr();

					if (templateMap[commandType] && !sp.proto) {
						qOpen = 0;
						qType = null;
					}

					// Директивы начинающиеся с _ считаются приватными
					// и вырезаются из листинга
					if (!dir.proto && commandType.charAt(0) === '_') {
						let source = `${alb}?${lb}__.*?__.*?${rb}`,
							rgxp = rgxpCache[source] || new RegExp(source);

						dir.lines[lastLine] = dir.lines[lastLine]
							.replace(rgxp, '');

						rgxpCache[source] = rgxp;
					}

					command = dir.replaceDangerBlocks((isConst || commandType !== 'const' ?
						command.replace(commandRgxp, '') : command));

					dir.space = dir.prevSpace;
					let fnRes = Snakeskin.Directions[commandType].call(
						dir,
						command,
						commandLength,
						commandType,
						jsDocStart
					);

					if (dir.brk) {
						return false;
					}

					if (dir.needPrfx) {
						if (dir.inline !== false) {
							if (getName(commandType) === 'end') {
								if (prfxI) {
									prfxI--;

									if (!prfxI) {
										dir.needPrfx = false;
									}

								} else {
									dir.needPrfx = false;
								}

							} else if (!prfxI) {
								dir.needPrfx = false;
							}

						} else {
							prfxI++;
						}
					}

					if (dir.text && !dir.chainSpace && !dir.strongSpace && !dir.sysSpace) {
						dir.space = false;
					}

					if (dir.skipSpace) {
						dir.space = true;
						dir.skipSpace = false;
					}

					jsDocStart = false;
					dir.text = false;

					if (fnRes === false) {
						begin = false;
						beginStr = false;
					}

					command = '';
					continue;

				} else if (dir.localization && !currentEscape && el === I18N) {
					if (i18nStart && i18nStr && words && !words[i18nStr]) {
						words[i18nStr] = i18nStr;
					}

					if (dir.language) {
						if (i18nStart) {
							let word = dir.language[i18nStr] || '';
							word = word.call ? word() : word;

							el = begin ?
								`'${applyDefEscape(word)}'` : word;

							i18nStart = false;
							i18nStr = '';

						} else {
							el = '';
							i18nStart = true;
						}

					} else {
						if (i18nStart) {
							i18nStart = false;
							i18nStr = '';

							if (begin) {
								el = '")';

								if (i18nDirStart) {
									freezeI += freezeTmp;
									freezeTmp = 0;

									dir.freezeLine--;
									i18nDirStart = false;
								}

							} else {
								let advStr = `${FILTER}!html${rb}`;
								freezeTmp = advStr.length;

								dir.source = str.substring(0, dir.i + 1) +
									advStr +
									str.substring(dir.i + 1);

								dir.i = Number(pseudoI);
								dir.freezeLine++;

								pseudoI = false;
								continue;
							}

						} else {
							i18nStart = true;

							if (begin) {
								el = `${dir.i18nFn}("`;

							} else {
								let diff = Number(dir.needPrfx) + 1;

								dir.source = str.substring(0, dir.i) +
									(dir.needPrfx ? alb : '') +
									lb +
									str.substring(dir.i);

								pseudoI = dir.i - diff;
								dir.i += diff;

								i18nDirStart = true;
								continue;
							}
						}
					}
				}
			}
		}

		// Запись команды
		if (begin) {
			if (beginStr && dir.isSimpleOutput()) {
				let prfx = '';

				if (dir.doctype && tAttr && !tAttrBegin) {
					prfx = '"';
					tAttrBegin = true;
					tAttrEscape = true;
				}

				dir.save(`${prfx}'${dir.$$()};`);
				beginStr = false;
			}

			// Обработка литералов строки и регулярных выражений внутри директивы
			if (!bOpen) {
				let skip = false;

				if (el === FILTER && filterStartRgxp.test(next)) {
					filterStart = true;
					bEnd = false;
					skip = true;

				} else if (filterStart && whiteSpaceRgxp.test(el)) {
					filterStart = false;
					bEnd = true;
					skip = true;
				}

				if (!skip) {
					if (escapeEndMap[el] || escapeEndWordMap[rPart]) {
						bEnd = true;
						rPart = '';

					} else if (bEndRgxp.test(el)) {
						bEnd = false;
					}

					if (partRgxp.test(el)) {
						part += el;

					} else {
						rPart = part;
						part = '';
					}
				}
			}

			if (!i18nStart) {
				if (escapeMap[el] && (el !== '/' || bEnd && command) && !bOpen) {
					bOpen = el;

				} else if (bOpen && (el === '\\' || bEscape)) {
					bEscape = !bEscape;

				} else if (escapeMap[el] && bOpen === el && !bEscape) {
					bOpen = false;
					bEnd = false;
				}
			}

			command += el;

		// Запись строки
		} else {
			if (jsDoc) {
				dir.save(el);

			} else if (!dir.tplName) {
				if (el === ' ') {
					continue;
				}

				if (currentClrL && !dir.tplName && (shortMap[el] || shortMap[next2str])) {
					let adv = dir.lines[lastLine].length - 1,
						source = dir.toBaseSyntax(dir.source, dir.i - adv);

					if (source.error) {
						return false;
					}

					dir.source = dir.source.substring(0, dir.i - adv) +
						source.str +
						dir.source.substring(dir.i + source.length - adv);

					dir.lines[lastLine] = dir.lines[lastLine].slice(0, -1);
					dir.i--;

					continue;
				}

				dir.error('text can\'t be used in the global space');
				return false;

			} else {
				if (struct.strong && !inside[struct.name]['text']) {
					if (el === ' ') {
						dir.space = false;
						continue;
					}

					dir.error(`directive "text" can't be used within the "${struct.name}"`);
					return false;
				}

				dir.startInlineDir('text');
				if (dir.isSimpleOutput()) {
					if (!beginStr) {
						dir.save(`${dir.$()}'`);
						beginStr = true;
					}

					if (dir.doctype) {
						if (el === '<') {
							tOpen++;
							clearMacroExpr();

						} else if (el === '>') {
							tOpen--;
							clearMacroExpr();
						}

						if (tAttr) {
							if (tAttrBegin && (tAttrEscape ? el === ' ' : tAttrBMap[el]) || !tOpen) {
								tAttr = false;

								if (tOpen) {
									tAttrBegin = false;
								}

								if (tAttrEscape) {
									el = `"${el}`;
									tAttrEscape = false;
								}

							// Установка флага о начале декларации xml атрибута
							} else if (!tAttrBegin) {
								tAttrBegin = true;
								if (!tAttrBMap[el]) {
									tAttrEscape = true;
									el = `"${el}`;
								}
							}

						// Начало декларации xml атрибута
						} else if (tOpen && el === '=') {
							tAttr = true;
						}

						dir.attr = Boolean(tOpen);
						dir.attrEscape = tAttrEscape;
					}

					if (dir.autoReplace) {
						if (!tOpen) {
							if (comboMacro[el]) {
								let val = dir.macros[el];

								if (!qType) {
									qType = el;
									el = val[0][0];
									qOpen++;

								} else if (el === qType) {
									qType = null;
									el = val[0][1];
									qOpen = 0;

								} else {
									el = (val[1] || val[0])[qOpen % 2 ? 0 : 1];
									qOpen++;
								}

								el = String(el.call ? el() : el);

							} else {
								if (whiteSpaceRgxp.test(el)) {
									clearMacroExpr();

								} else if (inlineMacro[el] && !inlineMacro[prev] && !dir.macros[expr + el]) {
									exprPos = dir.res.length;
									expr = el;

								} else {
									if (!expr) {
										exprPos = dir.res.length;
									}

									expr += el;
								}
							}
						}

						if (dir.macros[expr]) {
							let modStr = dir.res.substring(0, exprPos) +
								dir.res.substring(exprPos + expr.length + advExprPos);

							let val = dir.macros[expr].call ? dir.macros[expr]() : dir.macros[expr];
							val = String(val);

							advExprPos += val.length;

							dir.mod(() => {
								dir.res = modStr;
							});

							dir.save(val);

						} else {
							dir.save(applyDefEscape(el));
						}

					} else {
						dir.save(applyDefEscape(el));
					}
				}

				dir.inline = null;
				dir.structure = dir.structure.parent;
			}

			if (jsDoc && !beginStr) {
				jsDoc = false;
				dir.space = true;
			}
		}
	}

	// Если есть не закрытый XML тег,
	// то генерируем ошибку
	if (tOpen !== 0) {
		dir.error(`invalid XML declaration`);
		return false;
	}

	// Если количество открытых блоков не совпадает с количеством закрытых,
	// то генерируем ошибку
	if (begin || dir.structure.parent) {
		dir.error('missing closing or opening tag in the template');
		return false;
	}

	if (dir.proto) {
		sp.parent.setCompileVars(dir.getCompileVars());
		return dir.pasteDangerBlocks(dir.res);
	}

	dir.end(cacheKey, label);

	if (p.prettyPrint) {
		dir.res = beautify(dir.res);
		dir.res = dir.res.replace(new RegExp(nextLineRgxp.source, 'g'), nl);
	}

	dir.res += nl;

	if (p.debug) {
		p.debug['code'] = dir.res;
		p.debug['files'] = dir.files;
	}

	try {
		// Компиляция на сервере
		if (IS_NODE) {
			if (ctx !== NULL) {
				new Function(
					'module',

					'exports',
					'require',

					'__dirname',
					'__filename',

					dir.res
				)(
					{
						exports: ctx,
						require: require,

						id: filename,
						filename: filename,

						parent: module,
						children: [],

						loaded: true
					},

					ctx,
					require,

					dirname,
					filename
				);
			}

		// commonJS компиляция в браузере
		} else if (ctx !== NULL) {
			new Function(
				'module',
				'exports',
				'global',

				dir.res
			)(
				{
					exports: ctx
				},

				ctx,
				root
			);

		// Живая компиляция в браузере
		} else {
			dir.evalStr(dir.res);
		}

		saveFnCache(cacheKey, text, p, ctx, NULL);

	} catch (err) {
		delete info['line'];
		delete info['template'];
		dir.error(err.message);
		return false;
	}

	saveCache(cacheKey, text, p, dir);

	// Если брайзер поддерживает FileAPI,
	// то подключаем скомпилированный шаблон как внешний скрипт
	if (!IS_NODE) {
		setTimeout(() => {
			try {
				let blob = new Blob([dir.res], {
					type: 'application/javascript'
				});

				let script = document.createElement('script');
				script.src = URL.createObjectURL(blob);

				document.head.appendChild(script);

			} catch (ignore) {}
		}, 50);
	}

	return dir.res;
};
