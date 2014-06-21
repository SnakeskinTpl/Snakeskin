Snakeskin.addDirective(
	'if',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save(`if (${this.prepareOutput(command, true)}) {`);
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
		if (this.structure.name !== 'if') {
			throw this.error(`Directive "${this.name}" can only be used with a "if"`);
		}

		if (this.isSimpleOutput()) {
			this.save(`} else if (${this.prepareOutput(command, true)}) {`);
		}
	}
);

Snakeskin.addDirective(
	'else',

	{
		placement: 'template'
	},

	function () {
		if (this.structure.name !== 'if') {
			throw this.error(`Directive "${this.name}" can only be used with a "if"`);
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
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save(`switch (${this.prepareOutput(command, true)}) {`);
		}
	}
);

Snakeskin.addDirective(
	'case',

	{
		placement: 'template',
		notEmpty: true,
		replacers: {
			'>': (cmd) => cmd.replace(/^>/, 'case '),
			'/>': (cmd) => cmd.replace(/^\/>/, 'end case')
		}
	},

	function (command) {
		if (!this.has('switch')) {
			throw this.error(`Directive "${this.name}" can only be used within a "switch"`);
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			this.save(`case ${this.prepareOutput(command, true)}: {`);
		}
	},

	function () {
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
		if (!this.has('switch')) {
			throw this.error(`Directive "${this.name}" can only be used within a "switch"`);
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('default: {');
		}
	}
);