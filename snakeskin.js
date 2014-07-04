module.exports = exports = require('./build/snakeskin.min');

var compile = exports['compile'];
var jossy = require('jossy');

/**
 * Скомпилировать указанный файл шаблонов Snakeskin
 *
 * @see export.compile
 * @param {string} src - путь к файлу c шаблонами
 * @param {function(Error, string=)} callback - функция обратного вызова
 *
 * @param {Object=} [opt_params] - дополнительные параметры запуска, или если true,
 *     то шаблон компилируется с экспортом в стиле commonJS
 *
 * @see https://github.com/Kolyaj/Jossy
 * @param {Object=} [opt_params.builder] - объект настроек для сборщика файлов
 * @param {Array=} [opt_params.builder.labels] - массив меток для сборщика файлов (jossy)
 * @param {Object=} [opt_params.builder.flags] - таблица флагов для сборщика файлов (jossy)
 *
 * @param {?boolean=} [opt_params.localization=true] - если false, то блоки ` ... ` не заменяются на вызов i18n
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
 * @param {?boolean=} [opt_params.prettyPrint] - если true, то полученный JS код шаблона
 *     отображается в удобном для чтения виде
 */
exports.compileFile = function (src, callback, opt_params) {
	opt_params = opt_params || {};
	opt_params.onError = callback;

	var builder = opt_params.builder || {};
	var res = false,
		info = {file: src};

	jossy.compile(src, builder.labels || null, builder.flags || null, function(err, data)  {
		if (err) {
			callback(err);

		} else {
			res = compile(data, opt_params, info);

			if (res !== false) {
				callback(null, String(res));
			}
		}
	});
};