var nextLineRgxp = /[\r\n\v]/,
	whiteSpaceRgxp = /\s/,
	bEndRgxp = /[^\s\/]/;

/**
 * Скомпилировать указанные шаблоны Snakeskin
 *
 * @expose
 * @param {(!Element|string)} src - ссылка на DOM узел, где декларированны шаблоны,
 *     или исходный текст шаблонов
 *
 * @param {?boolean=} [opt_params.throws=false] - если true, то в случае ошибки и отсутствия обработчика ошибок -
 *     будет сгенерирована ошибка
 *
 * @param {(Object|boolean)=} [opt_params] - дополнительные параметры запуска, или если true,
 *     то шаблон компилируется с экспортом в стиле commonJS
 *
 * @param {?string=} [opt_params.i18nFn='i18n'] - название функции для i18n
 * @param {?boolean=} [opt_params.localization=true] - если false, то блоки ` ... ` не заменяются на вызов i18n
 * @param {Object=} [opt_params.language] - таблица фраз для локализации (найденные фразы будут заменены по ключу)
 * @param {Object=} [opt_params.words] - таблица, которая будет заполнена всеми фразами для локализации,
 *     которые используются в шаблоне
 *
 * @param {?boolean=} [opt_params.commonJS=false] - если true, то шаблон компилируется
 *     с экспортом в стиле commonJS
 *
 * @param {?boolean=} [opt_params.interface=false] - если true, то все директивы template трактуются как interface
 * @param {?boolean=} [opt_params.stringBuffer=false] - если true, то для конкатенации строк в шаблоне
 *     используется техника [].join
 *
 * @param {?boolean=} [opt_params.inlineIterators=false] - если true, то работа итераторов forEach и forIn
 *     будет развёртвываться в циклы
 *
 * @param {?boolean=} [opt_params.escapeOutput=true] - если афдыу, то работа итераторов forEach и forIn
 *     будет развёртвываться в циклы
 *
 * @param {Object=} [opt_params.context=false] - контекст для сохранение скомпилированного шаблона
 *     (только при экспорте в commonJS)
 *
 * @param {Object=} [opt_params.vars] - таблица суперглобальных переменных,
 *     которые будут добавлены в Snakeskin.Vars
 *
 * @param {?function(!Error)=} [opt_params.onError] - функция обратного вызова для обработки ошибок при трансляции
 * @param {?boolean=} [opt_params.prettyPrint] - если true, то полученный JS код шаблона
 *     отображается в удобном для чтения виде
 *
 * @param {Object=} [opt_info] - дополнительная информация о запуске
 *     (используется для сообщений об ошибках)
 *
 * @param {?string=} [opt_info.file] - адрес исходного файла шаблонов
 * @param {Object=} [opt_sysParams] - служебные параметры запуска
 *
 * @param {Array=} [opt_sysParams.scope] - область видимости (контекст) директив
 * @param {Object=} [opt_sysParams.vars] - объект локальных переменных
 * @param {Object=} [opt_sysParams.proto] - объект настроек прототипа
 *
 * @param {?boolean=} [opt_sysParams.needPrfx] - если true, то директивы декларируются как #{ ... }
 * @param {?number=} [opt_sysParams.prfxI] - глубина префиксных директив
 *
 * @return {(string|boolean)}
 */
