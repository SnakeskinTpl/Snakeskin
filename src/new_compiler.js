/**
 * Скомпилировать шаблоны
 *
 * @param {(Node|string)} src - ссылка на DOM узел, где лежат шаблоны, или текст шаблонов
 * @param {?boolean=} [opt_commonJS=false] - если true, то шаблон компилируется с экспортом
 * @param {?boolean=} [opt_dryRun=false] - если true, то шаблон только транслируется (не компилируется), приватный параметр
 * @param {Object=} [opt_info] - дополнительная информация, приватный параметр
 * @return {string}
 *
 * @test compile_test.html
 */
Snakeskin.compile = function (src, opt_commonJS, opt_dryRun, opt_info) {
	opt_info = opt_info || {};
	if (src.innerHTML) {
		opt_info.node = src;
	}

	var vars = {
			i: -1,
			// Количество открытых скобок
			beginI: 0,

			// Содержимое скобок
			quotContent: [],

			// Исходный текст шаблона
			source: String(src.innerHTML || src)
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

			// Результирующий JS код
			res: '' +
				(!opt_dryRun ? '/* This code is generated automatically, don\'t alter it. */' : '') +
				(opt_commonJS ?
					'var Snakeskin = global.Snakeskin;' +

					'exports.liveInit = function (path) { ' +
						'Snakeskin = require(path);' +
						'exec();' +
						'return this;' +
					'};' +

					'function exec() {'
				: ''),

			/**
			 * Добавить строку в результирующую
			 *
			 * @this {!Object} vars
			 * @param {string} str - исходная строка
			 */
			save: function (str) {
				if (this.canWrite) {
					this.res += str;
				}
			}
		},

		begin,
		fakeBegin = 0,
		beginStr,

		command = '',
		commandType,
		commandLength,

		el,
		bOpen;

	while (++vars.i < vars.source.length) {
		el = vars.source.charAt(vars.i);

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
				command = this._escape(command, vars.quotContent).trim();

				commandType = command.split(' ')[0];
				commandType = this.Directions[commandType] ? commandType : 'const';

				// Обработка команд
				this.Directions[commandType].call(this,
					commandType !== 'const' ? command.replace(new RegExp('^' + commandType + '\\s+'), '') : commandType,
					commandLength,

					vars,
					{
						commonJS: opt_commonJS,
						dryRun: opt_dryRun,
						info: opt_info
					}
				);

				command = '';
				continue;
			}
		}

		// Запись команды
		if (begin) {
			if (!vars.protoStart && beginStr) {
				vars.save('\';');
				beginStr = false;
			}

			if ((quote[el] || el === '/') && (!vars.source[vars.i - 1] || vars.source[vars.i - 1] !== '\\')) {
				if (bOpen && bOpen === el) {
					bOpen = false;

				} else if (!bOpen) {
					bOpen = el;
				}
			}

			command += el;

		// Запись строки
		} else if (!vars.protoStart) {
			if (!beginStr) {
				vars.save('__SNAKESKIN_RESULT__ += \'');
				beginStr = true;
			}

			if (!vars.parentName) {
				vars.save(el);
			}
		}
	}

	vars.res = this._uescape(vars.res, vars.quotContent)
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
	vars.res += !opt_dryRun ? '/* Snakeskin templating system. Generated at: ' + new Date().toString() + '. */' : '';
	vars.res += opt_commonJS ? '}' : '';

	if (opt_dryRun) {
		return vars.res;
	}

	console.log(vars.res);

	return vars.res;
};