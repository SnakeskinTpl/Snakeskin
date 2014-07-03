/**
 * Декларировать аргументы функции callback
 *
 * @param {(!Array|string)} parts - строка аргументов или массив параметров директивы
 * @return {string}
 */
DirObj.prototype.declCallbackArgs = function (parts) {
	var args = ((Array.isArray(parts) ? (parts[2] || parts[1]) : parts) || '').split(',');

	for (let i = 0; i < args.length; i++) {
		let el = args[i].trim();

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
		notEmpty: true,
		group: 'callback',
		replacers: {
			'()': (cmd) => cmd.replace(/^\(\)/, 'callback ')
		}
	},

	function (command) {
		var parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration (${command})`);
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			let async = this.getGroup('async'),
				parent = this.structure.parent;

			let prfx = async[parent.name] &&
				parent.children.length > 1 ? ', ' : '';

			this.structure.params.insideAsync = async[parent.name];
			this.save(`${prfx}(function (${this.declCallbackArgs(parts)}) {`);
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
		placement: 'template',
		notEmpty: true,
		group: 'callback'
	},

	function (command) {
		var async = this.getGroup('async');

		if (!async[this.structure.name]) {
			return this.error(`directive "${this.name}" can only be used with a "${this.structure.name}"`);
		}

		var parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration (${command})`);
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			this.save(`], function (${this.declCallbackArgs(parts)}) {`);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('});');
			this.endDir();
		}
	}
);

Snakeskin.addDirective(
	'parallel',

	{
		block: true,
		placement: 'template',
		group: 'async',
		inside: {
			'callback': true,
			'final': true
		}
	},

	function () {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('async.parallel([');
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save(']);');
		}
	}
);

Snakeskin.addDirective(
	'series',

	{
		block: true,
		placement: 'template',
		group: 'async',
		inside: {
			'callback': true,
			'final': true
		}
	},

	function () {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('async.series([');
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save(']);');
		}
	}
);

Snakeskin.addDirective(
	'waterfall',

	{
		block: true,
		placement: 'template',
		group: 'async',
		inside: {
			'callback': true,
			'final': true
		}
	},

	function () {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('async.waterfall([');
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save(']);');
		}
	}
);

Snakeskin.addDirective(
	'whilst',

	{
		block: true,
		placement: 'template',
		group: 'async',
		inside: {
			'callback': true
		}
	},

	function () {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('async.whilst(');
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save(');');
		}
	}
);