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
 *
 * @param {Object=} [opt_info] - дополнительная информация о запуске
 * @param {?boolean=} [opt_dryRun=false] - если true,
 *     то шаблон только транслируется (не компилируется), приватный параметр
 *
 * @param {Object=} [opt_sysParams] - служебные параметры запуска
 * @param {Array=} [opt_sysParams.scope] - родительский scope
 * @param {Object=} [opt_sysParams.vars] - объект родительских переменных
 * @return {string}
 */
Snakeskin.compile = function (src, opt_commonJS, opt_info, opt_dryRun,opt_sysParams) {
	var __NEJS_THIS__ = this;
	if (typeof opt_sysParams === "undefined") { opt_sysParams = {}; }
	opt_info = opt_info || {line: 1};
	var html = src.innerHTML;

	if (html) {
		opt_info.node = src;
		html = html.replace(/\s*?\n/, '');
	}

	var dir = new DirObj(html || src, {
		commonJS: !!opt_commonJS,
		dryRun: !!opt_dryRun,
		info: opt_info
	});

	dir.scope = opt_sysParams.scope || dir.scope;
	dir.structure.vars = opt_sysParams.vars || dir.structure.vars;

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
	var jsDoc = false;

	// Флаги для обработки литералов строк и регулярных выражений внутри директивы
	var bOpen,
		bEnd = true,
		bEscape = false;

	var nextLineRgxp = /[\r\n\v]/,
		whiteSpaceRgxp = /\s/,
		bEndRgxp = /[^\s\/]/;

	var commandTypeRgxp = /[^\s]+/m,
		commandRgxp = /[^\s]+\s*/m;

	function escapeWhitespace(str) {
		var __NEJS_THIS__ = this;
		return str
			.replace(/\n/gm, '\\n')
			.replace(/\v/gm, '\\v')
			.replace(/\r/gm, '\\r');
	}

	while (++dir.i < dir.source.length) {
		var str = dir.source;
		var el = str.charAt(dir.i);
		var rEl = el;

		if (nextLineRgxp.test(el)) {
			opt_info.line++;
		}

		// Обработка пробельных символов
		if (whiteSpaceRgxp.test(el)) {
			// Внутри директивы
			if (begin) {
				if (!bOpen) {
					el = ' ';

				// Внутри строки внутри директивы
				} else {
					el = escapeWhitespace(el);
				}

			// Простой ввод вне деклараций шаблона
			} else if (!dir.structure.parent) {
				// Для JSDoc все символы остаются неизменны,
				// а в остальныхслучаях они игнорируются
				if (!jsDoc) {
					continue;
				}

			// Простой ввод внутри декларации шаблона
			} else {
				if (!dir.space && !dir.strongSpace) {
					el = ' ';
					dir.space = true;

				} else {
					continue;
				}
			}

		} else {
			dir.space = false;
		}

		if (!bOpen) {
			// Обработка экранирования
			if (begin) {
				if (el === '\\' || escape) {
					escape = !escape;
				}

			} else {
				escape = false;
			}

			var next2str = el + str.charAt(dir.i + 1);
			var next3str = next2str + str.charAt(dir.i + 2);

			// Обработка комментариев
			if (!escape) {
				if (el === '/') {
					if (next3str === '///') {
						comment = next3str;
						dir.i += 2;

					} else if (next2str === '/*') {

						if (next3str !== '/**' && dir.structure.parent) {
							comment = next2str;
							dir.i++;

						} else {
							beginStr = true;
							jsDoc = true;
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
				if (!command) {
					throw dir.error('Directive is not defined, ' +
						dir.genErrorAdvInfo(opt_info)
					);
				}

				begin = false;
				var commandLength = command.length;
				command = dir.replaceDangerBlocks(command).trim();

				var short1 = command.charAt(0);
				var short2 = command.substr(0, 2);

				// Поддержка коротких форм записи директив
				if (replacers[short2]) {
					command = replacers[short2](command);

				} else if (replacers[short1]) {
					command = replacers[short1](command);
				}

				var commandType = commandTypeRgxp.exec(command)[0];
				commandType = Snakeskin.Directions[commandType] ? commandType : 'const';

				if (dir.strongDir && strongDirs[dir.strongDir][commandType]) {
					dir.returnStrongDir = {
						child: commandType,
						dir: dir.strongDir
					};

					dir.strongDir = null;
					dir.strongSpace = false;
				}

				// Обработка команд
				var fnRes = Snakeskin.Directions[commandType].call(
					dir,

					commandType !== 'const' ?
						command.replace(commandRgxp, '') : command,

					commandLength,

					{
						name: commandType,
						commonJS: opt_commonJS,
						dryRun: opt_dryRun,
						info: opt_info
					}
				);

				if (dir.inlineDir === true) {
					dir.inlineDir = null;
					dir.structure = dir.structure.parent;
				}

				if (strongDirs[commandType]) {
					dir.strongDir = commandType;
					dir.strongSpace = true;
				}

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
			if (beginStr && dir.isSimpleOutput()) {
				dir.save('\';');
				beginStr = false;
			}

			// Обработка литералов строки и регулярных выражений внутри директивы
			if (command !== '/') {
				if (!bOpen) {
					if (escapeEndMap[el]) {
						bEnd = true;

					} else if (bEndRgxp.test(el)) {
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
		} else {
			if (dir.strongDir) {
				throw dir.error('Text can not be used with a "' + dir.strongDir + '", ' +
					dir.genErrorAdvInfo(opt_info)
				);
			}

			if (dir.isSimpleOutput()) {
				if (!beginStr) {
					dir.save('__SNAKESKIN_RESULT__ += \'');
					beginStr = true;
				}

				dir.save(dir.applyDefEscape(el));
				if (!beginStr) {
					jsDoc = false;
				}
			}
		}
	}

	// Если количество открытых блоков не совпадает с количеством закрытых,
	// то кидаем исключение
	if (dir.structure.parent) {
		throw dir.error('Missing closing or opening tag in the template, ' +
			dir.genErrorAdvInfo(opt_info)
		);
	}

	dir.res = dir.pasteDangerBlocks(dir.res)

		// Обратная замена cdata областей
		.replace(
			/__SNAKESKIN_CDATA__(\d+)_/g,
			function (sstr, pos) {
				return escapeWhitespace(dir.cDataContent[pos]).replace(/'/gm, '&#39;');}
		)

		// Удаление пустых операций
		.replace(/__SNAKESKIN_RESULT__ \+= '';/g, '');

	// Конец шаблона
	dir.res += !opt_dryRun ? '/* Snakeskin templating system. Generated at: ' + new Date().toString() + '. */' : '';
	dir.res += opt_commonJS ? '}' : '';

	if (opt_dryRun) {
		return dir.res;
	}

	console.log(dir.res);
	new Function(dir.res)();

	return dir.res;
};