var constNameRgxp = /\[(['"`])(.*?)\1]/g,
	propAssignRgxp = /[.\[]/;

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
			source = `^[\$a-z_${!this.scope.length ? L_MOD : ''}][$\\w\\[\\].\\s]*=[^=]`;

		var rgxp = rgxpCache[source] || new RegExp(source, 'i');
		rgxpCache[source] = rgxp;

		if ((!tplName || rgxp.test(command)) && type !== 'output') {
			if (tplName && type !== 'global') {
				let parts = command.split('='),
					prop = parts[0] && parts[0].trim();

				if (!parts[1] || !parts[1].trim()) {
					return this.error(`invalid "constant" declaration`);
				}

				let name = this.pasteDangerBlocks(prop);

				if (name.charAt(0) === L_MOD) {
					return this.error(`can\'t declare constant "${name.substring(1)}" with the context modifier (${L_MOD})`);
				}

				name = name.replace(constNameRgxp, '.$2');
				this.startInlineDir('const', {
					name: name
				});

				if (this.isReady()) {
					if (!propAssignRgxp.test(prop)) {
						this.consts.push(`var ${prop};`);
					}

					this.append(`${prop} = ${this.prepareOutput(parts.slice(1).join('='), true)};`);
				}

				if (this.isAdvTest()) {
					if (constCache[tplName][name]) {
						return this.error(`constant "${name}" is already defined`);
					}

					if (this.varCache[tplName][name]) {
						return this.error(`constant "${name}" is already defined as variable`);
					}

					if (sysConst[name]) {
						return this.error(`can't declare constant "${name}", try another name`);
					}

					let start = this.i - this.startTemplateI;
					let parent,
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
				let desc = isAssign(command, true);

				if (!desc) {
					return this.error(`invalid "${this.name}" declaration`);
				}

				let mod = G_MOD + G_MOD;

				if (command.charAt(0) !== G_MOD) {
					command = mod + command;

				} else {
					command = command
						.replace(scopeModRgxp, mod);
				}

				this.save(`${this.prepareOutput(command, true)};`);
			}

		} else {
			this.startInlineDir('output');
			this.text = true;

			if (!tplName) {
				return this.error(`Directive "${this.name}" can be used only within a ${groupsList['template'].join(', ')}`);
			}

			if (this.isReady()) {
				let desc = isAssign(command);

				if (desc) {
					this.text = false;
					this.append(`${this.prepareOutput(command, true)};`);
					return;
				}

				this.append(this.wrap(this.prepareOutput(command)));
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
		Snakeskin.Directions['const'].apply(this, arguments);
	}
);

/**
 * Вернуть объект-описание выражения,
 * если в строке идёт присвоение значения переменной или свойству,
 * или false
 *
 * @param {string} str - исходная строка
 * @param {?boolean=} [opt_global=false] - если true, то идёт проверка суперглобальной переменной
 * @return {({key: string, value: string}|boolean)}
 */
function isAssign(str, opt_global) {
	var source = `^[${G_MOD + L_MOD}$a-z_${opt_global ? '[' : ''}]`,
		key = `${source}[i`;

	var rgxp = rgxpCache[key] || new RegExp(source, 'i');
	rgxpCache[key] = rgxp;

	if (!rgxp.test(str)) {
		return false;
	}

	var prop = '';
	var count = 0,
		eq = false;

	for (let i = -1; ++i < str.length;) {
		let el = str.charAt(i);
		prop += el;

		if (bMap[el]) {
			count++;
			continue;

		} else if (closeBMap[el]) {
			count--;
			continue;
		}

		if (el === '=' && !eq && !count && str.charAt(i + 1) !== '=') {
			return {
				key: prop.slice(0, -1),
				value: str.substring(i + 1)
			};
		}

		eq = el === '=';
	}

	return false;
}