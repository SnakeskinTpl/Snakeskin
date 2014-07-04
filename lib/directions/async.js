/**
 * Декларировать аргументы функции callback
 *
 * @param {(!Array|string)} parts - строка аргументов или массив параметров директивы
 * @return {string}
 */
DirObj.prototype.declCallbackArgs = function (parts) {
	var args = ((Array.isArray(parts) ? (parts[2] || parts[1]) : parts) || '').split(',');

	for (var i = 0; i < args.length; i++) {
		var el = args[i].trim();

		if (el) {
			args[i] = this.declVar(el);
		}
	}

	return args.join(',');
};

Snakeskin.addDirective(
	'callback',

	{
		block: true,
		placement: 'template',
		group: 'callback',
		replacers: {
			'()': function(cmd)  {return cmd.replace(/^\(\)/, 'callback ')}
		}
	},

	function (command) {
		var parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error((("invalid \"" + (this.name)) + ("\" declaration (" + command) + ")"));
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			var async = this.getGroup('async');

			var parent = this.structure.parent,
				name = parent.name;

			var prfx = async[name] &&
				parent.children.length > 1 ? ', ' : '';

			this.structure.params.insideAsync = async[name];

			if (async[name]) {
				if (name === 'waterfall') {
					this.save((("\
\n						" + prfx) + ("(function (" + (this.declCallbackArgs(parts))) + (") {\
\n							" + (this.deferReturn ? 'if (__RETURN__) { return arguments[arguments.length - 1](false); }' : '')) + "\
\n					"));

				} else {
					this.save((("\
\n						" + prfx) + ("(function (" + (this.declCallbackArgs(parts))) + (") {\
\n							" + (this.deferReturn ? ("if (__RETURN__) {\
\n								if (typeof arguments[] === 'function') {\
\n									return arguments[0](false);\
\n								}\
\n\
\n								return false;\
\n							}") : '')) + "\
\n					"));
				}

			} else {
				this.save((("\
\n					" + prfx) + ("(function (" + (this.declCallbackArgs(parts))) + (") {\
\n						" + (this.deferReturn ? 'if (__RETURN__) { return false; }' : '')) + "\
\n				"));
			}
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			var params = this.structure.params;

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
		placement: 'template',
		group: 'callback'
	},

	function (command) {
		var async = this.getGroup('series');

		if (!async[this.structure.name]) {
			return this.error((("directive \"" + (this.name)) + ("\" can only be used with a \"" + (this.structure.name)) + "\""));
		}

		var parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error((("invalid \"" + (this.name)) + ("\" declaration (" + command) + ")"));
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			this.save((("\
\n				], function (" + (this.declCallbackArgs(parts))) + (") {\
\n					" + (this.deferReturn ? 'if (__RETURN__) { return false; }' : '')) + "\
\n			"));
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

for (var i = 0; i < series.length; i++) {
	Snakeskin.addDirective(
		series[i],

		{
			block: true,
			placement: 'template',

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
				this.save((("async." + type) + "(["));
			}
		},

		function () {
			if (this.isSimpleOutput()) {
				this.save(']);');
			}
		}
	);
}

var async = ['whilst', 'doWhilst', 'until', 'doUntil', 'forever'];

for (var i$0 = 0; i$0 < async.length; i$0++) {
	Snakeskin.addDirective(
		async[i$0],

		{
			block: true,
			placement: 'template',
			group: 'async',
			inside: {
				'callback': true
			}
		},

		function (command, commandLength, type) {
			this.startDir();
			if (this.isSimpleOutput()) {
				this.save((("async." + type) + "("));
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
		placement: 'template',
		notEmpty: true,
		group: 'async',
		inside: {
			'callback': true
		}
	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save((("" + command) + ".then("));
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save(');');
		}
	}
);