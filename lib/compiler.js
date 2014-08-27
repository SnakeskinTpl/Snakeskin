var nextLineRgxp = /[\r\n\v]/,
	whiteSpaceRgxp = /\s/,
	lineWhiteSpaceRgxp = /[ \t]/;

var rgxpRgxp = /([./\\*+?[\](){}^$])/gm,
	bEndRgxp = /[^\s\/]/,
	partRgxp = /[a-z]/;

var tAttrRgxp = /[^'" ]/,
	uid;

/**
 * Скомпилировать указанные шаблоны Snakeskin
 *
 * @expose
 * @param {(Element|string)} src - ссылка на DOM узел, где декларированы шаблоны,
 *     или исходный текст шаблонов
 *
 * @param {(Object|boolean)=} [opt_params] - дополнительные параметры запуска, или если true,
 *     то шаблон компилируется с экспортом в стиле commonJS
 *
 * @param {?boolean=} [opt_params.commonJS=false] - если true, то шаблон компилируется с экспортом в стиле commonJS
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
 * @param {?boolean=} [opt_params.autoCorrect=true] - если false, то Snakeskin не делает дополнительных преобразований
 *     последовательностей
 *
 * @param {Object=} [opt_params.macros] - таблица символов для преобразования последовательностей
 *     {
 *         '"'   : [['«', '»'], ['„', '“']],
 *         '\''  : [['“', '”'], ['‘', '’']],
 *         '(c)' : '©',
 *         '(tm)': '™',
 *         '<-'  : '←',
 *         '->'  : '→',
 *         '...' : '…',
 *         '-'   : '−',
 *         '--'  : '—'
 *     }
 *
 * @param {?boolean=} [opt_params.interface=false] - если true, то все директивы template трактуются как interface
 *     и при наследовании можно задавать необъявленные родительские шаблоны
 *
 * @param {?boolean=} [opt_params.stringBuffer=false] - если true, то для конкатенации строк в шаблоне
 *     используется Snakeskin.StringBuffer
 *
 * @param {?boolean=} [opt_params.inlineIterators=false] - если true, то итераторы forEach и forIn
 *     будут развёрнуты в циклы
 *
 * @param {?boolean=} [opt_params.xml=true] - если false, то Snakeskin не делает дополнительных
 *     проверок текста как xml (экранируются атрибуты и проверяется закрытость тегов)
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
 * @param {?number=} [opt_sysParams.prfxI] - глубина префиксных директив
 *
 * @return {(string|boolean|null)}
 */
Snakeskin.compile = function (src, opt_params, opt_info, opt_sysParams) {
	src = src || '';
	var sp = opt_sysParams || {},
		p = opt_params ?
			Object(opt_params) : {};

	var NULL = {};
	var cjs,
		ctx =
			(cjs = s(p.context, p['context'])) || NULL;

	if (!cjs) {
		if (typeof opt_params === 'boolean') {
			cjs = opt_params;

		} else {
			cjs = s(p.commonJS, p['commonJS']);
		}
	}

	// GCC экспорт
	// >>>

	cjs = Boolean(cjs);
	p.onError = s(p.onError, p['onError']);

	p.prettyPrint = s(p.prettyPrint, p['prettyPrint']) || false;
	p.stringBuffer = s(p.stringBuffer, p['stringBuffer']) || false;
	p.inlineIterators = s(p.inlineIterators, p['inlineIterators']) || false;
	p.escapeOutput = s(p.escapeOutput, p['escapeOutput']) !== false;
	p.interface = s(p.interface, p['interface']) || false;

	p.throws = s(p.throws, p['throws']) || false;
	p.cache = s(p.cache, p['cache']) !== false;

	p.autoCorrect = s(p.autoCorrect, p['autoCorrect']) !== false;
	var macros =
		p.macros = s(p.macros, p['macros']) || {};

	var tMapKey = '';
	var comboTMap = {
		'.': true,
		'-': true
	};

	if (p.autoCorrect) {
		var tMapDef = {
			'"': [['«', '»'], ['„', '“']],
			'\'': [['“', '”'], ['‘', '’']],

			'(c)': '©',
			'(tm)': '™',

			'[v]': '☑',
			'[x]': '☒',
			'[_]': '☐',

			'<-': '←',
			'<-|': '↤',
			'->': '→',
			'|->': '↦',
			'<->': '↔',

			'...': '…',
			'-': '−',
			'--': '—'
		};

		for (var key in tMapDef) {
			if (!tMapDef.hasOwnProperty(key)) {
				continue;
			}

			macros[key] = macros[key] || tMapDef[key];
			tMapKey += (("" + key) + (":" + (macros[key].toString())) + "");
		}
	}

	var debug =
		p.debug = s(p.debug, p['debug']);

	var xml =
		p.xml = s(p.xml, p['xml']) !== false;

	var vars =
		p.vars = s(p.vars, p['vars']) || {};

	for (var key$0 in vars) {
		if (!vars.hasOwnProperty(key$0)) {
			continue;
		}

		Snakeskin.Vars[key$0] = vars[key$0];
	}

	p.i18nFn = s(p.i18nFn, p['i18nFn']) || 'i18n';

	var i18n =
		p.localization = s(p.localization, p['localization']) !== false;

	var lang =
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
		text = src.innerHTML.replace(/\s*?\n/, '');

	} else {
		text = String(src);
	}

	// <<<
	// Работа с кешем
	// >>>

	var cacheKey = lang ? null : [
		cjs,
		xml,

		p.inlineIterators,
		p.stringBuffer,
		p.escapeOutput,
		p.interface,
		p.prettyPrint,
		p.autoCorrect,
		tMapKey,

		i18n,
		p.i18nFn
	].join();

	if (sp.cacheKey || sp['cacheKey']) {
		return cacheKey;
	}

	if (p.cache) {
		// Кеширование шаблонов в node.js
		if (IS_NODE && ctx !== NULL && globalFnCache[cacheKey] && globalFnCache[cacheKey][text]) {
			var cache = globalFnCache[cacheKey][text];

			for (var key$1 in cache) {
				if (!cache.hasOwnProperty(key$1)) {
					continue;
				}

				ctx[key$1] = cache[key$1];
			}
		}

		// Базовое кешироние шаблонов
		if (globalCache[cacheKey] && globalCache[cacheKey][text]) {
			var tmp = globalCache[cacheKey][text],
				skip = false;

			if (words) {
				if (!tmp.words) {
					skip = true;

				} else {
					var w = Object(tmp.words);

					for (var key$2 in w) {
						if (!w.hasOwnProperty(key$2)) {
							continue;
						}

						words[key$2] = w[key$2];
					}
				}
			}

			if (debug) {
				if (!tmp.debug) {
					skip = true;

				} else {
					var d = Object(tmp.debug);

					for (var key$3 in d) {
						if (!d.hasOwnProperty(key$3)) {
							continue;
						}

						debug[key$3] = d[key$3];
					}
				}
			}

			if (!skip) {
				return tmp.text;
			}
		}
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
			var path = require('path');

			filename =
				info['file'] = path['normalize'](info['file']);

			dirname = path['dirname'](filename);
			Snakeskin.LocalVars.include[filename] = 'index';

			var fs = require('fs'),
				exists = fs['existsSync'] || path['existsSync'];

			if (exists(filename)) {
				var stat = fs['statSync'](filename);
				label = stat['mtime'];
			}
		}
	}

	// <<<
	// Основная логика
	// >>>

	var alb = ADV_LEFT_BLOCK,
		lb = LEFT_BLOCK,
		rb = RIGHT_BLOCK;

	var dir = new DirObj(String(text), {
		info: info,
		commonJS: cjs,
		proto: sp.proto,
		scope: sp.scope,
		vars: sp.vars,
		consts: sp.consts,
		onError: p.onError,
		stringBuffer: p.stringBuffer,
		inlineIterators: p.inlineIterators,
		autoCorrect: p.autoCorrect,
		xml: xml,
		escapeOutput: p.escapeOutput,
		interface: p.interface,
		throws: p.throws,
		needPrfx: sp.needPrfx,
		prfxI: sp.prfxI,
		lines: sp.lines,
		parent: sp.parent
	});

	var templateMap = dir.getGroup('rootTemplate');

	// Если true, то идёт содержимое директивы,
	// т.е. { ... }
	var begin = false,
		pseudoI = false;

	// Содержимое директивы
	var command = '';

	var commandTypeRgxp = /[^\s]+/m,
		commandRgxp = /[^\s]+\s*/m;

	var filterStart = false,
		filterStartRgxp = /[a-z]/i;

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

	// Флаги для обработки XML тегов и атрибутов
	var tOpen = 0,
		tAttr = false,
		tAttrBegin = false,
		tAttrEscape = false;

	// Флаги для обработки скобок при типографии
	var qOpen = 0,
		qType = null;

	// Флаги для обработки типографских последовательностей
	var expr = '',
		exprPos = 0;

	var prevSpace,
		prevCommentSpace = false,
		freezeI = 0,
		freezeTmp = 0;

	// Флаги для обработки строк-локализации
	var i18nStr = '',
		i18nStart = false,
		i18nDirStart = false;

	var clrL = true;
	var part = '',
		rPart = '';

	while (++dir.i < dir.source.length) {;var $retPrim$0, $value$0 = (function(){
		var str = dir.source,
			struct = dir.structure;

		var el = str.charAt(dir.i),
			prev = str.charAt(dir.i - 1),
			next = str.charAt(dir.i + 1),
			next2str = el + next;

		var rEl = el;
		var line = info['line'],
			lastLine = line - 1;

		var modLine = !dir.freezeLine &&
			!dir.proto &&
			dir.lines.length === line;

		if (freezeI) {
			freezeI--;
			modLine = false;
		}

		var nextLine = nextLineRgxp.test(el),
			currentClrL = clrL;

		if (nextLine) {
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

		if (whiteSpaceRgxp.test(el)) {
			// Внутри директивы
			if (begin) {
				if (bOpen) {
					el = escapeNextLine(el);

				} else {
					if (!dir.space) {
						el = ' ';

						if (el) {
							dir.space = true;
						}

					} else if (!comment) {
						return;
					}
				}

			// Простой ввод вне деклараций шаблона
			} else if (!dir.tplName) {
				// Для JSDoc все символы остаются неизменны,
				// а в остальных случаях они игнорируются
				if (!comment && !jsDoc) {
					return;
				}

			// Простой ввод внутри декларации шаблона
			} else {
				if (!dir.space && !dir.strongSpace && !dir.superStrongSpace) {
					el = dir.ignoreRgxp && dir.ignoreRgxp.test(el) ?
						'' : ' ';

					if (el) {
						dir.space = true;
					}

				} else if (!comment && !jsDoc) {
					return;
				}
			}

		} else {
			clrL = false;

			if ((dir.needPrfx ? el !== alb : el !== lb) && !begin) {
				prevSpace = dir.space;
			}

			if (!comment) {
				prevCommentSpace = dir.space;
			}

			dir.space = false;
		}

		if (!bOpen) {
			var currentEscape = escape;

			// Обработка экранирования
			if ((el === '\\' && (sysEscapeMap[next] && (begin ? !includeSysEscapeMap[next] : true))) || escape) {
				escape = !escape;
			}

			if (escape) {
				return;
			}

			var next3str = next2str + str.charAt(dir.i + 2);

			// Обработка комментариев
			if (!currentEscape) {
				if (el === SINGLE_COMMENT.charAt(0) || el === MULT_COMMENT_START.charAt(0)) {
					if (!comment && !jsDoc) {
						if (next3str === SINGLE_COMMENT) {
							comment = next3str;

							if (modLine) {
								dir.lines[lastLine] += next3str.substring(1, 3);
							}

							dir.i += 2;

						} else if (next2str === MULT_COMMENT_START) {
							if (next3str === JS_DOC && !begin) {
								if (beginStr && dir.isSimpleOutput()) {
									dir.save((("'" + (dir.$$())) + ";"));
								}

								beginStr = true;
								jsDoc = true;
								jsDocStart = dir.res.length;

							} else {
								comment = next2str;
								commentStart = dir.i;

								if (modLine) {
									dir.lines[lastLine] += next2str.charAt(1);
								}

								dir.i++;
							}
						}

					} else if (prev === MULT_COMMENT_END.charAt(0) && dir.i - commentStart > 2) {
						if (comment === MULT_COMMENT_START) {
							comment = false;
							dir.space = prevCommentSpace;
							prevCommentSpace = false;
							return;

						} else if (beginStr) {
							beginStr = false;
						}
					}

				} else if (nextLineRgxp.test(rEl) && comment === SINGLE_COMMENT) {
					comment = false;
					dir.space = prevCommentSpace;
					prevCommentSpace = false;
					return;
				}
			}

			if (comment) {
				return;
			}

			if (!jsDoc) {
				if (i18nStart) {
					if (!currentEscape && el === '"' && !lang) {
						el = '\"';
					}

					if (currentEscape || el !== I18N) {
						if (pseudoI !== false) {
							return;
						}

						i18nStr += el;

						if (lang) {
							return;
						}
					}
				}

				var isPrefStart = !currentEscape &&
					!begin &&
					el === alb &&
					next === lb;

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

						return;
					}

				// Упраляющая конструкция завершилась
				} else if (el === rb && begin && (!fakeBegin || !(fakeBegin--))) {
					begin = false;

					var commandLength = command.length;
					command = command.trim();

					if (!command) {
						return;
					}

					var short1 = command.charAt(0),
						short2 = command.substr(0, 2);

					var replacer = replacers[short2] || replacers[short1];

					if (replacer) {
						command = replacer(command);
					}

					var commandType = commandTypeRgxp.exec(command)[0],
						isConst = commandType === 'const';

					commandType = Snakeskin.Directions[commandType] ?
						commandType : 'const';

					expr = '';
					if (templateMap[commandType]) {
						qOpen = 0;
						qType = null;
					}

					// Директивы начинающиеся с _ считаются приватными
					// и вырезаются из листинга
					if (!dir.proto && commandType.charAt(0) === '_') {
						var source = (("" + (dir.needPrfx ? alb : '')) + ("" + lb) + ("\\s*" + (command.replace(rgxpRgxp, '\\$1'))) + ("\\s*" + rb) + ""),
							rgxp = rgxpCache[source] || new RegExp(source);

						dir.lines[lastLine] = dir.lines[lastLine]
							.replace(rgxp, '');

						rgxpCache[source] = rgxp;
					}

					command = dir.replaceDangerBlocks((isConst || commandType !== 'const' ?
						command.replace(commandRgxp, '') : command));

					var fnRes = Snakeskin.Directions[commandType].call(
						dir,
						command,
						commandLength,
						commandType,
						jsDocStart
					);

					if (dir.brk) {
						{$retPrim$0 = true;return false;}
					}

					if (dir.needPrfx) {
						if (dir.inline !== false) {
							if (getName(commandType) === 'end') {
								if (dir.prfxI) {
									dir.prfxI--;

									if (!dir.prfxI) {
										dir.needPrfx = false;
									}

								} else {
									dir.needPrfx = false;
								}

							} else if (!dir.prfxI) {
								dir.needPrfx = false;
							}

						} else {
							dir.prfxI++;
						}
					}

					if (!dir.text && prevSpace) {
						dir.space = true;
					}

					jsDocStart = false;
					dir.text = false;

					if (fnRes === false) {
						begin = false;
						beginStr = false;
					}

					command = '';
					return;

				} else if (i18n && !currentEscape && el === I18N) {
					if (i18nStart && i18nStr && words && !words[i18nStr]) {
						words[i18nStr] = i18nStr;
					}

					if (lang) {
						if (i18nStart) {
							var word = String(lang[i18nStr] || '');

							el = begin ?
								(("'" + (applyDefEscape(word))) + "'") : word;

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
								var advStr = (("" + FILTER) + ("!html" + rb) + "");
								freezeTmp = advStr.length;

								dir.source = str.substring(0, dir.i + 1) +
									advStr +
									str.substring(dir.i + 1);

								dir.i = Number(pseudoI);
								dir.freezeLine++;

								pseudoI = false;
								return;
							}

						} else {
							i18nStart = true;

							if (begin) {
								el = (("" + (p.i18nFn)) + "(\"");

							} else {
								var diff = Number(dir.needPrfx) + 1;

								dir.source = str.substring(0, dir.i) +
									(dir.needPrfx ? alb : '') +
									lb +
									str.substring(dir.i);

								pseudoI = dir.i - diff;
								dir.i += diff;

								i18nDirStart = true;
								return;
							}
						}
					}
				}
			}
		}

		// Запись команды
		if (begin) {
			if (beginStr && dir.isSimpleOutput()) {
				var prfx = '';

				if (xml && tAttr && !tAttrBegin) {
					prfx = '"';
					tAttrBegin = true;
					tAttrEscape = true;
				}

				dir.save((("" + prfx) + ("'" + (dir.$$())) + ";"));
				beginStr = false;
			}

			// Обработка литералов строки и регулярных выражений внутри директивы
			if (!bOpen) {
				var skip = false;

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
				if (escapeMap[el] && (el === '/' ? bEnd && command : true) && !bOpen) {
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
				dir.save(applyDefEscape(el));

			} else if (!dir.tplName) {
				if (el === ' ') {
					return;
				}

				if (currentClrL && !dir.tplName && (shortMap[el] || shortMap[next2str])) {
					var adv = dir.lines[lastLine].length - 1,
						source$0 = dir.toBaseSyntax(dir.source, dir.i - adv);

					if (source$0.error) {
						{$retPrim$0 = true;return false;}
					}

					dir.source = dir.source.substring(0, dir.i - adv) +
						source$0.str +
						dir.source.substring(dir.i + source$0.length - adv);

					dir.lines[lastLine] = dir.lines[lastLine].slice(0, -1);
					dir.i--;

					return;
				}

				dir.error('text can\'t be used in the global space');
				{$retPrim$0 = true;return false;}

			} else {
				if (struct.strong && !inside[struct.name]['text']) {
					if (el === ' ') {
						dir.space = false;
						return;
					}

					dir.error((("directive \"text\" can't be used within the \"" + (struct.name)) + "\""));
					{$retPrim$0 = true;return false;}
				}

				dir.startInlineDir('text');
				if (dir.isSimpleOutput()) {
					if (!beginStr) {
						dir.save((("" + (dir.$())) + "'"));
						beginStr = true;
					}

					if (xml) {
						if (el === '<' && next !== '-') {
							tOpen++;

						} else if (el === '>' && prev !== '-') {
							if (tOpen) {
								tOpen--;

							} else {
								el = '&gt;'
							}
						}

						if (tOpen > 1) {
							dir.error(("invalid XML declaration"));
							{$retPrim$0 = true;return false;}
						}

						if (tAttr) {
							if (el === ' ' || !tOpen) {
								if (tAttrBegin) {
									tAttr = false;
									tAttrBegin = false;

									if (tAttrEscape) {
										el = ("\"" + el);
										tAttrEscape = false;
									}

								} else if (!tOpen) {
									tAttr = false;
								}

							} else if (!tAttrBegin) {
								tAttrBegin = true;

								if (el !== '"' && el !== '\'') {
									tAttrEscape = true;
									el = ("\"" + el);
								}
							}

						} else if (tOpen && el === '=') {
							tAttr = true;
						}

						dir.attr = Boolean(tOpen);
					}

					if (dir.autoCorrect) {
						if (!tOpen || !tAttrBegin) {
							if (el === '"' || el === '\'') {
								var val = macros[qType || el];

								if (!qType) {
									qType = el;
									el = val[0][0];
									qOpen++;

								} else if (el === qType) {
									qType = null;
									el = val[0][1];
									qOpen = 0;

								} else {
									el = val[1][qOpen % 2 ? 0 : 1];
									qOpen++;
								}

							} else {
								if (whiteSpaceRgxp.test(el)) {
									expr = '';

								/*} else if (comboTMap[el] && !comboTMap[prev]) {
									exprPos = dir.res.length;
									expr = el;*/

								} else {
									if (!expr) {
										exprPos = dir.res.length;
									}

									expr += el;
								}
							}
						}

						console.log(expr);

						if (macros[expr]) {
							var modStr = dir.res.substring(0, exprPos) + dir.res.substring(exprPos + expr.length);

							dir.mod(function()  {
								dir.res = modStr;
							});

							dir.save(macros[expr]);

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
	})();if($retPrim$0===true){$retPrim$0=void 0;return $value$0}}

	// Если есть не закрытый XML тег,
	// то генерируем ошибку
	if (tOpen) {
		dir.error(("invalid XML declaration"));
		return false;
	}

	// Если количество открытых блоков не совпадает с количеством закрытых,
	// то генерируем ошибку
	if (begin || dir.structure.parent) {
		dir.error('missing closing or opening tag in the template');
		return false;
	}

	if (dir.proto) {
		return dir.res;
	}

	// Обратная замена CDATA
	dir.res = dir.pasteDangerBlocks(dir.res)
		.replace(
			/__CDATA__(\d+)_/g,
			function(sstr, pos)  {return escapeNextLine(dir.cDataContent[pos]).replace(/'/gm, '&#39;')}
		);

	// Удаление пустых операций
	dir.res = dir.res.replace(p.stringBuffer ?
		/__RESULT__\.push\(''\);/g : /__RESULT__ \+= '';/g,

	'');

	dir.res = (("/* Snakeskin v" + (Snakeskin.VERSION.join('.'))) + (", key <" + cacheKey) + (">, label <" + (label.valueOf())) + (">, generated at <" + (new Date().valueOf())) + ("> " + (new Date().toString())) + (". " + (dir.res)) + "");
	dir.res += (("" + (cjs ? '}' : '')) + "}).call(this);");

	// Если остались внешние прототипы,
	// которые не были подключены к своему шаблону,
	// то генерируем ошибку
	for (var key$4 in dir.preProtos) {
		if (!dir.preProtos.hasOwnProperty(key$4)) {
			continue;
		}

		dir.error((("template \"" + key$4) + "\" is not defined"));
		return false;
	}

	if (p.prettyPrint) {
		dir.res = beautify(dir.res);
	}

	if (debug) {
		debug['code'] = dir.res;
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
		} else if (!cjs) {
			dir.evalStr(dir.res);
		}

		// Кеширование полученной функции
		if (ctx !== NULL) {
			ctx['init'](Snakeskin);

			if (cacheKey) {
				if (!globalFnCache[cacheKey]) {
					globalFnCache[cacheKey] = {};
				}

				globalFnCache[cacheKey][text] = ctx;
			}
		}

	} catch (err) {
		delete info['line'];
		delete info['template'];
		dir.error(err.message);
		return false;
	}

	// Кеширование текста
	if (cacheKey) {
		if (!globalCache[cacheKey]) {
			globalCache[cacheKey] = {};
		}

		globalCache[cacheKey][text] = {
			text: dir.res,
			words: words,
			debug: debug
		};
	}

	// Если брайзер поддерживает FileAPI,
	// то подключаем скомпилированный шаблон как внешний скрипт
	if (!IS_NODE && !cjs) {
		setTimeout(function()  {
			try {
				var blob = new Blob([dir.res], {
					type: 'application/javascript'
				});

				var script = document.createElement('script');
				script.src = URL.createObjectURL(blob);

				document.head.appendChild(script);

			} catch (ignore) {}
		}, 50);
	}

	return dir.res;
};