/**
 * Декларировать аргументы функции callback
 * и вернуть строку декларации
 *
 * @param {(!Array|string)} parts - строка аргументов или массив параметров директивы
 * @return {string}
 */
DirObj.prototype.declCallbackArgs = function (parts) {
	var args = ((Array.isArray(parts) ? (parts[2] || parts[1]) : parts) || '').split(','),
		scope;

	for (let i = 0; i < args.length; i++) {
		let el = args[i].trim(),
			mod = scopeModRgxp.test(el);

		if (mod) {
			if (scope) {
				this.error(`invalid "${this.name}" declaration`);

			} else {
				el = el.replace(scopeModRgxp, '');
			}
		}

		if (el) {
			args[i] = this.declVar(el);

			if (mod) {
				scope = args[i];
			}
		}
	}

	if (scope) {
		this.scope.push(scope);
		this.structure.params._scope = true;
	}

	return args.join(',');
};

Snakeskin.addDirective(
	'callback',

	{
		block: true,
		group: 'callback',
		replacers: {
			'()': (cmd) => cmd.replace(/^\(\)/, 'callback ')
		}
	},

	function (command) {
		var parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			let async = this.getGroup('async');

			let parent = this.structure.parent,
				name = parent.name;

			let prfx = async[name] &&
				parent.children.length > 1 ? ', ' : '';

			this.structure.params.insideAsync = async[name];

			if (async[name]) {
				if (name === 'waterfall') {
					this.save(`
						${prfx}(function (${this.declCallbackArgs(parts)}) {
							${this.deferReturn ? 'if (__RETURN__) { return arguments[arguments.length - 1](false); }' : ''}
					`);

				} else {
					this.save(`
						${prfx}(function (${this.declCallbackArgs(parts)}) {
							${this.deferReturn ? `if (__RETURN__) {
								if (typeof arguments[0] === 'function') {
									return arguments[0](false);
								}

								return false;
							}` : ''}
					`);
				}

			} else {
				this.save(`
					${prfx}(function (${this.declCallbackArgs(parts)}) {
						${this.deferReturn ? 'if (__RETURN__) { return false; }' : ''}
				`);
			}
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			let params = this.structure.params;

			if (params.insideAsync) {
				this.save('})');

			} else {
				this.save('});');
			}
		}
	}
);

Snakeskin.addDirective(
	'final',

	{
		block: true,
		group: 'callback'
	},

	function (command) {
		var async = this.getGroup('series');

		if (!async[this.structure.name]) {
			return this.error(`directive "${this.name}" can be used only with a "${this.structure.name}"`);
		}

		var parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			this.save(`], function (${this.declCallbackArgs(parts)}) {`);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('});');
		}

		this.endDir();
	}
);

var series = ['parallel', 'series', 'waterfall'];

for (let i = 0; i < series.length; i++) {
	Snakeskin.addDirective(
		series[i],

		{
			block: true,

			group: [
				'async',
				'series'
			],

			inside: {
				'callback': true,
				'final': true
			}
		},

		function (command, commandLength, type) {
			this.startDir();
			if (this.isSimpleOutput()) {
				this.save(`async.${type}([`);
			}
		},

		function () {
			if (this.isSimpleOutput()) {
				this.save(']);');
			}
		}
	);
}

var async = ['whilst', 'doWhilst', 'forever'];

for (let i = 0; i < async.length; i++) {
	Snakeskin.addDirective(
		async[i],

		{
			block: true,
			group: 'async',
			inside: {
				'callback': true
			}
		},

		function (command, commandLength, type) {
			this.startDir();
			if (this.isSimpleOutput()) {
				this.save(`async.${type}(`);
			}
		},

		function () {
			if (this.isSimpleOutput()) {
				this.save(');');
			}
		}
	);
}

Snakeskin.addDirective(
	'when',

	{
		block: true,
		notEmpty: true,
		group: 'async',
		inside: {
			'callback': true
		}
	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save(`${command}.then(`);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save(');');
		}
	}
);