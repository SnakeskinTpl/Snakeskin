Snakeskin.addDirective(
	'try',

	{
		placement: 'template',
		after: {
			'catch': true,
			'finally': true
		}
	},

	function () {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('try {');
		}
	}
);

Snakeskin.addDirective(
	'catch',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		if (this.structure.name !== 'try') {
			return this.error((("directive \"" + (this.name)) + "\" can only be used with a \"try\""));
		}

		if (this.isSimpleOutput()) {
			this.save((("} catch (" + (this.declVar(command))) + ") {"));
		}
	}
);

Snakeskin.addDirective(
	'finally',

	{
		placement: 'template'
	},

	function () {
		if (this.structure.name !== 'try') {
			return this.error((("directive \"" + (this.name)) + "\" can only be used with a \"try\""));
		}

		if (this.isSimpleOutput()) {
			this.save('} finally {');
		}
	}
);
