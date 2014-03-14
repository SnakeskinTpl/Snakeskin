var __NEJS_THIS__ = this;
Snakeskin.addDirective(
	'if',

	{
		placement: 'template',
		notEmpty: true
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
		placement: 'template',
		notEmpty: true
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
		notEmpty: true,
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
		placement: 'template',
		notEmpty: true,
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