Snakeskin.compile = function (src, opt_params, opt_info, opt_sysParams) {
	var sp = opt_sysParams || {},
		p = opt_params ? Object(opt_params) : {};

	var cjs,
		ctx =
			(cjs = s(p.context, p['context'])) || {};

	if (!cjs) {
		if (typeof opt_params === 'boolean') {
			cjs = opt_params;

		} else {
			cjs = s(p.commonJS, p['commonJS']);
		}
	}

	cjs = Boolean(cjs);
	p.onError = s(p.onError, p['onError']);
	p.prettyPrint = s(p.prettyPrint, p['prettyPrint']) || false;
	p.stringBuffer = s(p.stringBuffer, p['stringBuffer']) || false;
	p.inlineIterators = s(p.inlineIterators, p['inlineIterators']) || false;
	p.escapeOutput = s(p.escapeOutput, p['escapeOutput']) !== false;
	p.interface = s(p.interface, p['interface']) || false;
	p.throws = s(p.throws, p['throws']) || false;

	sp.needPrfx = s(sp.needPrfx, sp['needPrfx']);
	sp.prfxI = s(sp.prfxI, sp['prfxI']);

	var vars =
		p.vars = s(p.vars, p['vars']) || {};

	for (let key in vars) {
		if (!vars.hasOwnProperty(key)) {
			continue;
		}

		Snakeskin.Vars[key] = vars[key];
	}

	p.i18nFn = s(p.i18nFn, p['i18nFn']) || 'i18n';

	var i18n =
		p.localization = s(p.localization, p['localization']) !== false;

	var lang =
		p.language = s(p.language, p['language']);

	var words =
		p.words = s(p.words, p['words']);

	var info = opt_info || {};
	var dirname,
		filename;

	if (!sp.proto) {
		Snakeskin.LocalVars = {
			/** @expose */
			include: {},

			/** @expose */
			$_: void 0
		};

		if (IS_NODE && info['file']) {
			filename =
				info['file'] = require('path')['normalize'](info['file']);

			dirname = require('path')['dirname'](filename);
			Snakeskin.LocalVars.include[filename] = 'index';
		}
	}

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
		proto: sp.proto,
		scope: sp.scope,
		vars: sp.vars,
		onError: p.onError,
		stringBuffer: p.stringBuffer,
		inlineIterators: p.inlineIterators,
		escapeOutput: p.escapeOutput,
		interface: p.interface,
		throws: p.throws,
		needPrfx: sp.needPrfx,
		prfxI: sp.prfxI
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

	var filterStart = false,
		filterStartRgxp = /[a-z]/i;

	var commandTypeRgxp = /[^\s]+/m,
		commandRgxp = /[^\s]+\s*/m;

	var prevSpace;
	var i18nStr = '',
		i18nStart = false;

	while (++dir.i < dir.source.length) {
		let str = dir.source,
			struct = dir.structure;

		let el = str.charAt(dir.i),
			next = str.charAt(dir.i + 1);

		let rEl = el;

		if (nextLineRgxp.test(el)) {
			dir.lines[info['line']] = '';
			info['line']++;

		} else {
			dir.lines[dir.lines.length - 1] += el;
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
			if ((dir.needPrfx ? el !== ALB : el !== LB) && !begin) {
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
				if (el === SC.charAt(0) || el === MCS.charAt(0)) {
					if (next3str === SC) {
						comment = next3str;
						dir.i += 2;

					} else if (next2str === MCS) {
						if (next3str === JD) {
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

					} else if (str.charAt(dir.i - 1) === MCE.charAt(0)) {
						if (comment === MCS) {
							comment = false;
							continue;

						} else if (beginStr) {
							beginStr = false;
						}
					}

				} else if (nextLineRgxp.test(rEl) && comment === SC) {
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

					if (currentEscape || el !== I18N) {
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
					el === ALB &&
					next === LB;

				// Начало управляющей конструкции
				// (не забываем следить за уровнем вложенностей {)
				if (isPrefStart || (el === LB && (begin || !currentEscape))) {
					if (begin) {
						fakeBegin++;

					} else if (!dir.needPrfx || isPrefStart) {
						if (isPrefStart) {
							dir.i++;
							dir.needPrfx = true;
						}

						bEnd = true;
						begin = true;

						continue;
					}

				// Упраляющая конструкция завершилась
				} else if (el === RB && begin && (!fakeBegin || !(fakeBegin--))) {
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

					let commandType = commandTypeRgxp.exec(command)[0],
						isConst = commandType === 'const' ||
							commandType === 'global';

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

					if (dir.needPrfx) {
						if (dir.inline !== false) {
							if (commandType === 'end') {
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
					continue;

				} else if (i18n && !currentEscape && el === I18N) {
					if (i18nStart && i18nStr && words && !words[i18nStr]) {
						words[i18nStr] = i18nStr;
					}

					if (lang) {
						if (i18nStart) {
							let word = String(lang[i18nStr] || '');

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

							} else {
								dir.source = str.substring(0, dir.i + 1) +
									RB +
									str.substring(dir.i + 1);

								dir.i = Number(pseudoI);
								pseudoI = false;

								continue;
							}

						} else {
							i18nStart = true;

							if (begin) {
								el = `${p.i18nFn}("`;

							} else {
								let diff = Number(dir.needPrfx) + 1;

								dir.source = str.substring(0, dir.i) +
									(dir.needPrfx ? ALB : '') +
									LB +
									str.substring(dir.i);

								pseudoI = dir.i - diff;
								dir.i += diff;

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

				if (el === F && filterStartRgxp.test(str.charAt(dir.i + 1))) {
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
				dir.save(applyDefEscape(el));

			} else if (!dir.tplName) {
				if (el === ' ') {
					continue;
				}

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

					dir.save(applyDefEscape(el));
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
	if (begin || dir.structure.parent) {
		dir.error('missing closing or opening tag in the template');
		return false;
	}

	dir.res = dir.pasteDangerBlocks(dir.res)

		// Обратная замена cdata областей
		.replace(
			/__CDATA__(\d+)_/g,
			(sstr, pos) => escapeNextLine(dir.cDataContent[pos]).replace(/'/gm, '&#39;')
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

	dir.res += `
		Snakeskin.LocalVars = {
			include: {},
			\$_: {}
		};

		${cjs ? '}' : ''}}).call(this);
	`;

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

	try {
		// Компиляция на сервере
		if (IS_NODE) {
			// Экспорт
			if (cjs) {
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

				ctx['init'](Snakeskin);
				globalFnCache[cjs][text] = ctx;

			// Простая компиляция
			} else {
				dir.evalStr(dir.res);
			}

		// Живая компиляция в браузере
		} else {
			console.log(dir.res);
			dir.evalStr(dir.res);
		}

	} catch (err) {
		Snakeskin.LocalVars = null;

		delete info['line'];
		delete info['template'];

		dir.error(err.message);
		return false;
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