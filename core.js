/////////////////////////////////
//// Шаблонизатор
/////////////////////////////////

var Snakeskin = {};
(function () {
	'use strict';
	
	var // Кеш шаблонов
		cache = {},
		// Кеш блоков
		blockCache = {},
		// Кеш переменных
		varCache = {},
		// Кеш входных параметров
		paramsCache = {},
		// Карта наследований
		extMap = {},
		// Стек CDATA
		cData = [],
		
		quote = {'"': true, '\'': true};
	
	/**
	 * Вернуть тело шаблона при наследовании
	 *
	 * @param {string} tplName - название шаблона
	 * @return {string}
	 */
	Snakeskin._getExtStr = function (tplName) {
		var // Исходный текст шаблона равен родительскому
			res = cache[extMap[tplName]],
			old = res.length,
			// Разница между длинами родительского и дочернего шаблона
			diff,
			
			// Блоки дочернего и родительского шаблона
			el = blockCache[tplName],
			prev = blockCache[extMap[tplName]],
			
			block,
			key,
			i = -1,
			
			// Позиция для вставки новой переменной
			from = 0;
		
		// Цикл производит перекрытие добавление новых блоков (новые блоки добавляются в конец шаблона)
		// (итерации 0 и 1), а затем
		// перекрытие и добавление новыхх переменных (итерации 2 и 3),
		// причём новые переменные добавляются сразу за унаследованными
		while (++i < 4) {
			if (i > 1) {
				// Переменные дочернего и родительского шаблона
				el = varCache[tplName];
				prev = varCache[extMap[tplName]];
				old = res.length;
			}
			
			for (key in el) {
				if (!el.hasOwnProperty(key)) { continue; }
				
				// Пересчитываем разницу
				diff = res.length - old;
				// Текст добавляемой области
				block = cache[tplName].substring(el[key].from, el[key].to);
				
				// Перекрытие
				if (prev[key] && (i === 0 || i === 2)) {
					if (i > 1) {
						from = prev[key].to + diff + 1;
					}
					
					res = res.substring(0, prev[key].from + diff) + block + res.substring(prev[key].to + diff, res.length);
				
				// Добавление
				} else if (!prev[key]) {
					// Блоки
					if (i === 1) {
						res += '{' + key + '}' + block + '{/end}';
					
					// Переменные
					} else if (i === 3) {
						block = '{' + block + '}';
						res = res.substring(0, from) + block + res.substring(from, res.length);
						from = from + block.length;
					}
				}
			}
		}
		
		return res;
	};
	
	/**
	 * Скомпилировать шаблоны
	 *
	 * @param {(Node|string)} src - ссылка на DOM узел, где лежат шаблоны, или текст шаблонов
	 * @return {string}
	 */
	Snakeskin.compile = function (src) {
		var // Подготовка текста шаблонов
			source = (src.innerHTML || src)
				// Однострочный комментарий
				.replace(/\/\/.*/g, '')
				// Переводы строк
				.replace(/[\n\r]/g, ' ')
				
				// Обработка блоков cdata
				.replace(/{cdata}([\s\S]*?){\/cdata}/, function (sstr, data) {
					cData.push(data);
					return '@cdata_' + (cData.length - 1);
				})
				
				// Многострочный комментарий
				.replace(/\/\*[\s\S]*?\*\//g, '')
				// Отступы
				.replace(/[\t]|[\s]{2}/g, ''),
			
			el,
			
			tplName,
			parentName,
			cycle,
			
			params,
			defParams,
			
			begin,
			beginI = 0,
			beginStr,
			
			blockI = [],
			lastBlock,
			withI = [],
			lastWith,
			
			command = '',
			
			tmp,
			tmpI,
			
			res = '',
			
			i = -1,
			bOpen,
			startI;
		
		while (++i < source.length) {
			el = source.charAt(i);
			
			if (el === '{') {
				begin = true;
				continue;
			
			} else if (el === '}') {
				begin = false;
				
				// Обработка команд
				switch (command.split(' ')[0]) {
					// Определение нового шаблона
					case 'template' : {
						beginI++;
						
						// Получаем имя и пространство имён шаблона
						tplName = command
							.replace(/^template\s+/, '')
							.replace(/\(.*/, '');
						
						// Создаём место в кеше
						blockCache[tplName] = {};
						varCache[tplName] = {};
						
						// Название родительского шаблона
						if (/\s+extends\s+/.test(command)) {
							parentName = command.replace(/.*?\s+extends\s+(.*)/, '$1');;
						}
						
						// Схема наследования
						extMap[tplName] = parentName;
						
						// С пространством имён
						if (/\./.test(tplName)) {
							res += tplName + '= function ('; 
						
						// Без простраства имён
						} else {
							res += 'function ' + tplName + '('; 
						}
						
						startI = i + 1;
						
						// Входные параметры
						params = command.replace(/.*?\((.*?)\).*/, '$1').split(',');
						paramsCache[tplName] = paramsCache[parentName] ? paramsCache[parentName].concat(params) : params;
						defParams = '';
						
						// Подмешивание родительских входных параметров
						if (paramsCache[parentName]) {
							paramsCache[parentName].forEach(function (el) {
								var def = el.split('=');
								def[0] = def[0].trim();
								def[1] = def[1] && def[1].trim();
								
								params.forEach(function (el2, i) {
									var def2 = el2.split('=');
									def2[0] = def2[0].trim();
									def2[1] = def2[1] && def2[1].trim();
									
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
							res += def[0];
							
							if (def.length > 1) {
								// Подмешивание родительских входных параметров
								if (paramsCache[parentName] && !defParams) {
									paramsCache[parentName].forEach(function (el) {
										var def = el.split('='),
											local;
										
										def[0] = def[0].trim();
										def[1] = def[1].trim();
										local = params.some(function (el) {
											var val = el.split('=');
											val[0] = val[0].trim();
											val[1] = val[1] && val[1].trim();
											
											return val[0] === def[0];
										});
										
										if (!local) {
											defParams += 'var ' + def[0] + ' = typeof ' + def[0] + ' !== \'undefined\' || ' + def[0] + ' !== null ? ' + def[0] + ' : ' + def[1] + ';';
										}
									});
								}
								
								def[1] = def[1].trim();
								defParams += def[0] + ' = typeof ' + def[0] + ' !== \'undefined\' || ' + def[0] + ' !== null ? ' + def[0] + ' : ' + def[1] + ';';
							}
							
							if (i !== params.length - 1) {
								res += ',';
							}
						});
						res += ') { ' + defParams + 'var __RESULT__ = \'\';';
					
					} break;
					
					// Условные операторы
					case 'if' : {
						beginI++;
						
						if (!parentName) {
							res += 'if (' + command.replace(/^\/?if\s+/, '') + ') {';
						}
					} break;
					case '/if' : {
						if (!parentName) {
							res += '}; if (' + command.replace(/^\/?if\s+/, '') + ') {';
						}
					} break;
					case 'elseIf' : {
						beginI++;
						
						if (!parentName) {
							res += '} else if (' + command.replace(/^elseIf\s+/, '') + ') {';
						}
					} break;
					case 'else' : {
						beginI++;
						
						if (!parentName) {
							res += '} else {';
						}
					} break;
					
					// Пространство имён
					case 'with' : {
						withI.push({
							scope: command.replace(/^with\s+/, ''),
							i: ++beginI
						});
					} break;
					
					// Блок наследования
					case 'block' : {
						blockCache[tplName][command] = {from: i - startI + 1};
						blockI.push({
							name: command,
							i: ++beginI
						});
					} break;
					
					// Закрытие блока
					case '/end' : {
						beginI--;
						lastBlock = blockI[blockI.length - 1];
						lastWith = withI[withI.length - 1];
						
						// Закрытие шаблона
						if (beginI === 0) {
							// Кешируем тело шаблона
							cache[tplName] = source.substring(startI, i - command.length - 1);
							
							// Обработка наследования
							if (parentName) {
								source = source.substring(0, startI) + this._getExtStr(tplName) + source.substring(i - command.length - 1, source.length);
								
								// Перемотка переменных
								varCache[tplName] = {};
								i = startI - 1;
								beginI++;
								
								parentName = false;
								begin = false;
								beginStr = false;
								command = '';
								
								continue;
							}
							
							res += 'return __RESULT__; };';
						
						// Закрываются все блоки кроме блоков наследования и пространства имён
						} else if (!parentName && (!lastBlock || lastBlock.i !== beginI + 1) && (!lastWith || lastWith.i !== beginI + 1)) {
							res += '};';
						}
						
						// Закртие блоков наследования и пространства имён
						if (lastBlock && lastBlock.i === beginI + 1) {
							blockCache[tplName][lastBlock.name].to = i - startI - command.length - 1;
							blockI.pop();
						}
						
						if (lastWith && lastWith.i === beginI + 1) {
							withI.pop();
						}
						
					} break;
					
					// Цикл
					case 'forEach' : {
						beginI++;
						
						if (!parentName) {
							cycle = command.replace(/^forEach\s+/, '').split(' => ');
							res +=  cycle[0] + ' && Snakeskin.forEach(' + cycle[0] + (cycle[1] ? ',' + cycle[1] : '') + ') {'
						}
					} break;
					
					default : {
						// Экспорт console api
						if (!parentName && /console\./.test(command)) {
							res += command + ';';
							break;
						}
						
						// Инициализация переменных
						if (/=(?!=)/.test(command)) {
							tmp = command.split('=')[0].trim();
							
							// Попытка повторной инициализации переменной
							if (varCache[tplName][tmp]) {
								throw new Error('Variable "' + tmp + '" has already defined (template: "' + tplName + '")!');
							}
							
							// Кеширование
							varCache[tplName][tmp] = {
								from: i - startI - command.length,
								to: i - startI
							}
							
							if (!parentName) {
								res += 'var ' + command + ';';
							}
						
						// Вывод переменных
						} else if (!parentName) {
							tmp = '';
							tmpI = 1;
							bOpen = false;
							
							// Экранирование пайпов в строке
							command = command.split('');
							command.forEach(function (el, i) {
								if (quote[el]) {
									if (!command[i - 1] || command[i - 1] !== '\\') {
										if (bOpen && bOpen === el) {
											bOpen = false;
										} else {
											bOpen = el;
										}
									}
								} else if (el === '|' && bOpen) {
									command[i] = '__SNAKESKIN_ESCAPE__PIPE';
								}
							});
							command = command.join('');
							
							// Поддержка фильтров через пайп
							command.split('|').forEach(function (el, i, data) {
								var part,
									sPart;
								
								if (i === 0) {
									if (withI.length) {
										withI.push({scope: el});
										tmp = withI.reduce(function (str, el) {
											return (typeof str.scope === 'undefined' ? str : str.scope) + '.' + el.scope;
										});
										withI.pop();
									} else {
										tmp = el;
									}
								
								} else {
									tmpI++;
									part = el.split(' ');
									sPart = part.slice(1);
									
									tmp = 'Snakeskin.Filters[\'' + part[0] + '\'](' + tmp + (sPart.length ? ', ' + sPart.join('') : '') + ')';
								}
							});
							
							res += '__RESULT__ += ' + tmp.replace(/__SNAKESKIN_ESCAPE__PIPE/g, '|') + ';';
						}
					}
				}
				
				command = '';
				continue;
			}
		
			if (begin) {
				if (beginStr) {
					res += '\';';
					beginStr = false;
				}
				
				command += el;
			} else {
				if (!beginStr) {
					res += '__RESULT__ += \'';
					beginStr = true;
				}
				
				if (!parentName) {
					res += el;
				}
			}
		}
		
		res = res
			.replace(/@cdata_(\d+)/g, function (sstr, pos) {
				console.log(pos)
				return cData[pos]; 
			})
			.replace(/__RESULT__ \+= '';/g, '');
		
		console.log(res);
	};
})();