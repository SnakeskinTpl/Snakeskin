Snakeskin.addDirective(
	'throw',

	{
		notEmpty: true
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save((("throw " + (this.prepareOutput(command, true))) + ";"));
		}
	}
);

Snakeskin.addDirective(
	'try',

	{
		block: true,
		after: {
			'catch': true,
			'finally': true,
			'end': true
		}
	},

	function () {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('try {');
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			if (this.structure.params.chain) {
				this.save('}');

			} else {
				this.save('} catch (ignore) {}');
			}
		}
	}
);

Snakeskin.addDirective(
	'catch',

	{
		notEmpty: true
	},

	function (command) {
		if (this.structure.name !== 'try') {
			return this.error((("directive \"" + (this.name)) + "\" can be used only with a \"try\""));
		}

		this.structure.params.chain = true;

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
			return this.error((("directive \"" + (this.name)) + "\" can be used only with a \"try\""));
		}

		this.structure.params.chain = true;

		if (this.isSimpleOutput()) {
			this.save('} finally {');
		}
	}
);