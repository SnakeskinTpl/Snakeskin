/*!
 * Компилятор
 */

/**
 * Скомпилировать шаблоны
 *
 * @param {(Node|string)} src - ссылка на DOM узел, где лежат шаблоны, или текст шаблонов
 * @param {?boolean=} [opt_commonjs=false] - если true, то шаблон компилируется с экспортом
 * @param {?boolean=} [opt_dryRun=false] - если true, то шаблон только транслируется (не компилируется), приватный параметр
 * @param {Object=} [opt_info] - дополнительная информация, приватный параметр
 * @return {string}
 *
 * @test compile_test.html
 */
Snakeskin.compile = function (src, opt_commonjs, opt_dryRun, opt_info) {
	opt_info = opt_info || {};
	if (src.innerHTML) {
		opt_info.node = src;
	}

	var that = this,

		// Подготовка текста шаблонов
		source = String(src.innerHTML || src)
			// Обработка блоков cdata
			.replace(/{cdata}([\s\S]*?){end\s+cdata}/gm, function (sstr, data) {
				cData.push(data);
				return '__SNAKESKIN_CDATA__' + (cData.length - 1);
			})

			// Однострочный комментарий
			.replace(/\/\/.*/gm, '')
			// Отступы и новая строка
			.replace(/[\t\v\r\n]/gm, '')
			// Многострочный комментарий
			.replace(/\/\*[\s\S]*?\*\//g, '')
			.trim(),

		res = '' +
		(!opt_dryRun ? '/* This code is generated automatically, don\'t alter it. */' : '') +
		(opt_commonjs ?
			'var Snakeskin = global.Snakeskin;' +
			'exports.liveInit = function (path) { ' +
				'Snakeskin = require(path);' +
				'exec();' +
				'return this;' +
			'};' +
			'function exec() {'
		: ''),

		el,
		canWrite,

		tplName = null,
		tmpTplName,
		parentName,

		params,
		defParams,

		begin,
		fakeBegin = 0,
		beginI = 0,
		beginStr,

		blockI = [],
		lastBlock,

		protoI = [],
		lastProto,
		protoStart,

		backHashI = 0,
		lastBack,
		backHash = {},

		withI = [],
		lastWith,

		forEachI = [],
		lastForEach,

		bemI = [],
		bemName,
		lastBEM,

		nmCache = {},

		commandLength,
		command = '',
		unEscape,

		tmp,
		tmpI,

		quotContent = [],

		i = -1,
		startI,

		bOpen;

	while (++i < source.length) {
		el = source.charAt(i);

		if (!bOpen) {
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
			} else if (el === '}' && (!fakeBegin || !fakeBegin--)) {
				begin = false;
				commandLength = command.length;
				command = this._escape(command, quotContent).trim();

				// Обработка команд
				switch (command.split(' ')[0]) {
					// Определение нового шаблона
					case 'template' : {
						// Если количество открытых блоков не совпадает с количеством закрытых,
						// то кидаем исключение
						if (beginI !== 0) {
							error = new Error('Missing closing or opening tag in the template (command: {' + command + '}, template: "' + tplName + ', ' + this._genError(opt_info) + '")!');
							error.name = 'Snakeskin Error';

							throw error;
						}

						beginI++;
						// Начальная позиция шаблона
						// +1 => } >>
						startI = i + 1;

						// Имя + пространство имён шаблона
						tplName = tmpTplName = /^template\s+(.*?)\(/.exec(command)[1];
						tplName = this._uescape(tplName, quotContent);

						// Если true, то шаблон не будет добавлен в скомпилированный файл
						canWrite = this.write[tplName] !== false;

						if (opt_dryRun) { break; }

						// Название родительского шаблона
						if (/\s+extends\s+/.test(command)) {
							parentName = this._uescape(/\s+extends\s+(.*)/.exec(command)[1], quotContent);
						}

						// Входные параметры
						params = command.replace(/.*?\((.*?)\).*/, '$1');

						// Создаём место в кеше
						blockCache[tplName] = {};

						protoCache[tplName] = {};
						fromProtoCache[tplName] = 0;

						varCache[tplName] = {};
						fromVarCache[tplName] = 0;
						varICache[tplName] = {};

						// Схема наследования
						extMap[tplName] = parentName;

						// Для возможности удобного пост-парсинга,
						// каждая функция снабжается комментарием вида:
						// /* Snakeskin template: название шаблона; параметры через запятую */
						if (canWrite) {
							res += '/* Snakeskin template: ' + tplName + '; ' + params.replace(/=(.*?)(?:,|$)/g, '') + ' */';
						}

						// Декларация функции
						// с пространством имён или при экспорте в common.js
						if (/\.|\[/.test(tmpTplName) || opt_commonjs) {
							tmpTplName
								.replace(/\[/g, '.')
								.replace(/]/g, '')

								.split('.').reduce(function (str, el, i) {
									if (!nmCache[str]) {
										if (canWrite) {
											res += '' +
											'if (typeof ' + (opt_commonjs ? 'exports.' : '') + str + ' === \'undefined\') { ' +
												(opt_commonjs ? 'exports.' : i === 1 ? require ? 'var ' : 'window.' : '') + str + ' = {}; }';
										}

										nmCache[str] = true;
									}

									if (el.substring(0, 18) === '__SNAKESKIN_QUOT__') {
										return str + '[' + el + ']';
									}

									return str + '.' + el;
								});

							if (canWrite) {
								res += (opt_commonjs ? 'exports.' : '') + tmpTplName + '= function (';
							}

						// Без простраства имён
						} else {
							if (canWrite) {
								res += (!require ? 'window.' + tmpTplName + ' = ': '') + 'function ' + (require ? tmpTplName : '') + '(';
							}
						}

						// Входные параметры
						params = params.split(',');
						// Если шаблон наследуется,
						// то подмешиваем ко входым параметрам шаблона
						// входные параметры родителя
						paramsCache[tplName] = paramsCache[parentName] ? paramsCache[parentName].concat(params) : params;
						defParams = '';

						// Переинициализация входных параметров родительскими
						// (только если нужно)
						if (paramsCache[parentName]) {
							paramsCache[parentName].forEach(function (el) {
								var def = el.split('=');
								// Здесь и далее по коду
								// [0] - название переменной
								// [1] - значение по умолчанию (опционально)
								def[0] = def[0].trim();
								def[1] = def[1] && def[1].trim();

								params.forEach(function (el2, i) {
									var def2 = el2.split('=');
									def2[0] = def2[0].trim();
									def2[1] = def2[1] && def2[1].trim();

									// Если переменная не имеет параметра по умолчанию,
									// то ставим параметр по умолчанию родителя
									if (def[0] === def2[0] && typeof def2[1] === 'undefined') {
										params[i] = el;
									}
								});
							});
						}

						// Инициализация параметров по умолчанию
						// (эээххх, когда же настанет ECMAScript 6 :()
						params.forEach(function (el, i) {
							var def = el.split('=');
							def[0] = def[0].trim();
							if (canWrite) {
								res += def[0];
							}

							if (def.length > 1) {
								// Подмешивание родительских входных параметров
								if (paramsCache[parentName] && !defParams) {
									paramsCache[parentName].forEach(function (el) {
										var def = el.split('='),
											local;

										def[0] = def[0].trim();
										def[1] = def[1] && def[1].trim();

										// true, если входной параметр родительского шаблона
										// присутствует также в дочернем
										local = params.some(function (el) {
											var val = el.split('=');
											val[0] = val[0].trim();
											val[1] = val[1] && val[1].trim();

											return val[0] === def[0];
										});

										// Если входный параметр родителя отсутствует у ребёнка,
										// то инициализируем его как локальную переменную шаблона
										if (!local) {
											// С параметром по умолчанию
											if (typeof def[1] !== 'undefined') {
												defParams += 'var ' + def[0] + ' = ' + def[1] + ';';
												varICache[tplName][def[0]] = el;
											}
										}
									});
								}

								// Параметры по умолчанию
								def[1] = def[1].trim();
								defParams += def[0] + ' = typeof ' + def[0] + ' !== \'undefined\' && ' + def[0] + ' !== null ? ' + def[0] + ' : ' + def[1] + ';';
							}

							// Кеширование
							varICache[tplName][def[0]] = el;

							// После последнего параметра запятая не ставится
							if (i !== params.length - 1) {
								if (canWrite) {
									res += ',';
								}
							}
						});
						if (canWrite) {
							res += ') { ' + defParams + 'var __SNAKESKIN_RESULT__ = \'\';';
						}

					} break;

					// Если указан этот флаг, то шаблон не добавляется в итоговый файл,
					// а используется только для наследования
					case 'cut' : {
						command = this._uescape(command.replace(/^cut\s+/, ''), quotContent);

						if (!this.write[command]) {
							this.write[command] = false;
						}
					} break;
					case 'save' : {
						this.write[this._uescape(command.replace(/^save\s+/, ''), quotContent)] = true;
					} break;

					// Условные операторы
					case 'if' : {
						beginI++;

						if (!parentName && !protoStart) {
							if (canWrite) {
								res += 'if (' + command.replace(/^if\s+/, '') + ') {';
							}
						}
					} break;
					case 'elseIf' : {
						if (!parentName && !protoStart) {
							if (canWrite) {
								res += '} else if (' + command.replace(/^elseIf\s+/, '') + ') {';
							}
						}
					} break;
					case 'else' : {
						if (!parentName && !protoStart) {
							if (canWrite) {
								res += '} else {';
							}
						}
					} break;

					// Пространство имён
					case 'with' : {
						withI.push({
							scope: command.replace(/^with\s+/, ''),
							i: ++beginI
						});
					} break;

					// Прототип блока наследования
					case 'proto' : {
						if (!opt_dryRun && ((parentName && !blockI.length && !protoI.length) || !parentName)) {
							// Попытка декларировать прототип блока несколько раз
							if (protoCache[tplName][command]) {
								error = new Error('Proto "' + command.replace(/^proto\s+/, '') + '" is already defined (command: {' + command + '}, template: "' + tplName + ', ' + this._genError(opt_info) + '")!');
								error.name = 'Snakeskin Error';

								throw error;
							}

							protoCache[tplName][command] = {from: i - startI + 1};
						}

						protoI.push({
							name: command,
							i: ++beginI,
							startI: i + 1
						});

						if (!parentName) {
							protoStart = true;
						}
					} break;

					// Применение прототипа
					case 'apply' : {
						if (!parentName && !protoI.length) {
							command = command.replace(/^apply/, 'proto');

							// Попытка применить не объявленный прототип
							// (запоминаем место вызова, чтобы вернуться к нему,
							// когда прототип будет объявлен)
							if (!protoCache[tplName][command]) {
								if (!backHash[command]) {
									backHash[command] = [];
									backHash[command].protoStart = protoStart;

									lastBack = command.replace(/^proto\s+/, '');
									backHashI++;
								}

								backHash[command].push(res.length);

							} else {
								if (canWrite) {
									res += protoCache[tplName][command].body;
								}
							}
						}
					} break;

					// Блок наследования
					case 'block' : {
						if (!opt_dryRun && ((parentName && !blockI.length && !protoI.length) || !parentName)) {
							// Попытка декларировать блок несколько раз
							if (blockCache[tplName][command]) {
								error = new Error('Block "' + command.replace(/^block\s+/, '') + '" is already defined (command: {' + command + '}, template: "' + tplName + ', ' + this._genError(opt_info) + '")!');
								error.name = 'Snakeskin Error';

								throw error;
							}

							blockCache[tplName][command] = {from: i - startI + 1};
						}

						blockI.push({
							name: command,
							i: ++beginI
						});
					} break;

					// Цикл
					case 'forEach' : {
						forEachI.push(++beginI);

						if (!parentName && !protoStart) {
							command = command.replace(/^forEach\s+/, '').split('=>');

							if (canWrite) {
								res += command[0] + ' && Snakeskin.forEach(' + command[0] + ', function (' + (command[1] || '') + ') {'
							}
						}
					} break;

					// БЕМ myFire блок
					case 'setBEM' : {
						command = command.replace(/^setBEM\s+/, '').match(/(.*?)\s+(.*)/);
						this.BEM[command[1]] = (new Function('return ' + this._uescape(command[2], quotContent)))();
					} break;

					case 'bem' : {
						bemI.push({
							i: ++beginI,
							tag: /\(/g.test(command) ? /\((.*?)\)/.exec(command)[1] : null
						});

						lastBEM = bemI[bemI.length - 1];

						// Получаем параметры инициализации блока и врапим имя кавычками
						command = lastBEM.tag ? command.replace(/^.*?\)([\s\S]*)/, '$1') : command.substring(3);
						command = command.trim().split(',');

						bemName = command[0];
						lastBEM.original = this.BEM[bemName] && this.BEM[bemName].tag;

						if (!parentName && !protoStart) {
							command[0] += '\'';
							command = command.join(',');

							command = command.split('${');
							if (command.length > 1) {
								command = command.reduce(function (str, el, i) {
									if (i === 1) {
										return that._uescape(str, quotContent).replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1') + '\\\'\' + Snakeskin.Filters.html(Snakeskin.Filters.undef(' + el.replace('}', ')) + \'\\\'');
									}

									if (i % 2) {
										return str + that._uescape(el, quotContent).replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1');

									} else {
										return str + '\\\'\' + Snakeskin.Filters.html(Snakeskin.Filters.undef(' + el.replace('}', ')) + \'\\\'');
									}
								});
							} else {
								command = that._uescape(command[0], quotContent).replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1');
							}

							if (canWrite) {
								res += '' +
								'__SNAKESKIN_RESULT__ += \'' +
								'<' + (lastBEM.tag || lastBEM.original || 'div') + ' class="i-bem" data-params="{name: \\\'' +
									command +
								'}">\';';
							}
						}
					} break;

					// Закрытие блока
					case 'end' : {
						beginI--;

						// Последний элементы стеков
						lastBlock = blockI[blockI.length - 1];
						lastProto = protoI[protoI.length - 1];
						lastWith = withI[withI.length - 1];

						lastForEach = forEachI[forEachI.length - 1];
						lastBEM = bemI[bemI.length - 1];

						// Закрытие шаблона
						if (beginI === 0) {
							// Вызовы не объявленных прототипов
							if (backHashI) {
								error = new Error('Proto "' + lastBack + '" is not defined (command: {' + command + '}, template: "' + tplName + ', ' + this._genError(opt_info) + '")!');
								error.name = 'Snakeskin Error';

								throw error;
							}

							if (opt_dryRun) { break; }

							// Кешируем тело шаблона
							cache[tplName] = source.substring(startI, i - commandLength - 1);

							// Обработка наследования:
							// тело шаблона объединяется с телом родителя
							// и обработка шаблона начинается заново,
							// но уже как атомарного (без наследования)
							if (parentName) {
								// Результирующее тело шаблона
								source = source.substring(0, startI) + this._getExtStr(tplName, opt_info) + source.substring(i - commandLength - 1);

								// Перемотка переменных
								// (сбрасывание)
								blockCache[tplName] = {};

								protoCache[tplName] = {};
								fromProtoCache[tplName] = 0;

								varCache[tplName] = {};
								fromVarCache[tplName] = 0;
								varICache[tplName] = {};

								i = startI - 1;
								beginI++;

								if (this.write[parentName] === false) {
									res = res.replace(new RegExp('/\\* Snakeskin template: ' + parentName.replace(/([.\[\]^$])/g, '\\$1') + ';[\\s\\S]*?/\\* Snakeskin template\\. \\*/', 'm'), '');
								}

								parentName = false;
								begin = false;
								beginStr = false;
								command = '';

								continue;
							}

							if (canWrite) {
								res += '' +
									'return __SNAKESKIN_RESULT__; };' +
								'if (typeof Snakeskin !== \'undefined\') {' +
									'Snakeskin.cache[\'' + this._uescape(tplName, quotContent).replace(/'/g, '\\\'') + '\'] = ' + (opt_commonjs ? 'exports.' : '') + tplName + ';' +
								'}/* Snakeskin template. */';
							}

							canWrite = true;
							tplName = null;

						// Закрываются все блоки кроме блоков наследования и пространства имён,
						// т.к. они в конечном шаблоне не используются,
						// а нужны для парсера
						} else if (!parentName &&
							(!lastProto || lastProto.i !== beginI + 1) &&
							(!lastBlock || lastBlock.i !== beginI + 1) &&
							(!lastWith || lastWith.i !== beginI + 1)
						) {
							// Если закрывается блок цикла
							if (lastForEach === beginI + 1) {
								if (!protoStart) {
									if (canWrite) {
										res += '});';
									}
								}

							// Закрытие BEM блока
							} else if (lastBEM && lastBEM.i === beginI + 1) {
								if (!protoStart) {
									if (canWrite) {
										res += '__SNAKESKIN_RESULT__ += \'</' + (lastBEM.tag || lastBEM.original || 'div') + '>\';';
									}
								}

							// Простой блок
							} else if (!protoStart) {
								if (canWrite) {
									res += '};';
								}
							}
						}

						if (lastForEach === beginI + 1) {
							forEachI.pop();
						}

						if (lastBEM && lastBEM.i === beginI + 1) {
							bemI.pop();
						}

						// Закрытие блоков наследования и пространства имён
						if (lastBlock && lastBlock.i === beginI + 1) {
							blockI.pop();

							if (!opt_dryRun && ((parentName && !blockI.length && !protoI.length) || !parentName)) {
								blockCache[tplName][lastBlock.name].to = i - startI - commandLength - 1;
							}
						}

						if (lastProto && lastProto.i === beginI + 1) {
							protoI.pop();

							if (!opt_dryRun && ((parentName && !blockI.length && !protoI.length) || !parentName)) {
								protoCache[tplName][lastProto.name].to = i - startI - commandLength - 1;
								fromProtoCache[tplName] = i - startI + 1;
							}

							// Рекурсивно анализируем прототипы блоков
							if (!parentName) {
								protoCache[tplName][lastProto.name].body = this.compile('{template ' + tplName + '()}' +
									source.substring(lastProto.startI, i - commandLength - 1) +
									'{end}', null, true);
							}

							if (backHash[lastProto.name] && !backHash[lastProto.name].protoStart) {
								backHash[lastProto.name].forEach(function (el) {
									if (canWrite) {
										res = res.substring(0, el) + protoCache[tplName][lastProto.name].body + res.substring(el);
									}
								});

								delete backHash[lastProto.name];
								backHashI--;
							}

							if (!protoI.length) {
								protoStart = false;
							}
						}

						// Закрытие with блока
						if (lastWith && lastWith.i === beginI + 1) {
							withI.pop();
						}

					} break;

					default : {
						// Экспорт console api
						if (!parentName && !protoStart && /console\./.test(command)) {
							if (canWrite) {
								res += command + ';';
							}

							break;
						}

						// Инициализация переменных
						if (/=(?!=)/.test(command)) {
							tmp = command.split('=')[0].trim();

							if (tplName) {
								// Попытка инициализировать переменную с зарезервированным именем
								if (varCache[tplName][tmp] || varICache[tplName][tmp]) {
									error = new Error('Variable "' + tmp + '" is already defined (command: {' + command + '}, template: "' + tplName + ', ' + this._genError(opt_info) + '")!');
									error.name = 'Snakeskin Error';

									throw error;
								}

								// Попытка повторной инициализации переменной
								if (sysConst[tmp]) {
									error = new Error('Can\'t declare variable "' + tmp + '", try another name (command: {' + command + '}, template: "' + tplName + ', ' + this._genError(opt_info) + '")!');
									error.name = 'Snakeskin Error';

									throw error
								}

								// Попытка инициализации переменной в цикле
								if (forEachI.length) {
									error = new Error('Variable "' + tmp + '" can\'t be defined in a loop (command: {' + command + '}, template: "' + tplName + ', ' + this._genError(opt_info) + '")!');
									error.name = 'Snakeskin Error';

									throw error;
								}

								// Кеширование
								varCache[tplName][tmp] = {
									from: i - startI - commandLength,
									to: i - startI
								}
								fromVarCache[tplName] = i - startI + 1;

								if (!parentName && !protoStart) {
									if (canWrite) {
										res += 'var ' + command + ';';
									}
								}

							} else {
								globalVarCache[tmp] = true;
								if (canWrite) {
									res += 'if (typeof Snakeskin !== \'undefined\') { Snakeskin.Vars.' + command + '; }';
								}
							}

						// Вывод переменных
						} else if (!parentName && !protoStart) {
							tmp = '';
							tmpI = 1;
							unEscape = false;

							// Поддержка фильтров через пайп
							command.replace(/\|\|/g, '__SNAKESKIN_ESCAPE__OR').split('|').forEach(function (el, i) {
								var part,
									sPart;

								if (i === 0) {
									// Если используется with блок
									if (withI.length) {
										withI.push({scope: el});
										tmp = withI.reduce(function (str, el) {
											return (typeof str.scope === 'undefined' ? str : str.scope) + '.' + el.scope;
										});
										withI.pop();

									} else {
										tmp = el;
									}

									tmp = 'Snakeskin.Filters.undef(' + (!varCache[tplName][tmp] && globalVarCache[tmp] ? 'Snakeskin.Vars.' : '') + tmp + ')';

								} else {
									part = el.split(' ');
									sPart = part.slice(1);

									// По умолчанию, все переменные пропускаются через фильтр html
									if (part[0] !== '!html') {
										tmpI++;
										tmp = 'Snakeskin.Filters[\'' + part[0] + '\'](' + tmp + (sPart.length ? ', ' + sPart.join('') : '') + ')';

									} else {
										unEscape = true;
									}
								}
							});

							if (canWrite) {
								res += '__SNAKESKIN_RESULT__ += ' + (!unEscape ? 'Snakeskin.Filters.html(' : '') + tmp + (!unEscape ? ')' : '') + ';';
							}
						}
					}
				}

				command = '';
				continue;
			}
		}

		// Запись команды
		if (begin) {
			if (!protoStart && beginStr) {
				if (canWrite) {
					res += '\';';
				}

				beginStr = false;
			}

			if ((quote[el] || el === '/') && (!source[i - 1] || source[i - 1] !== '\\')) {
				if (bOpen && bOpen === el) {
					bOpen = false;
				} else if (!bOpen) {
					bOpen = el;
				}
			}

			command += el;

		// Запись строки
		} else if (!protoStart) {
			if (!beginStr) {
				if (canWrite) {
					res += '__SNAKESKIN_RESULT__ += \'';
				}
				beginStr = true;
			}

			if (!parentName) {
				if (canWrite) {
					res += el;
				}
			}
		}
	}

	res = this._uescape(res, quotContent)
		.replace(/__SNAKESKIN_ESCAPE__OR/g, '||')

		// Обратная замена cdata областей
		.replace(/__SNAKESKIN_CDATA__(\d+)/g, function (sstr, pos) {
			return cData[pos]
				.replace(/\n/gm, '\\n')
				.replace(/\r/gm, '\\r')
				.replace(/\v/gm, '\\v')
				.replace(/'/gm, '&#39;');
		})
		// Удаление пустых операций
		.replace(/__SNAKESKIN_RESULT__ \+= '';/g, '');

	// Конец шаблона
	res += !opt_dryRun ? '/* Snakeskin templating system. Generated at: ' + new Date().toString() + '. */' : '';
	res += opt_commonjs ? '}' : '';

	// Если количество открытых блоков не совпадает с количеством закрытых,
	// то кидаем исключение
	if (beginI !== 0) {
		error = new Error('Missing closing or opening tag in the template (template: ' + tplName + ', ' + this._genError(opt_info) + ')!');
		error.name = 'Snakeskin Error';

		throw error;
	}

	if (opt_dryRun) {
		return res;
	}

	// Компиляция на сервере
	if (require) {
		// Экспорт
		if (opt_commonjs) {
			eval(res);

		// Простая компиляция
		} else {
			global.eval(res);
		}

	// Живая компиляция в браузере
	} else {
		window.eval(res);
	}

	return res;
};