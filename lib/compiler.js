var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Скомпилировать шаблоны
 *
 * @param {(!Element|string)} src - ссылка на DOM узел, где лежат шаблоны, или текст шаблонов
 * @param {?boolean=} [opt_commonJS=false] - если true, то шаблон компилируется с экспортом в стиле commonJS
 * @param {Object=} [opt_info] - дополнительная информация о запуске
 * @param {?boolean=} [opt_dryRun=false] - если true,
 *     то шаблон только транслируется (не компилируется), приватный параметр
 *
 * @param {Object=} [opt_scope] - родительский scope, приватный параметр
 * @return {string}
 */
Snakeskin.compile = function (src, opt_commonJS, opt_info, opt_dryRun, opt_scope) {
	var __NEJS_THIS__ = this;
	opt_info = opt_info || {line: 1};
	var html = src['innerHTML'];

	if (html) {
		opt_info.node = src;
		html = html.replace(/\s*?\n/, '');
	}

	var dirObj = new DirObj(html || src, opt_commonJS, opt_dryRun);
	dirObj.sysPosCache['with'] = opt_scope;

	// Если true, то идёт содержимое директивы
	var begin = false;

	// Количество открытых { внутри директивы
	var fakeBegin = 0;

	// Если true, то идёт запись простой строки
	var beginStr = false;

	// Содержимое директивы
	var command = '';

	// Если true, то предыдущий символ был не экранированный \
	var escape = false;

	// Если содержит значение отличное от false,
	// то значит идёт блок комметариев comment (///, /*, /**)
	var comment = false;

	// Если true, то значит идёт JSDoc
	var jsDoc = false;

	var bOpen,
		bEnd = true,
		bEscape = false;

	while (++dirObj.i < dirObj.source.length) {
		var str = dirObj.source;
		var el = str.charAt(dirObj.i);

		if (/[\r\n]/.test(el)) {
			opt_info.line++;
		}

		// Все пробельные символы вне директив и вне декларации шаблона игнорируются
		// (исключение: внутри JSDoc всё сохраняется без изменений)
		if (!begin && !dirObj.tplName && /\s/.test(el)) {
			if (jsDoc) {
				el = dirObj.applySpaceEscape(el);

			} else {
				continue;
			}
		}

		if (!bOpen) {
			if (begin) {
				if (el === '\\' || escape) {
					escape = !escape;
				}

			} else {
				escape = false;
			}

			var next2str = el + str.charAt(dirObj.i + 1);
			var next3str = next2str + str.charAt(dirObj.i + 2);

			// Обработка комментариев
			if (!escape) {
				if (el === '/') {
					if (next3str === '///') {
						comment = next3str;
						dirObj.i += 2;

					} else if (next2str === '/*') {

						if (next3str !== '/**' && !dirObj.tplName) {
							comment = next2str;
							dirObj.i++;

						} else {
							beginStr = true;
							jsDoc = true;
						}

					} else if (str.charAt(dirObj.i - 1) === '*') {
						if (comment === '/*') {
							comment = false;
							continue;

						} else if (beginStr) {
							beginStr = false;
						}
					}

				} else if (/[\n\v\r]/.test(el) && comment === '///') {
					comment = false;
				}
			}

			if (comment) {
				continue;
			}

			// Начало управляющей конструкции
			// (не забываем следить за уровнем вложенностей {)
			if (el === '{') {
				if (begin) {
					fakeBegin++;

				} else {
					begin = true;
					continue;
				}

			// Упраляющая конструкция завершилась
			} else if (el === '}' && (!fakeBegin || !(fakeBegin--))) {
				begin = false;

				var commandLength = command.length;
				command = dirObj.replaceDangerBlocks(command).trim();

				// Поддержка коротких форм записи директив
				Snakeskin.forEach(Snakeskin.Replacers, function (fn) {
					
					command = fn(command);
				});

				var commandType = command

					// Хак для поддержки {data ...} как {{ ... }}
					.replace(/^{([\s\S]*)}$/m,function (sstr, $1) {
						return 'data ' + $1;})

					.split(' ')[0];

				commandType = Snakeskin.Directions[commandType] ? commandType : 'const';

				// Обработка команд
				var fnRes = Snakeskin.Directions[commandType](

					commandType !== 'const' ?
						command.replace(new RegExp('^' + commandType + '\\s+', 'm'), '') : command,

					commandLength,
					dirObj,

					{
						commonJS: opt_commonJS,
						dryRun: opt_dryRun,
						info: opt_info
					}
				);

				if (fnRes === false) {
					begin = false;
					beginStr = false;
				}

				command = '';
				continue;
			}
		}

		// Запись команды
		if (begin) {
			if (beginStr && !dirObj.protoStart) {
				dirObj.save('\';');
				beginStr = false;
			}

			if (command !== '/') {
				if (!bOpen) {
					if (escapeEndMap[el]) {
						bEnd = true;

					} else if (/[^\s\/]/.test(el)) {
						bEnd = false;
					}
				}

				if (escapeMap[el] && (el === '/' ? bEnd : true) && !bOpen) {
					bOpen = el;

				} else if (bOpen && (el === '\\' || bEscape)) {
					bEscape = !bEscape;

				} else if (escapeMap[el] && bOpen === el && !bEscape) {
					bOpen = false;
				}
			}

			command += el;

		// Запись строки
		} else if (!dirObj.protoStart) {
			if (!beginStr && !jsDoc) {
				dirObj.save('__SNAKESKIN_RESULT__ += \'');
				beginStr = true;
			}

			if (!dirObj.parentTplName) {
				dirObj.save(dirObj.applyDefEscape(el));

				if (!beginStr) {
					jsDoc = false;
					dirObj.save('\n');
				}
			}
		}
	}

	// Если количество открытых блоков не совпадает с количеством закрытых,
	// то кидаем исключение
	if (dirObj.openBlockI !== 0) {
		throw dirObj.error('Missing closing or opening tag in the template, ' +
			dirObj.genErrorAdvInfo(opt_info) + '")!');
	}

	dirObj.res = dirObj.pasteDangerBlocks(dirObj.res)
		.replace(/[\t\v\r\n]/gm, '')

		// Обратная замена cdata областей
		.replace(/__SNAKESKIN_CDATA__(\d+)/g, function (sstr, pos) {
			var __NEJS_THIS__ = this;
			return dirObj.applySpaceEscape(dirObj.cDataContent[pos]);
		})

		// Удаление пустых операций
		.replace(/__SNAKESKIN_RESULT__ \+= '';/g, '');

	// Конец шаблона
	dirObj.res += !opt_dryRun ? '/* Snakeskin templating system. Generated at: ' + new Date().toString() + '. */' : '';
	dirObj.res += opt_commonJS ? '}' : '';

	if (opt_dryRun) {
		return dirObj.res;
	}

	console.log(dirObj.res);

	// Компиляция на сервере
	if (require) {
		// Экспорт
		if (opt_commonJS) {
			eval(dirObj.res);

		// Простая компиляция
		} else {
			global.eval(dirObj.res);
		}

	// Живая компиляция в браузере
	} else {
		window.eval(dirObj.res);
	}

	return dirObj.res;
};