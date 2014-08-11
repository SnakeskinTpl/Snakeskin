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

	for (var i = -1; ++i < args.length;) {
		var el = args[i].trim(),
			mod = scopeModRgxp.test(el);

		if (mod) {
			if (scope) {
				this.error((("invalid \"" + (this.name)) + "\" declaration"));

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
			'()': function(cmd)  {return cmd.replace('()', 'callback ')}
		}
	},

	function (command) {
		var parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error((("invalid \"" + (this.name)) + "\" declaration"));
		}

		this.startDir();
		if (this.isReady()) {
			var async = this.getGroup('async');
			var parent = this.structure.parent,
				name = parent.name;

			var prfx = async[name] &&
				parent.children.length > 1 ? ', ' : '';

			this.structure.params.insideAsync = async[name];

			if (async[name]) {
				if (name === 'waterfall') {
					this.append((("\
\n						" + prfx) + ("(function (" + (this.declCallbackArgs(parts))) + (") {\
\n							" + (this.deferReturn ? 'if (__RETURN__) { return arguments[arguments.length - 1](false); }' : '')) + "\
\n					"));

				} else {
					this.append((("\
\n						" + prfx) + ("(function (" + (this.declCallbackArgs(parts))) + (") {\
\n							" + (this.deferReturn ? ("if (__RETURN__) {\
\n								if (typeof arguments[0] === 'function') {\
\n									return arguments[0](false);\
\n								}\
\n\
\n								return false;\
\n							}") : '')) + "\
\n					"));
				}

			} else {
				this.append((("\
\n					" + prfx) + ("(function (" + (this.declCallbackArgs(parts))) + (") {\
\n						" + (this.deferReturn ? 'if (__RETURN__) { return false; }' : '')) + "\
\n				"));
			}
		}
	},

	function () {
		this.append('})' + (this.structure.params.insideAsync ? '' : ';'));
	}
);

Snakeskin.addDirective(
	'final',

	{
		block: true,
		group: 'callback',
		chain: [
			'parallel',
			'series',
			'waterfall'
		]
	},

	function (command) {
		var async = this.getGroup('series');

		if (!async[this.structure.name]) {
			return this.error((("directive \"" + (this.name)) + ("\" can be used only with a \"" + (groupsList['series'].join(', '))) + "\""));
		}

		var parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error((("invalid \"" + (this.name)) + "\" declaration"));
		}

		this.startDir();
		if (this.isReady()) {
			this.append((("], function (" + (this.declCallbackArgs(parts))) + ") {"));
		}
	},

	function () {
		this.append('});');
		this.endDir();
	}
);

var series = ['parallel', 'series', 'waterfall'];

for (var i = -1; ++i < series.length;) {
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
			this.append((("async." + type) + "(["));
		},

		function () {
			this.append(']);');
		}
	);
}

var async = ['whilst', 'doWhilst', 'forever'];

for (var i$0 = -1; ++i$0 < async.length;) {
	Snakeskin.addDirective(
		async[i$0],

		{
			block: true,
			group: 'async',
			inside: {
				'callback': true
			}
		},

		function (command, commandLength, type) {
			this.startDir();
			this.append((("async." + type) + "("));
		},

		function () {
			this.append(');');
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
		this.append((("" + command) + ".then("));
	},

	function () {
		this.append(');');
	}
);