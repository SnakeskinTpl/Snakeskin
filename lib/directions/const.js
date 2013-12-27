var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'const',

	null,

	function (command, commandLength, dir, params) {
		
		var tplName = dir.tplName;

		// Инициализация переменных
		if (/^[@#$a-z_][$\w\[\].'"\s]*[^=]=[^=]/im.test(command)) {
			var varName = command.split('=')[0].trim(),
				mod = varName.charAt(0);

			if (dir.structure.parent) {
				dir.startInlineDir('const');

				if (dir.isAdvTest(params.dryRun) && !dir.varCache[varName] && mod !== '#' && mod !== '@') {
					// Попытка повторной инициализации переменной
					if (constCache[tplName][varName] || constICache[tplName][varName]) {
						throw dir.error('Constant "' + varName + '" is already defined, ' +
							dir.genErrorAdvInfo(params.info)
						);
					}

					// Попытка инициализировать переменную с зарезервированным именем
					if (sysConst[varName]) {
						throw dir.error('Can\'t declare constant "' + varName + '", try another name, ' +
							dir.genErrorAdvInfo(params.info)
						);
					}

					// Попытка инициализации переменной внутри итератора
					if (dir.hasParent({'forEach': true, 'forIn': true})) {
						throw dir.error('Constant "' + varName + '" can\'t be defined in a iterator, ' +
							dir.genErrorAdvInfo(params.info)
						);
					}

					// Кеширование
					constCache[tplName][varName] = {
						from: dir.i - dir.startI - commandLength,
						to: dir.i - dir.startI
					};

					fromConstCache[tplName] = dir.i - dir.startI + 1;
				}

				if (dir.isSimpleOutput(params.info)) {
					if (!dir.varCache[varName] && mod !== '#' && mod !== '@') {
						dir.save(dir.prepareOutput((!/[.\[]/m.test(varName) ? 'var ' : '') + command + ';', true));

					} else {
						dir.save(dir.prepareOutput(command + ';', true));
					}
				}

			} else {
				dir.startInlineDir('globalVar');
				dir.save('if (typeof Snakeskin !== \'undefined\') { Snakeskin.Vars.' +
					dir.prepareOutput(command, true, null, true) +
				'; }');
			}

		// Вывод значения
		} else {
			if (!dir.structure.parent) {
				throw dir.error('Directive "output" can only be used within a "template" or "proto", ' +
					dir.genErrorAdvInfo(params.info)
				);
			}

			dir.startInlineDir('output');
			if (dir.isSimpleOutput(params.info)) {
				dir.save('__SNAKESKIN_RESULT__ += ' + dir.prepareOutput(command) + ';');
			}
		}
	}
);