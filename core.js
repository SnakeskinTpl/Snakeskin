/////////////////////////////////
//// Шаблонизатор
/////////////////////////////////

var Snakeskin = {};
(function () {
	'use strict';
	
	var cache = {},
		blockCache = {},
		varCache = {},
		extMap = {},
		cData = [];
	
	Snakeskin._getExtStr = function (tplName) {
		var res = cache[extMap[tplName]],
			old = res.length,
			diff,
			
			el = blockCache[tplName],
			prev = blockCache[extMap[tplName]],
			
			block,
			key,
			i = -1,
			
			from = 0;
		
		while (++i < 3) {
			if (i > 0) {
				el = varCache[tplName];
				prev = varCache[extMap[tplName]];
				old = res.length;
			}
			
			for (key in el) {
				if (!el.hasOwnProperty(key)) { continue; }
				
				diff = res.length - old;
				block = cache[tplName].substring(el[key].from, el[key].to);
				
				if (prev[key]) {
					if (i > 0) {
						from = prev[key].to + diff + 1;
					}
					
					res = res.substring(0, prev[key].from + diff) + block + res.substring(prev[key].to + diff, res.length);
				
				} else if (i === 2) {
					block = '{' + block + '}';
					res = res.substring(0, from) + block + res.substring(from, res.length);
					from = from + block.length;
				}
			}
		}
		
		return res;
	};
	
	/**
	 * Скомпилировать шаблоны
	 *
	 * @param {} node - 
	 * @return {}
	 */
	Snakeskin.compile = function (node) {
		var // Подготовка текста шаблонов
			source = node.innerHTML
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
			fakeBegin = 0,
			beginStr,
			
			blockI = [],
			
			command = '',
			commandDesc,
			
			tmp,
			tmpI,
			
			res = '',
			
			i = -1,
			startI;
		
		while (++i < source.length) {
			el = source.charAt(i);
			
			if (el === '{') {
				if (!begin) {
					begin = true;
					
					continue;
				
				} else {
					fakeBegin++;
				}
			
			} else if (el === '}') {
				if (fakeBegin) {
					fakeBegin--;
				
				} else {
					begin = false;
					// Название команды
					commandDesc = command.split(' ')[0];
					
					switch (commandDesc) {
						// Определение нового шаблона
						case 'template' : {
							beginI++;
							
							// Получаем имя и пространство имён шаблона
							tplName = command
								.replace(/^template\s+/, '')
								.replace(/\(.*/, '');
							
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
							defParams = '';
							
							// Инициализация параметров по умолчанию
							// (эээххх, когда же настанет ECMAScript 6 :()
							params.forEach(function (el, i) {
								var def = el.split('=');
								def[0] = def[0].trim();
								res += def[0];
								
								if (def.length > 1) {
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
							beginI++;
							
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
							tmp = blockI[blockI.length - 1];
							
							// Закрытие шаблона
							if (beginI === 0) {
								// Кешируем тело шаблона
								cache[tplName] = source.substring(startI, i - command.length - 1);
								
								// Обработка наследования
								if (parentName) {
									source = source.substring(0, startI) + this._getExtStr(tplName) + source.substring(i - command.length - 1, source.length);
									i = startI - 1;
									beginI++;
									
									parentName = false;
									begin = false;
									beginStr = false;
									command = '';
									
									continue;
								}
								
								res += 'return __RESULT__; };';
							
							} else if (!parentName && (!tmp || tmp.i !== beginI + 1)) {
								res += '};';
							}
							
							if (tmp && tmp.i === beginI + 1) {
								blockCache[tplName][tmp.name].to = i - startI - command.length - 1;
								blockI.pop();
							}
							
						} break;
						
						// Цикл
						case 'forEach' : {
							beginI++;
							
							if (!parentName) {
								cycle = command.replace(/^forEach\s+/, '').split(' as ');
								res +=  cycle[0] + ' && Snakeskin.forEach(' + cycle[0] + (cycle[1] ? ',' + cycle[1] : '') + ') {'
							}
						} break;
						
						default : {
							// Инициализация переменных
							if (/=(?!=)/.test(command)) {
								tmp = command.split('=')[0].trim();
								if (varCache[tplName][tmp]) {
									throw new Error('Can\'t ');
								}
								
								varCache[tplName][tmp] = {
									from: i - startI - command.length,
									to: i - startI
								};
								
								if (!parentName) {
									res += 'var ' + command + ';';
								}
							
							// Вывод переменных
							} else if (!parentName) {
								tmp = '';
								tmpI = 1;
								
								// Поддержка фильтров через пайп
								command.split('|').reverse().forEach(function (el, i, data) {
									var part,
										sPart;
									
									if (i === data.length - 1) {
										tmp += el + new Array(tmpI).join(')');
									
									} else {
										tmpI++;
										part = el.split(' ');
										sPart = part.slice(1);
										
										tmp += 'Snakeskin.Filters[\'' + part[0] + '\'](' + (sPart.length ? sPart.join('') + ', ' : '');
									}
								});
								
								res += '__RESULT__ += ' + tmp + ';';
							}
						}
					}
					
					command = '';
					continue;
				}
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
				return cData[pos]; 
			})
			.replace(/__RESULT__ \+= '';/g, '');
		
		console.log(res);
	};
})();