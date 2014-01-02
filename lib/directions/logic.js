var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'if',

	{
		inBlock: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('if (' + this.prepareOutput(command, true) + ') {');
		}
	}
);

Snakeskin.addDirective(
	'elseIf',

	{
		inBlock: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (this.structure.name !== 'if') {
			throw this.error('Directive "' + this.name + '" can only be used with a "if"');
		}

		if (this.isSimpleOutput()) {
			this.save('} else if (' + this.prepareOutput(command, true) + ') {');
		}
	}
);

Snakeskin.addDirective(
	'else',

	{
		inBlock: true
	},

	function () {
		var __NEJS_THIS__ = this;
		if (this.structure.name !== 'if') {
			throw this.error('Directive "' + this.name + '" can only be used with a "if"');
		}

		if (this.isSimpleOutput()) {
			this.save('} else {');
		}
	}
);

Snakeskin.addDirective(
	'switch',

	{
		inBlock: true,
		strongDirs: {
			'case': true,
			'default': true
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('switch (' + this.prepareOutput(command, true) + ') {');
		}
	}
);

Snakeskin.addDirective(
	'case',

	{
		inBlock: true,
		replacers: {
			'>': function (cmd) {
				return cmd.replace(/^>/, 'case ');},
			'/>': function (cmd) {
				return cmd.replace(/^\/>/, 'end case');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!this.has('switch')) {
			throw this.error('Directive "' + this.name + '" can only be used within a "switch"');
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('case ' + this.prepareOutput(command, true) + ': {');
		}
	},

	function () {
		var __NEJS_THIS__ = this;
		if (this.isSimpleOutput()) {
			this.save('} break;');
		}
	}
);

Snakeskin.addDirective(
	'default',

	{
		inBlock: true
	},

	function () {
		var __NEJS_THIS__ = this;
		if (!this.has('switch')) {
			throw this.error('Directive "' + this.name + '" can only be used within a "switch"');
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('default: {');
		}
	}
);