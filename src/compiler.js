/**
 * Скомпилировать шаблоны
 *
 * @tests compile_test.html
 *
 * @param {(!Element|string)} src - ссылка на DOM узел, где лежат шаблоны, или текст шаблонов
 * @param {?boolean=} [opt_commonJS=false] - если true, то шаблон компилируется с экспортом в стиле commonJS
 * @param {?boolean=} [opt_dryRun=false] - если true,
 *     то шаблон только транслируется (не компилируется), приватный параметр
 *
 * @param {Object=} [opt_info] - дополнительная информация о запуске, приватный параметр
 * @return {string}
 */
Snakeskin.compile = function (src, opt_commonJS, opt_dryRun, opt_info) {
	opt_info = opt_info || {};
	if (src.innerHTML) {
		opt_info.node = src;
	}

	var dirObj = new DirObj(src.innerHTML || src, opt_commonJS, opt_dryRun);

	var begin,
		fakeBegin = 0,
		beginStr;

	var command = '',
		escape,
		comment;

	var bOpen,
		bEnd = true;

	while (++dirObj.i < dirObj.source.length) {
		var str = dirObj.source,
			el = str.charAt(dirObj.i);

		if (!bOpen) {
			if (begin) {
				if (el === '\\' || escape) {
					escape = !escape;
				}

			} else {
				escape = false;
			}

			// Обработка комментариев
			if (!escape) {
				if (el === '/') {
					if (str.charAt(dirObj.i + 1) === '/' && str.charAt(dirObj.i + 2) === '/') {
						comment = '///';

					} else if (str.charAt(dirObj.i + 1) === '*') {
						comment = '/*';
						dirObj.i++;

					} else if (str.charAt(dirObj.i - 1) === '*') {
						comment = false;
						continue;
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
				command = Snakeskin.replaceDangerBlocks(command, dirObj.quotContent).trim();

				var commandType = command
					// Хак для подержки закрытия директив через слеш
					.replace(/^\//, 'end ')

					// Хак для поддержки {data ...} как {{ ... }}
					.replace(/^{([\s\S]*)}$/, function (sstr, $1) {
						return 'data ' + $1;
					})

					.split(' ')[0];

				commandType = Snakeskin.Directions[commandType] ? commandType : 'const';

				// Обработка команд
				var fnRes = Snakeskin.Directions[commandType](
					commandType !== 'const' ? command.replace(new RegExp('^' + commandType + '\\s+'), '') : command,
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

			var bEscape;
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
			if (!beginStr) {
				dirObj.save('__SNAKESKIN_RESULT__ += \'');
				beginStr = true;
			}

			if (!dirObj.parentTplName) {
				dirObj.save(el.replace(/\\/gm, '\\\\').replace(/'/gm, '\\\''));
			}
		}
	}

	// Если количество открытых блоков не совпадает с количеством закрытых,
	// то кидаем исключение
	if (dirObj.openBlockI !== 0) {
		throw Snakeskin.error('Missing closing or opening tag in the template, ' +
			Snakeskin.genErrorAdvInfo(opt_info) + '")!');
	}

	dirObj.res = Snakeskin.pasteDangerBlocks(dirObj.res, dirObj.quotContent)
		.replace(/[\t\v\r\n]/gm, '')
		.replace(/__SNAKESKIN_ESCAPE__OR/g, '||')

		// Обратная замена cdata областей
		.replace(/__SNAKESKIN_CDATA__(\d+)/g, function (sstr, pos) {
			return dirObj.cDataContent[pos]
				.replace(/\n/gm, '\\n')
				.replace(/\r/gm, '\\r')
				.replace(/\v/gm, '\\v')
				.replace(/'/gm, '&#39;');
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