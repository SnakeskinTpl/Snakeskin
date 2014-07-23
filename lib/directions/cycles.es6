var varDeclRgxp = /\bvar\b/;

Snakeskin.addDirective(
	'for',

	{
		block: true,
		notEmpty: true,
		group: 'cycle'
	},

	function (command) {
		var parts = command.split(';');

		if (parts.length !== 3) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			let decl = varDeclRgxp.test(parts[0]) ?
				this.multiDeclVar(parts[0].replace(varDeclRgxp, '')) : this.prepareOutput(parts[0], true);

			this.save(`for (${decl + this.prepareOutput(parts.slice(1).join(';'), true)}) {`);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);

Snakeskin.addDirective(
	'while',

	{
		block: true,
		notEmpty: true,
		group: 'cycle'
	},

	function (command) {
		if (this.structure.name == 'do') {
			this.structure.params.chain = true;

			if (this.isSimpleOutput()) {
				this.save(`} while (${this.prepareOutput(command, true)});`);
			}

			Snakeskin.Directions['end'].call(this);

		} else {
			this.startDir();
			if (this.isSimpleOutput()) {
				this.save(`while (${this.prepareOutput(command, true)}) {`);
			}
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);

Snakeskin.addDirective(
	'do',

	{
		block: true,
		group: 'cycle',
		after: {
			'while': true,
			'end': true
		}
	},

	function () {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('do {');
		}
	},

	function () {
		if (this.isSimpleOutput() && !this.structure.params.chain) {
			this.save('} while (true);');
		}
	}
);

Snakeskin.addDirective(
	'repeat',

	{
		block: true,
		group: 'cycle',
		after: {
			'until': true,
			'end': true
		}
	},

	function () {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('do {');
		}
	},

	function () {
		if (this.isSimpleOutput() && !this.structure.params.chain) {
			this.save('} while (true);');
		}
	}
);

Snakeskin.addDirective(
	'until',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		if (this.structure.name !== 'repeat') {
			return this.error(`directive "${this.name}" can be used only with a "repeat"`);
		}

		this.structure.params.chain = true;

		if (this.isSimpleOutput()) {
			this.save(`} while (${this.prepareOutput(command, true)});`);
		}

		Snakeskin.Directions['end'].call(this);
	}
);