Snakeskin.addDirective(
	'if',

	{
		block: true,
		notEmpty: true
	},

	function (command) {
		this.startDir();
		this.append((("if (" + (this.prepareOutput(command, true))) + ") {"));
	},

	function () {
		this.append('}');
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
		this.append((("if (!(" + (this.prepareOutput(command, true))) + ")) {"));
	},

	function () {
		this.append('}');
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

		this.append((("} else if (" + (this.prepareOutput(command, true))) + ") {"));
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

		this.append('} else {');
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
		this.append((("switch (" + (this.prepareOutput(command, true))) + ") {"));
	},

	function () {
		this.append('}');
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

		this.append((("case " + (this.prepareOutput(command, true))) + ": {"));
	},

	function () {
		this.append('} break;');
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

		this.append('default: {');
	},

	function () {
		this.append('}');
	}
);