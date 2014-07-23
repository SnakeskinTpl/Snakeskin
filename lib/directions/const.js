Snakeskin.addDirective(
	'const',

	{
		group: [
			'inherit',
			'inlineInherit'
		]
	},

	function (command, commandLength) {
		var tplName = this.tplName,
			rgxp = new RegExp((("^[$a-z_" + (!this.scope.length ? L_MOD : '')) + "][$\\w\\[\\].\\s]*=[^=]"));

		// Инициализация констант
		if (!tplName || rgxp.test(command)) {
			if (tplName) {
				var parts = command.split('=');

				if (!parts[1] || !parts[1].trim()) {
					return this.error(("invalid \"constant\" declaration"));
				}

				var name = this.pasteDangerBlocks(parts[0].trim());

				if (name.charAt(0) === L_MOD) {
					return this.error((("can\'t declare constant \"" + (name.substring(1))) + ("\" with the context modifier (" + L_MOD) + ")"));
				}

				name = name.replace(/\[(['"`])(.*?)\1]/g, '.$2');
				this.startInlineDir('const', {
					name: name
				});

				if (this.isSimpleOutput()) {
					this.save((!/[.\[]/.test(name) ? 'var ' : '') + this.prepareOutput(command, true, null, true) + ';');
				}

				if (this.isAdvTest()) {
					// Попытка повторной инициализации константы
					if (constCache[tplName][name]) {
						return this.error((("constant \"" + name) + "\" is already defined"));
					}

					// Попытка инициализации константы, которая была объявлена как переменная
					if (this.varCache[tplName][name]) {
						return this.error((("constant \"" + name) + "\" is already defined as variable"));
					}

					// Попытка инициализировать константу с зарезервированным именем
					if (sysConst[name]) {
						return this.error((("can't declare constant \"" + name) + "\", try another name"));
					}

					var start = this.i - this.startTemplateI,
						parent;

					if (this.parentTplName) {
						parent = constCache[this.parentTplName][name];
					}

					constCache[tplName][name] = {
						from: start - commandLength,
						to: start,

						proto: this.protoStart ||
							Boolean(this.parentTplName && parent && parent.proto),

						needPrfx: this.needPrfx
					};

					if (!this.protoStart) {
						fromConstCache[tplName] = start + 1;
					}
				}

			} else {
				this.startInlineDir('superGlobalVar');

				if (!isAssign(command, true)) {
					return this.error((("invalid \"" + (this.name)) + "\" declaration"));
				}

				this.save((("\
\n					__VARS__" + ((command.charAt(0) !== '[' ? '.' : '') + this.prepareOutput(command, true, null, true))) + ";\
\n				"));
			}

		// Вывод значения
		} else {
			if (!this.structure.parent) {
				return this.error(("Directive \"output\" can be used only within a " + (groupsList['template'].join(', '))));
			}

			this.startInlineDir('output');
			if (this.isSimpleOutput()) {
				this.text = true;

				if (isAssign(command)) {
					this.save((("" + (this.prepareOutput(command, true))) + ";"));
					return;
				}

				this.save(this.wrap(this.prepareOutput(command)));
			}
		}
	}
);

Snakeskin.addDirective(
	'output',

	{
		placement: 'template',
		notEmpty: true
	},

	function () {
		Snakeskin.Directions['const'].apply(this, arguments);
	}
);

Snakeskin.addDirective(
	'global',

	{
		notEmpty: true
	},

	function () {
		if (this.tplName) {
			return this.error((("directive \"" + (this.name)) + "\" can be used only within the global space"));
		}

		Snakeskin.Directions['const'].apply(this, arguments);
	}
);

/**
 * Вернуть true, если в строке идёт присвоение значения переменной
 *
 * @param {string} str - исходная строка
 * @param {?boolean=} [opt_global=false] - если true, то идёт проверка суперглобальной переменной
 * @return {boolean}
 */
function isAssign(str, opt_global) {
	var rgxp = new RegExp((("^[" + (G_MOD + L_MOD)) + ("$a-z_" + (opt_global ? '[' : '')) + "]"), 'i');

	if (!rgxp.test(str)) {
		return false;
	}

	var count = 0,
		eq = false;

	for (var i = 0; i < str.length; i++) {
		var el = str.charAt(i);

		if (bMap[el]) {
			count++;
			continue;

		} else if (closeBMap[el]) {
			count--;
			continue;
		}

		if (el === '=' && !eq && !count && str.charAt(i + 1) !== '=') {
			return true;
		}

		eq = el === '=';
	}

	return false;
}