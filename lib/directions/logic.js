Snakeskin.addDirective(
	'if',

	{
		block: true,
		notEmpty: true
	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save((("if (" + (this.prepareOutput(command, true))) + ") {"));
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);

Snakeskin.addDirective(
	'unless',

	{
		block: true,
		notEmpty: true
	},

	function (command) {
		this.startDir('if');
		if (this.isSimpleOutput()) {
			this.save((("if (!(" + (this.prepareOutput(command, true))) + ")) {"));
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);

Snakeskin.addDirective(
	'elseIf',

	{
		notEmpty: true
	},

	function (command) {
		if (this.structure.name !== 'if') {
			return this.error((("directive \"" + (this.name)) + "\" can be used only with a \"if\""));
		}

		if (this.isSimpleOutput()) {
			this.save((("} else if (" + (this.prepareOutput(command, true))) + ") {"));
		}
	}
);

Snakeskin.addDirective(
	'else',

	{

	},

	function () {
		if (this.structure.name !== 'if') {
			return this.error((("directive \"" + (this.name)) + "\" can be used only with a \"if\""));
		}

		if (this.isSimpleOutput()) {
			this.save('} else {');
		}
	}
);

Snakeskin.addDirective(
	'switch',

	{
		block: true,
		notEmpty: true,
		inside: {
			'case': true,
			'default': true
		}
	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save((("switch (" + (this.prepareOutput(command, true))) + ") {"));
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);

Snakeskin.addDirective(
	'case',

	{
		block: true,
		notEmpty: true,
		replacers: {
			'>': function(cmd)  {return cmd.replace('>', 'case ')},
			'/>': function(cmd)  {return cmd.replace('\/>', 'end case')}
		}
	},

	function (command) {
		this.startDir();

		if (this.structure.parent.name !== 'switch') {
			return this.error((("directive \"" + (this.name)) + "\" can be used only within a \"switch\""));
		}

		if (this.isSimpleOutput()) {
			this.save((("case " + (this.prepareOutput(command, true))) + ": {"));
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
		block: true
	},

	function () {
		this.startDir();

		if (this.structure.parent.name !== 'switch') {
			return this.error((("directive \"" + (this.name)) + "\" can be used only within a \"switch\""));
		}

		if (this.isSimpleOutput()) {
			this.save('default: {');
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);