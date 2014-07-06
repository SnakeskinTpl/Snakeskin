/**
 * Скомпилировать указанные шаблоны Snakeskin
 *
 * @expose
 * @param {(!Element|string)} src - ссылка на DOM узел, где декларированны шаблоны,
 *     или исходный текст шаблонов
 *
 * @param {Object=} [opt_params] - дополнительные параметры запуска, или если true,
 *     то шаблон компилируется с экспортом в стиле commonJS
 *
 * @param {?boolean=} [opt_params.localization=true] - если false, то блоки ` ... ` не заменяются на вызов i18n
 * @param {Object=} [opt_params.language] - таблица фраз для локализации
 *
 * @param {?boolean=} [opt_params.commonJS=false] - если true, то шаблон компилируется
 *     с экспортом в стиле commonJS
 *
 * @param {?boolean=} [opt_params.interface=false] - если true, то все директивы template трактуются как interface
 * @param {?boolean=} [opt_params.stringBuffer=false] - если true, то для конкатенации строк в шаблоне
 *     используется техника [].join
 *
 * @param {?boolean=} [opt_params.inlineIterators=true] - если false, то работа итераторов forEach и forIn
 *     будет реализовываться через встроенные методы Snakeskin, а не через циклы
 *
 * @param {Object=} [opt_params.context=false] - контекст для сохранение скомпилированного шаблона
 *     (только при экспорте в commonJS)
 *
 * @param {?function(!Error)=} [opt_params.onError] - функция обратного вызова для обработки ошибок при трансляции
 * @param {?boolean=} [opt_params.prettyPrint] - если true, то полученный JS код шаблона
 *     отображается в удобном для чтения виде
 *
 * @param {Object=} [opt_info] - дополнительная информация о запуске
 *     (используется для сообщений об ошибках)
 *
 * @param {?string=} [opt_info.file] - адрес исходного файла шаблонов
 *
 * @param {Object=} [opt_sysParams] - служебные параметры запуска
 * @param {Array=} [opt_sysParams.scope] - область видимости (контекст) директив
 * @param {Object=} [opt_sysParams.vars] - объект локальных переменных
 * @param {Object=} [opt_sysParams.proto] - объект настроек прототипа
 *
 * @return {(string|boolean)}
 */
