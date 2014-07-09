Snakeskin.addDirective(
	'for',

	{
		block: true,
		notEmpty: true,
		group: 'cycle'
	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			let parts = command.split(';');

			if (parts.length !== 3) {
				return this.error(`invalid "${this.name}" declaration`);
			}

			let varDeclRgxp = /var /;
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
			if (this.isSimpleOutput()) {
				this.save(`} while (${this.prepareOutput(command, true)});`);
			}

			this.toQueue(() => {
				Snakeskin.Directions['end']({
					ctx: this,
					name: 'while'
				});
			});

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
			'while': true
		}
	},

	function () {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('do {');
		}
	},

	function () {}
);

Snakeskin.addDirective(
	'repeat',

	{
		block: true,
		group: 'cycle',
		after: {
			'until': true
		}
	},

	function () {
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('do {');
		}
	},

	function () {}
);

Snakeskin.addDirective(
	'until',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		if (this.structure.name !== 'repeat') {
			return this.error(`directive "${this.name}" can only be used with a "repeat"`);
		}

		if (this.isSimpleOutput()) {
			this.save(`} while (${this.prepareOutput(command, true)});`);
		}

		this.toQueue(() => {
			Snakeskin.Directions['end']({
				ctx: this,
				name: 'until'
			});
		});
	}
);