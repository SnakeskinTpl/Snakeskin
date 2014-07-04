Snakeskin.addDirective(
	'throw',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(`throw ${this.prepareOutput(command, true)};`);
		}
	}
);


Snakeskin.addDirective(
	'try',

	{
		block: true,
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
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);

Snakeskin.addDirective(
	'catch',

	{
		placement: 'template',
		notEmpty: true,
		after: {
			'finally': true,
			'end': true
		}
	},

	function (command) {
		if (this.structure.name !== 'try') {
			return this.error(`directive "${this.name}" can only be used with a "try"`);
		}

		this.toQueue(() => {
			Snakeskin.Directions['end']({
				ctx: this,
				name: 'catch'
			});

			this.startDir();
			if (this.isSimpleOutput()) {
				this.save(` catch (${this.declVar(command)}) {`);
			}
		});
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);

Snakeskin.addDirective(
	'finally',

	{
		placement: 'template'
	},

	function () {
		if (!{'try': true, 'catch': true}[this.structure.name]) {
			return this.error(`directive "${this.name}" can only be used with a "try"`);
		}

		this.toQueue(() => {
			Snakeskin.Directions['end']({
				ctx: this,
				name: 'finally'
			});

			this.startDir();
			if (this.isSimpleOutput()) {
				this.save(' finally {');
			}
		});
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);