Snakeskin.addDirective(
	'const',

	{

	},

	function (command, commandLength) {
		var tplName = this.tplName,
			rgxp = new RegExp((("^[$a-z_" + (!this.scope.length ? '#' : '')) + "][$\\w\\[\\].\\s]*=[^=]"));

		// Инициализация констант
		if (!tplName || rgxp.test(command)) {
			if (tplName) {
				var parts = command.split('=');

				if (!parts[1] || !parts[1].trim()) {
					return this.error((("invalid \"constant\" declaration (" + command) + ")"));
				}

				var name = this.pasteDangerBlocks(parts[0].trim());

				if (name.charAt(0) === '#') {
					return this.error((("can\'t declare constant \"" + (name.substring(1))) + "\" with the context modifier (#)"));
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
					if (constCache[tplName][name] ? !constCache[tplName][name].tmp : constICache[tplName][name]) {
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

					constCache[tplName][name] = {
						from: this.i - this.startTemplateI - commandLength,
						to: this.i - this.startTemplateI
					};

					fromConstCache[tplName] = this.i - this.startTemplateI + 1;
				}

			} else {
				this.startInlineDir('superGlobalVar');
				this.save((("\
\n					if (typeof Snakeskin !== 'undefined') {\
\n						Snakeskin.Vars" + ((command.charAt(0) !== '[' ? '.' : '') + this.prepareOutput(command, true, null, true))) + ";\
\n					}\
\n				"));
			}

		// Вывод значения
		} else {
			if (!this.structure.parent) {
				return this.error(("Directive \"output\" can only be used within a " + (templates.join(', '))));
			}

			this.startInlineDir('output');
			if (this.isSimpleOutput()) {
				this.text = true;

				if (isAssign(command)) {
					this.save((("" + (this.prepareOutput(command, true))) + ";"));
					return;
				}

				this.save((("__SNAKESKIN_RESULT__ += " + (this.prepareOutput(command))) + ";"));
			}
		}
	}
);

function isAssign(str) {
	var first = str.charAt(0);

	if (!/[@#$a-z_]/.test(first)) {
		return false;
	}

	var count = 0,
		eq = false;

	var bOpen = {
		'(': true,
		'[': true,
		'{': true
	};

	var bClose = {
		')': true,
		']': true,
		'}': true
	};

	for (var i = 1; i < str.length; i++) {
		var el = str.charAt(i);

		if (bOpen[el]) {
			count++;
			continue;

		} else if (bClose[el]) {
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