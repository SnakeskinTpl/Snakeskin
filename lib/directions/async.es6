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

	for (let i = -1; ++i < args.length;) {
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
			'()': (cmd) => cmd.replace('()', 'callback ')
		}
	},

	function (command) {
		var parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startDir();
		if (this.isReady()) {
			let async = this.getGroup('async'),
				parent = this.structure.parent;

			this.structure.params.insideAsync = async[parent.name];
			var children = parent.children,
				length = 0;

			for (let i = -1; ++i < children.length;) {
				if (children[i].name === 'callback') {
					length++;
				}

				if (length > 1) {
					break;
				}
			}

			this.append(`
				${async[parent.name] && length > 1 ? ', ' : ''}(function (${this.declCallbackArgs(parts)}) {
			`);
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

		group: [
			'callback',
			'asyncPart'
		],

		chain: [
			'parallel',
			'series',
			'waterfall'
		]
	},

	function (command) {
		var async = this.getGroup('series');

		if (!async[this.structure.name]) {
			return this.error(`directive "${this.name}" can be used only with a "${groupsList['series'].join(', ')}"`);
		}

		var parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startDir();
		if (this.isReady()) {
			this.append(`], function (${this.declCallbackArgs(parts)}) {`);
		}
	},

	function () {
		this.append('});');
		this.endDir();
	}
);

var series = ['parallel', 'series', 'waterfall'];

for (let i = -1; ++i < series.length;) {
	Snakeskin.addDirective(
		series[i],

		{
			block: true,

			group: [
				'async',
				'Async',
				'series'
			],

			inside: {
				'callback': true,
				'final': true
			}
		},

		function (command, commandLength, type) {
			this.startDir();
			this.append(`async.${type}([`);
		},

		function () {
			this.append(']);');
		}
	);
}

var async = ['whilst', 'doWhilst', 'forever'];

for (let i = -1; ++i < async.length;) {
	Snakeskin.addDirective(
		async[i],

		{
			block: true,

			group: [
				'async',
				'Async'
			],

			inside: {
				'callback': true
			}
		},

		function (command, commandLength, type) {
			this.startDir();
			this.append(`async.${type}(`);
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

		group: [
			'async',
			'asyncPart'
		],

		inside: {
			'callback': true
		}
	},

	function (command) {
		this.startDir();
		this.append(`${this.prepareOutput(command, true)}.then(`);
	},

	function () {
		this.append(');');
	}
);