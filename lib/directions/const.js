var constNameRgxp = /\[(['"`])(.*?)\1]/g;

Snakeskin.addDirective(
	'const',

	{
		group: [
			'inherit',
			'inlineInherit'
		]
	},

	function (command, commandLength, type) {
		var tplName = this.tplName,
			source = (("^[$a-z_" + (!this.scope.length ? L_MOD : '')) + "][$\\w\\[\\].\\s]*=[^=]");

		var rgxp = rgxpCache[source] || new RegExp(source, 'i');
		rgxpCache[source] = rgxp;

		if ((!tplName || rgxp.test(command)) && type !== 'output') {
			if (tplName && type !== 'global') {
				var parts = command.split('=');

				if (!parts[1] || !parts[1].trim()) {
					return this.error(("invalid \"constant\" declaration"));
				}

				var name = this.pasteDangerBlocks(parts[0].trim());

				if (name.charAt(0) === L_MOD) {
					return this.error((("can\'t declare constant \"" + (name.substring(1))) + ("\" with the context modifier (" + L_MOD) + ")"));
				}

				name = name.replace(constNameRgxp, '.$2');
				this.startInlineDir('const', {
					name: name
				});

				if (this.isSimpleOutput()) {
					this.save((!/[.\[]/.test(name) ? 'var ' : '') + this.prepareOutput(command, true, null, true) + ';');
				}

				if (this.isAdvTest()) {
					if (constCache[tplName][name]) {
						return this.error((("constant \"" + name) + "\" is already defined"));
					}

					if (this.varCache[tplName][name]) {
						return this.error((("constant \"" + name) + "\" is already defined as variable"));
					}

					if (sysConst[name]) {
						return this.error((("can't declare constant \"" + name) + "\", try another name"));
					}

					var start = this.i - this.startTemplateI;
					var parent,
						parentTpl = this.parentTplName;

					if (parentTpl) {
						parent = constCache[parentTpl][name];
					}

					constCache[tplName][name] = {
						from: start - commandLength,
						to: start,

						proto: this.protoStart ||
							Boolean(parentTpl && parent && parent.proto),

						needPrfx: this.needPrfx
					};

					if (!this.protoStart) {
						fromConstCache[tplName] = start + 1;
					}
				}

			} else {
				this.startInlineDir('global');

				if (tplName) {
					return this.error((("directive \"" + (this.name)) + "\" can be used only within the global space"));
				}

				if (!isAssign(command, true)) {
					return this.error((("invalid \"" + (this.name)) + "\" declaration"));
				}

				this.save((("\
\n					__VARS__" + ((command.charAt(0) !== '[' ? '.' : '') + this.prepareOutput(command, true, null, true))) + ";\
\n				"));
			}

		} else {
			this.startInlineDir('output');
			this.text = true;

			if (!tplName) {
				return this.error((("Directive \"" + (this.name)) + ("\" can be used only within a " + (groupsList['template'].join(', '))) + ""));
			}

			if (this.isSimpleOutput()) {
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
 * Вернуть true, если в строке идёт присвоение значения переменной или свойству
 *
 * @param {string} str - исходная строка
 * @param {?boolean=} [opt_global=false] - если true, то идёт проверка суперглобальной переменной
 * @return {boolean}
 */
function isAssign(str, opt_global) {
	var source = (("^[" + (G_MOD + L_MOD)) + ("$a-z_" + (opt_global ? '[' : '')) + "]"),
		key = (("" + source) + "[i");

	var rgxp = rgxpCache[key] || new RegExp(source, 'i');
	rgxpCache[key] = rgxp;

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