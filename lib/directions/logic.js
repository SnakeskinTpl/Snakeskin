var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'if',

	{
		placement: 'template'
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!command) {
			throw this.error('Invalid syntax');
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('if (' + this.prepareOutput(command, true) + ') {');
		}
	}
);

Snakeskin.addDirective(
	'elseIf',

	{
		placement: 'template'
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!command) {
			throw this.error('Invalid syntax');
		}

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
		placement: 'template'
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
		placement: 'template',
		strongDirs: {
			'case': true,
			'default': true
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!command) {
			throw this.error('Invalid syntax');
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('switch (' + this.prepareOutput(command, true) + ') {');
		}
	}
);

Snakeskin.addDirective(
	'case',

	{
		placement: 'template',
		replacers: {
			'>': function (cmd) {
				return cmd.replace(/^>/, 'case ');},
			'/>': function (cmd) {
				return cmd.replace(/^\/>/, 'end case');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!command) {
			throw this.error('Invalid syntax');
		}

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
		placement: 'template'
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