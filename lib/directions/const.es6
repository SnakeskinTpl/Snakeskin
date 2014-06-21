Snakeskin.addDirective(
	'const',

	{

	},

	function (command, commandLength) {
		var tplName = this.tplName;

		var frgxp = /^[@#$a-z_][$\w\[\].'"\s]*=[^=]/i;
		var rgxp = this.scope.length ?
			frgxp : /^[$a-z_][$\w\[\].'"\s]*=[^=]/i;

		// Инициализация констант
		if (rgxp.test(command)) {
			let parts = command.split('=');

			if (!parts[1] || !parts[1].trim()) {
				throw this.error(`Invalid "${this.name}" declaration (${command})`);
			}

			let name = parts[0].trim(),
				mod = name.charAt(0);

			if (mod === '#' || mod === '@') {
				throw this.error(`Can't declare constant "${name}" with the context modifier`);
			}

			if (this.structure.parent) {
				this.startInlineDir('const', {
					name: name
				});

				if (this.isSimpleOutput()) {
					this.save(this.prepareOutput((!/[.\[]/.test(name) ? 'var ' : '') + command + ';', true));
				}

				if (this.isAdvTest()) {
					// Попытка повторной инициализации константы
					if (constCache[tplName][name] ? !constCache[tplName][name].tmp : constICache[tplName][name]) {
						throw this.error(`Constant "${name}" is already defined`);
					}

					// Попытка инициализации константы, которая была объявлена как переменная
					if (this.varCache[tplName][name]) {
						throw this.error(`Constant "${name}" is already defined as variable`);
					}

					// Попытка инициализировать константу с зарезервированным именем
					if (sysConst[name]) {
						throw this.error(`Can't declare constant "${name}", try another name`);
					}

					constCache[tplName][name] = {
						from: this.i - this.startTemplateI - commandLength,
						to: this.i - this.startTemplateI
					};

					fromConstCache[tplName] = this.i - this.startTemplateI + 1;
				}

			} else {
				this.startInlineDir('globalVar');
				this.save(`
					if (typeof Snakeskin !== 'undefined') {
						Snakeskin.Vars.${this.prepareOutput(command, true, null, true)};
					}
				`);
			}

		// Вывод значения
		} else {
			if (!this.structure.parent) {
				throw this.error('Directive "output" can only be used within a "template" or "proto"');
			}

			this.startInlineDir('output');
			if (this.isSimpleOutput()) {
				this.text = true;

				if (/^[@#$a-z_][$\w\[\].'"\s+-\/*><^]*=[^=]/.test(command)) {
					this.save(this.prepareOutput(command, true) + ';');
					return;
				}

				this.save(`__SNAKESKIN_RESULT__ += ${this.prepareOutput(command)};`);
			}
		}
	}
);