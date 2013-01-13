/////////////////////////////////
//// Шаблонизатор
/////////////////////////////////

var Snakeskin = {};
(function () {
	var nlRgxp = /[\n\r]/g,
		whitespaceRgxp = /[\t]|[\s]{2}/g,
		commentRgxp = /<!--{.*?}-->/g,
		
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
		
		cache = {};
	
	/**
	 * Скомпилировать шаблоны
	 *
	 * @param {} node - 
	 * @return {}
	 */
	Snakeskin.compile = function (node) {
		var source = node.innerHTML
				.replace(nlRgxp, '')
				.replace(whitespaceRgxp, '')
				.replace(commentRgxp, ''),
			
			tplName,
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
			startI;
		
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
					commandDesc = command.split(' ')[0];
					
					switch (commandDesc) {
						// Определение нового шаблона
						case 'template' : {
							// Получаем имя и пространство имён шаблона
							tplName = command
								.replace(templateRgxp, '')
								.replace(withoutParamsRgxp, '');
							
							// С пространством имён
							if (dotRgxp.test(tplName)) {
								res += tplName + '=function ('; 
							
							// Без простраства имён
							} else {
								res += 'function ' + tplName + '('; 
							}
							startI = i - command.length - 1;
							
							// Входные параметры
							params = command.replace(paramsRgxp, '$1').split(',');
							defParams = '';
							
							// Инициализация параметров по умолчанию
							params.forEach(function (el, i) {
								var def = el.split('=');
								def[0] = def[0].trim();
								res += def[0];
								
								if (def.length > 1) {
									def[1] = def[1].trim();
									defParams += def[0] + '=typeof ' + def[0] + '!== \'undefined\'||' + def[0] + '!==null?' + def[0] + ':' + def[1] + ';';
								}
								
								if (i !== params.length - 1) {
									res += ',';
								}
							});
							res += '){' + defParams + 'var __RESULT__ = \'\';';
						} break;
						
						// Локальные переменные
						case 'var' : {
							res += 'var ' + command.replace(varRgxp, '') + ';';
						} break;
						
						// Условные операторы
						case 'if' : {
							res += 'if (' + command.replace(ifRgxp, '') + '){';
						} break;
						case '/if' : {
							res += '};if (' + command.replace(ifRgxp, '') + '){';
						} break;
						case 'elseIf' : {
							res += '} else if (' + command.replace(elseIfRgxp, '') + '){';
						} break;
						case 'else' : {
							res += '} else {';
						} break;
						
						// Блок
						case 'block' :
						case '/block' : break;
						
						// Закрытие блока
						case '/' : {
							res += '};';
						} break;
						
						// Закрытие шаблона
						case '/template' : {
							res += 'return __RESULT__;};';
							cache[tplName] = source.substring(startI, i + 1);
						} break;
						
						case 'forEach' : {
							cycle = command.replace(forEachRgxp, '').split(' as ');
							res +=  cycle[0] + ' && Snakeskin.forEach(' + cycle[0] + (cycle[1] ? ',' + cycle[1] : '') + '){'
						} break;
						
						// Вывод переменных
						default : {
							tmp = '';
							tmpI = 1;
							command.split('|').reverse().forEach(function (el, i, data) {
								var part,
									sPart;
								
								if (i === data.length - 1) {
									tmp += el + new Array(tmpI).join(')');
								} else {
									tmpI++;
									part = el.split(' ');
									sPart = part.slice(1);
									
									tmp += 'Snakeskin.Filters[\'' + part[0] + '\'](' + (sPart.length ? sPart.join('') + ',' : '');
								}
							});
							
							res += '__RESULT__ +=' + tmp + ';';
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
					res += '__RESULT__ +=\'';
					beginStr = true;
				}
				
				res += source.charAt(i);
			}
		}
		console.log(res);
	};
})();