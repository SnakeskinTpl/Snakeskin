var __NEJS_THIS__ = this;
/**
 * Скомпилировать указанные шаблоны
 *
 * @param {(!Element|string)} src - ссылка на DOM узел, где декларированны шаблоны, или исходный текст шаблонов
 *
 * @param {Object=} [opt_params] - дополнительные параметры запуска, или если true,
 *     то шаблон компилируется с экспортом в стиле commonJS
 *
 * @param {?boolean=} [opt_params.commonJS=false] - если true, то шаблон компилируется с экспортом в стиле commonJS
 * @param {Object=} [opt_params.context] - контекст для сохранение скомпилированного шаблона
 *     (только при экспорте в commonJS)
 *
 * @param {Object=} [opt_info] - дополнительная информация о запуске:
 *     используется для сообщений об ошибках
 *
 * @param {Object=} [opt_sysParams] - служебный параметры запуска
 * @param {Array=} [opt_sysParams.scope] - область видимости (контекст) директив
 * @param {Object=} [opt_sysParams.vars] - объект локальных переменных
 * @param {?string=} [opt_sysParams.proto] - название корневого прототипа
 *
 * @return {string}
 */
Snakeskin.compile = function (src, opt_params, opt_info,opt_sysParams) {
	var __NEJS_THIS__ = this;
	if (typeof opt_sysParams === "undefined") { opt_sysParams = {}; }
	var isObj = opt_params && !(typeof opt_params === 'boolean' || opt_params instanceof Boolean === true);

	var commonJS = !!(isObj ? opt_params.commonJS || opt_params.context : opt_params);
	var ctx = isObj ? opt_params.context || {} : {};

	opt_info = opt_info || {};
	opt_info.line = opt_info.line || 1;

	var html = src.innerHTML;

	if (html) {
		opt_info.node = src;
		html = html.replace(/\s*?\n/, '');
	}

	var text = html || src;

	if (node && commonJS && globalFnCache[commonJS][text]) {
		var cache = globalFnCache[commonJS][text];

		for (var key in cache) {
			if (!cache.hasOwnProperty(key)) {
				continue;
			}

			ctx[key] = cache[key];
		}

		return globalCache[commonJS][text];
	}

	if (globalCache[commonJS][text]) {
		return globalCache[commonJS][text];
	}

	var dir = new DirObj(String(text), {
		info: opt_info,
		commonJS: commonJS,
		proto: opt_sysParams.proto,
		scope: opt_sysParams.scope,
		vars: opt_sysParams.vars
	});

	// Если true, то идёт содержимое директивы,
	// т.е. { ... }
	var begin = false;

	// Содержимое директивы
	var command = '';

	// Количество открытых { внутри директивы
	var fakeBegin = 0;

	// Если true, то идёт запись простой строки
	var beginStr = false;

	// Если true, то предыдущий символ был не экранированный \
	var escape = false;

	// Если содержит значение отличное от false,
	// то значит идёт блок комметариев comment (///, /*, /**)
	var comment = false;

	// Если true, то значит идёт JSDoc
	var jsDoc = false,
		jsDocStart = false;

	// Флаги для обработки литералов строк и регулярных выражений внутри директивы
	var bOpen = false,
		bEnd,
		bEscape = false;

	var filterStart = false;

	var nextLineRgxp = /[\r\n\v]/,
		whiteSpaceRgxp = /\s/,
		bEndRgxp = /[^\s\/]/;

	var filterStartRgxp = /[a-z]/i;

	var commandTypeRgxp = /[^\s]+/m,
		commandRgxp = /[^\s]+\s*/m;

	var prevSpace;

	while (++dir.i < dir.source.length) {
		var str = dir.source;
		var el = str.charAt(dir.i),
			rEl = el;

		if (nextLineRgxp.test(el)) {
			opt_info.line++;
		}

		if (whiteSpaceRgxp.test(el)) {
			// Внутри директивы
			if (begin) {
				if (!bOpen) {
					el = ' ';

				// Внутри строки внутри директивы
				} else {
					el = dir.escapeNextLine(el);
				}

			// Простой ввод вне деклараций шаблона
			} else if (!dir.structure.parent) {
				// Для JSDoc все символы остаются неизменны,
				// а в остальных случаях они игнорируются
				if (!comment && !jsDoc) {
					continue;
				}

			// Простой ввод внутри декларации шаблона
			} else {
				if (!dir.space && !dir.strongSpace && !dir.superStrongSpace) {
					el = dir.ignoreRgxp && dir.ignoreRgxp.test(el) ? '' : ' ';

					if (el) {
						dir.space = true;
					}

				} else {
					continue;
				}
			}

		} else {
			if (el !== '{' && !begin) {
				prevSpace = dir.space;
			}

			dir.space = false;
		}

		if (!bOpen) {
			var next2str = el + str.charAt(dir.i + 1),
				next3str = next2str + str.charAt(dir.i + 2);

			// Обработка комментариев
			if (!escape) {
				if (el === '/') {
					if (next3str === '///') {
						comment = next3str;
						dir.i += 2;

					} else if (next2str === '/*') {

						if (next3str === '/**' && !dir.structure.parent) {
							beginStr = true;
							jsDoc = true;
							jsDocStart = dir.res.length;

						} else {
							comment = next2str;
							dir.i++;
						}

					} else if (str.charAt(dir.i - 1) === '*') {
						if (comment === '/*') {
							comment = false;
							continue;

						} else if (beginStr) {
							beginStr = false;
						}
					}

				} else if (nextLineRgxp.test(rEl) && comment === '///') {
					comment = false;
					continue;
				}
			}

			// Обработка экранирования
			if (el === '\\' || escape) {
				escape = !escape;
			}

			if (comment || escape) {
				continue;
			}

			if (!jsDoc) {
				// Начало управляющей конструкции
				// (не забываем следить за уровнем вложенностей {)
				if (el === '{') {
					if (begin) {
						fakeBegin++;

					} else {
						bEnd = true;
						begin = true;
						continue;
					}

				// Упраляющая конструкция завершилась
				} else if (el === '}' && (!fakeBegin || !(fakeBegin--))) {
					begin = false;
					var commandLength = command.length;
					command = dir.replaceDangerBlocks(command).trim();

					if (!command) {
						throw dir.error('Directive is not defined');
					}

					var short1 = command.charAt(0),
						short2 = command.substr(0, 2);

					// Поддержка коротких форм записи директив
					if (replacers[short2]) {
						command = replacers[short2](command);

					} else if (replacers[short1]) {
						command = replacers[short1](command);
					}

					var commandType = commandTypeRgxp.exec(command)[0];
					commandType = Snakeskin.Directions[commandType] ? commandType : 'const';

					// Обработка команд
					var fnRes = Snakeskin.Directions[commandType](
						dir,

						commandType !== 'const' ?
							command.replace(commandRgxp, '') : command,

						commandLength,
						jsDocStart
					);

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
					continue;
				}
			}
		}

		// Запись команды
		if (begin) {
			if (beginStr && dir.isSimpleOutput()) {
				dir.save('\';');
				beginStr = false;
			}

			// Обработка литералов строки и регулярных выражений внутри директивы
			if (!bOpen) {
				var skip = false;

				if (el === '|' && filterStartRgxp.test(str.charAt(dir.i + 1))) {
					filterStart = true;
					bEnd = false;
					skip = true;

				} else if (filterStart && whiteSpaceRgxp.test(el)) {
					filterStart = false;
					bEnd = true;
					skip = true;
				}

				if (!skip) {
					if (escapeEndMap[el]) {
						bEnd = true;

					} else if (bEndRgxp.test(el)) {
						bEnd = false;
					}
				}
			}

			if (escapeMap[el] && (el === '/' ? bEnd && command : true) && !bOpen) {
				bOpen = el;

			} else if (bOpen && (el === '\\' || bEscape)) {
				bEscape = !bEscape;

			} else if (escapeMap[el] && bOpen === el && !bEscape) {
				bOpen = false;
			}

			command += el;

		// Запись строки
		} else {
			if (!dir.structure.parent) {
				if (jsDoc) {
					dir.save(dir.applyDefEscape(el));

				} else {
					throw dir.error('Text can\'t be used in the global space (except jsDoc)');
				}

			} else {
				dir.startInlineDir('text');

				if (dir.isSimpleOutput()) {
					if (!beginStr) {
						dir.save('__SNAKESKIN_RESULT__ += \'');
						beginStr = true;
					}

					dir.save(dir.applyDefEscape(el));
				}

				dir.inlineDir = null;
				dir.structure = dir.structure.parent;
			}

			if (!beginStr) {
				jsDoc = false;
			}
		}
	}

	// Если количество открытых блоков не совпадает с количеством закрытых,
	// то кидаем исключение
	if (dir.structure.parent) {
		throw dir.error('Missing closing or opening tag in the template');
	}

	dir.res = dir.pasteDangerBlocks(dir.res)

		// Обратная замена cdata областей
		.replace(
			/__SNAKESKIN_CDATA__(\d+)_/g,
			function (sstr, pos) {
				return dir.escapeNextLine(dir.cDataContent[pos]).replace(/'/gm, '&#39;');}
		)

		// Удаление пустых операций
		.replace(/__SNAKESKIN_RESULT__ \+= '';/g, '');

	// Конец шаблона
	dir.res += !dir.proto ? '/* Snakeskin templating system. Generated at: ' + new Date().toString() + '. */' : '';
	dir.res += commonJS ? '}' : '';

	if (dir.proto) {
		return dir.res;
	}

	for (var key$0 in dir.preProtos) {
		if (!dir.preProtos.hasOwnProperty(key$0)) {
			continue;
		}

		throw dir.error('Template "' + key$0 + '" is not defined')
	}

	// Компиляция на сервере
	if (node) {
		// Экспорт
		if (commonJS) {
			new Function('exports', 'require', dir.res)(ctx, require);
			ctx.init(Snakeskin);
			globalFnCache[commonJS][text] = ctx;

		// Простая компиляция
		} else {
			global.eval(dir.res);
		}

	// Живая компиляция в браузере
	} else {
		new Function(dir.res)();
	}

	globalCache[commonJS][text] = dir.res;
	if (!node && !commonJS) {
		setTimeout(function () {
			
			try {
				var blob = new Blob([dir.res], {type: 'application/javascript'});
				var script = document.createElement('script');

				script.src = URL.createObjectURL(blob);
				document.head.appendChild(script);

			} catch (ignore) {}
		}, 50);
	}

	return dir.res;
};