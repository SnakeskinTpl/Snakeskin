/////////////////////////////////
//// Шаблонизатор
/////////////////////////////////

var Snakeskin = {};
(function () {
	var nlRgxp = /[\n\r]/g,
		whitespaceRgxp = /[\t]|[\s]{2}/g,
		commentRgxp = /\/\*.*?\*\//g,
		
		paramsRgxp = /.*?\((.*?)\).*/,
		withoutParamsRgxp = /\(.*/,
		dotRgxp = /\./,
		equalRgxp = /=/g,
		
		templateRgxp = /^template\s+/,
		varRgxp = /^var\s+/,
		blockRgxp = /^block\s+/,
		forEachRgxp = /^forEach\s+/,
		
		ifRgxp = /^\/?if\s+/,
		elseIfRgxp = /^elseIf\s+/,
		elseRgxp = /^else\s+/,
		
		cache = {},
		extMap = {};
	
	Snakeskin._getExtStr = function (tplName) {
		var res = '';
			
			chain = [tplName],
			nextName = tplName,
			
			i = -1;
		
		while (typeof extMap[nextName] !== 'undefined') {
			nextName = extMap[nextName];
			chain.unshift(nextName);
		}
		
		while (++i < chain.length) {
			if (i === 0) {
				res = cache[chain[i]];
				continue;
			}
			
			(cache[chain[i]].match(/{block .*?}.*?{\/block}/g) || []).forEach(function (el) {
				var blockName = el.replace(/{block (.*?)}.*/, '$1');
				
				res = res.replace(new RegExp('{block ' + blockName + '}.*?{\\/block}'), el);
			});
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
				.replace(nlRgxp, ' ')
				.replace(whitespaceRgxp, '')
				.replace(commentRgxp, ''),
			
			tplName,
			parentName,
			cycle,
			nm = '',
			
			params,
			defParams,
			
			begin,
			fakeBegin = 0,
			beginStr,
			endElse,
			
			command = '',
			commandDesc,
			
			tmp,
			tmpI,
			
			res = '',
			
			i = -1,
			startI,
			startJ;
		
		while (++i < source.length) {
			if (source.charAt(i) === '{') {
				if (!begin) {
					begin = true;
					continue;
				
				} else {
					fakeBegin++;
				}
			
			} else if (source.charAt(i) === '}') {
				if (fakeBegin) {
					fakeBegin--;
				
				} else {
					begin = false;
					// Название команды
					commandDesc = command.split(' ')[0];
					
					switch (commandDesc) {
						// Определение нового шаблона
						case 'template' : {
							// Получаем имя и пространство имён шаблона
							tplName = command
								.replace(templateRgxp, '')
								.replace(withoutParamsRgxp, '');
							
							// Название родительского шаблона
							if (/ extends /.test(command)) {
								parentName = command.replace(/.*? extends (.*)/, '$1');;
							}
							
							// Схема наследования
							extMap[tplName] = parentName;
							
							// С пространством имён
							if (dotRgxp.test(tplName)) {
								res += tplName + '= function ('; 
							
							// Без простраства имён
							} else {
								res += 'function ' + tplName + '('; 
							}
							startI = i - command.length - 1;
							startJ = i + 1;
							
							// Входные параметры
							params = command.replace(paramsRgxp, '$1').split(',');
							defParams = '';
							
							// Инициализация параметров по умолчанию
							// (эээххх, когда же настанет ECMAScript 6 :()
							params.forEach(function (el, i) {
								var def = el.split('=');
								def[0] = def[0].trim();
								res += def[0];
								
								if (def.length > 1) {
									def[1] = def[1].trim();
									defParams += def[0] + ' = typeof ' + def[0] + '!== \'undefined\' || ' + def[0] + ' !== null?' + def[0] + ':' + def[1] + ';';
								}
								
								if (i !== params.length - 1) {
									res += ',';
								}
							});
							res += '){' + defParams + 'var __RESULT__ = \'\';';
						} break;
						
						// Локальные переменные
						case 'var' : {
							if (!parentName) {
								res += 'var ' + command.replace(varRgxp, '') + ';';
							}
						} break;
						
						// Условные операторы
						case 'if' : {
							if (!parentName) {
								res += 'if (' + command.replace(ifRgxp, '') + ') {';
							}
						} break;
						case '/if' : {
							if (!parentName) {
								res += '}; if (' + command.replace(ifRgxp, '') + ') {';
							}
						} break;
						case 'elseIf' : {
							if (!parentName) {
								res += '} else if (' + command.replace(elseIfRgxp, '') + ') {';
							}
						} break;
						case 'else' : {
							if (!parentName) {
								res += '} else {';
							}
						} break;
						
						// Блок
						case 'block' :
						case '/block' : break;
						
						// Закрытие блока
						case '/' : {
							if (!parentName) {
								res += '};';
							}
						} break;
						
						// Закрытие шаблона
						case '/template' : {
							cache[tplName] = source.substring(startJ, i - 10);
							
							if (parentName) {
								source = source.substring(0, startJ) + this._getExtStr(tplName) + source.substring(i - 10, source.length);
								i = startJ;
								
								parentName = false;
								begin = false;
								beginStr = false;
								command = '';
								
								continue;
							}
							
							res += 'return __RESULT__; };';
						} break;
						
						case 'forEach' : {
							if (!parentName) {
								cycle = command.replace(forEachRgxp, '').split(' as ');
								res +=  cycle[0] + ' && Snakeskin.forEach(' + cycle[0] + (cycle[1] ? ',' + cycle[1] : '') + ') {'
							}
						} break;
						
						// Вывод переменных
						default : {
							if (!parentName) {
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
				
				command += source.charAt(i);
			} else {
				if (!beginStr) {
					res += '__RESULT__ += \'';
					beginStr = true;
				}
				
				if (!parentName) {
					res += source.charAt(i);
				}
			}
		}
		
		console.log(res);
	};
})();