Snakeskin.compile = function (src, opt_params, opt_info, opt_sysParams) {
	opt_sysParams = opt_sysParams || {};

	var p = opt_params ?
		Object(opt_params) : {};

	var cjs;
	var ctx = (cjs = s(p.context, p['context'])) || {};

	if (!cjs) {
		if (typeof opt_params === 'boolean') {
			cjs = opt_params;

		} else {
			cjs = s(p.commonJS, p['commonJS']);
		}
	}

	var pref = '#',
		prefI = 0,
		needPref = false;

	p.onError = s(p.onError, p['onError']);
	p.prettyPrint = s(p.prettyPrint, p['prettyPrint']) || false;
	p.stringBuffer = s(p.stringBuffer, p['stringBuffer']) || false;
	p.inlineIterators = s(p.inlineIterators, p['inlineIterators']) !== false;
	p.interface = s(p.interface, p['interface']) || false;

	var i18n =
		p.localization = s(p.localization, p['localization']) !== false;

	var lang =
		p.language = s(p.language, p['language']);

	cjs = Boolean(cjs);
	var info = opt_info || {};

	info['file'] = s(info.file, info['file']);
	info['line'] = info['line'] || 1;

	var html = src.innerHTML;

	if (html) {
		info['node'] = src;
		html = html.replace(/\s*?\n/, '');
	}

	var text = html || src;

	// Кеширование шаблонов в node.js
	if (IS_NODE && cjs && globalFnCache[cjs][text]) {
		let cache = globalFnCache[cjs][text];

		for (let key in cache) {
			if (!cache.hasOwnProperty(key)) {
				continue;
			}

			ctx[key] = cache[key];
		}

		return globalCache[cjs][text];
	}

	if (globalCache[cjs][text]) {
		return globalCache[cjs][text];
	}

	var dir = new DirObj(String(text), {
		info: info,
		commonJS: cjs,
		proto: opt_sysParams.proto,
		scope: opt_sysParams.scope,
		vars: opt_sysParams.vars,
		onError: p.onError,
		stringBuffer: p.stringBuffer,
		inlineIterators: p.inlineIterators,
		renderAsInterface: p.renderAsInterface
	});

	// Если true, то идёт содержимое директивы,
	// т.е. { ... }
	var begin = false,
		pseudoI = false;

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

	var i18nStr = '';
	var i18nStart = false;

	while (++dir.i < dir.source.length) {
		let str = dir.source;
		let struct = dir.structure;

		let el = str.charAt(dir.i),
			next = str.charAt(dir.i + 1);

		let rEl = el;

		if (nextLineRgxp.test(el)) {
			info['line']++;
		}

		if (whiteSpaceRgxp.test(el)) {
			// Внутри директивы
			if (begin) {
				if (bOpen) {
					el = dir.escapeNextLine(el);

				} else {
					if (!dir.space && !dir.strongSpace && !dir.superStrongSpace) {
						el = ' ';

						if (el) {
							dir.space = true;
						}

					} else {
						continue;
					}
				}

			// Простой ввод вне деклараций шаблона
			} else if (!struct.parent) {
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
			if ((needPref ? el !== pref : el !== '{') && !begin) {
				prevSpace = dir.space;
			}

			dir.space = false;
		}

		if (!bOpen) {
			let currentEscape = escape;

			// Обработка экранирования
			if (el === '\\' || escape) {
				escape = !escape;
			}

			if (escape) {
				continue;
			}

			let next2str = el + next,
				next3str = next2str + str.charAt(dir.i + 2);

			// Обработка комментариев
			if (!currentEscape) {
				if (el === '/') {
					if (next3str === '///') {
						comment = next3str;
						dir.i += 2;

					} else if (next2str === '/*') {
						if (next3str === '/**') {
							if (beginStr && dir.isSimpleOutput()) {
								dir.save(`'${dir.$$()};`);
							}

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

			if (comment) {
				continue;
			}

			if (!jsDoc) {
				if (i18nStart) {
					if (!currentEscape && el === '"' && !lang) {
						el = '\\"';
					}

					if (currentEscape || el !== '`') {
						if (pseudoI !== false) {
							continue;
						}

						i18nStr += el;

						if (lang) {
							continue;
						}
					}
				}

				let isPrefStart = !currentEscape &&
					!begin &&
					el === pref &&
					next === '{';

				// Начало управляющей конструкции
				// (не забываем следить за уровнем вложенностей {)
				if (isPrefStart || (el === '{' && (begin || !currentEscape))) {
					if (begin) {
						fakeBegin++;

					} else if (!needPref || isPrefStart) {
						if (isPrefStart) {
							dir.i++;
							needPref = true;
						}

						bEnd = true;
						begin = true;

						continue;
					}

				// Упраляющая конструкция завершилась
				} else if (el === '}' && begin && (!fakeBegin || !(fakeBegin--))) {
					begin = false;

					let commandLength = command.length;
					command = dir.replaceDangerBlocks(command).trim();

					if (!command) {
						dir.error('directive\'s body is not defined');
						return false;
					}

					let short1 = command.charAt(0),
						short2 = command.substr(0, 2);

					// Поддержка коротких форм записи директив
					if (replacers[short2]) {
						command = replacers[short2](command);

					} else if (replacers[short1]) {
						command = replacers[short1](command);
					}

					let commandType = commandTypeRgxp.exec(command)[0];
					let isConst = commandType === 'const';

					commandType = Snakeskin.Directions[commandType] ?
						commandType : 'const';

					// Обработка команд
					let fnRes = Snakeskin.Directions[commandType](
						dir,

						isConst || commandType !== 'const' ?
							command.replace(commandRgxp, '') : command,

						commandLength,
						commandType,
						jsDocStart
					);

					if (dir.brk) {
						return false;
					}

					if (dir.inline !== false) {
						if (commandType === 'end') {
							prefI--;

							if (!prefI) {
								needPref = false;
							}

						} else if (!prefI) {
							needPref = false;
						}

					} else if (needPref) {
						prefI++;
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
					continue;

				} else if (i18n && !currentEscape && el === '`') {
					if (lang) {
						if (i18nStart) {
							let word = lang[i18nStr] || '';
							el = begin ?
								`'${dir.applyDefEscape(word)}'` : word;

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

							} else {
								dir.source = str.substring(0, dir.i + 1) + '}' + str.substring(dir.i + 1);
								dir.i = Number(pseudoI);
								pseudoI = false;
								continue;
							}

						} else {
							i18nStart = true;

							if (begin) {
								el = 'i18n("';

							} else {
								dir.source = str.substring(0, dir.i) + '{' + str.substring(dir.i);
								pseudoI = dir.i - 1;
								dir.i++;
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
				dir.save(`'${dir.$$()};`);
				beginStr = false;
			}

			// Обработка литералов строки и регулярных выражений внутри директивы
			if (!bOpen) {
				let skip = false;

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
			if (jsDoc) {
				dir.save(dir.applyDefEscape(el));

			} else if (!struct.parent) {
				dir.error('text can\'t be used in the global space (except jsDoc)');
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

					dir.save(dir.applyDefEscape(el));
				}

				dir.inline = null;
				dir.structure = dir.structure.parent;
			}

			if (!beginStr) {
				if (jsDoc) {
					jsDoc = false;
					dir.space = true;
				}
			}
		}
	}

	// Если количество открытых блоков не совпадает с количеством закрытых,
	// то кидаем исключение
	if (dir.structure.parent) {
		dir.error('missing closing or opening tag in the template');
		return false;
	}

	dir.res = dir.pasteDangerBlocks(dir.res)

		// Обратная замена cdata областей
		.replace(
			/__CDATA__(\d+)_/g,
			(sstr, pos) => dir.escapeNextLine(dir.cDataContent[pos]).replace(/'/gm, '&#39;')
		);

	// Удаление пустых операций
	if (p.stringBuffer) {
		dir.res = dir.res.replace(/__RESULT__\.push\(''\);/g, '');

	} else {
		dir.res = dir.res.replace(/__RESULT__ \+= '';/g, '');
	}

	// Конец шаблона
	if (!dir.proto) {
		dir.res = `/* Snakeskin v${Snakeskin.VERSION.join('.')}, generated at <${new Date().valueOf()}> ${new Date().toString()}. ${dir.res}`;
	}

	if (dir.proto) {
		return dir.res;
	}

	dir.res += `${cjs ? '}' : ''}}).call(this);`;

	for (let key in dir.preProtos) {
		if (!dir.preProtos.hasOwnProperty(key)) {
			continue;
		}

		dir.error(`template "${key}" is not defined`);
		return false;
	}

	if (p.prettyPrint) {
		dir.res = beautify(dir.res);
	}

	// Компиляция на сервере
	if (IS_NODE) {
		// Экспорт
		if (cjs) {
			new Function('exports', 'require', dir.res)(ctx, require);
			ctx['init'](Snakeskin);
			globalFnCache[cjs][text] = ctx;

		// Простая компиляция
		} else {
			global.eval(dir.res);
		}

	// Живая компиляция в браузере
	} else {
		console.log(dir.res);
		new Function(dir.res)();
	}

	globalCache[cjs][text] = dir.res;
	if (!IS_NODE && !cjs) {
		setTimeout(() => {
			try {
				let blob = new Blob([dir.res], {type: 'application/javascript'});
				let script = document.createElement('script');

				script.src = URL.createObjectURL(blob);
				document.head.appendChild(script);

			} catch (ignore) {}
		}, 50);
	}

	return dir.res;
};