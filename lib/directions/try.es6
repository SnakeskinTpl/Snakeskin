Snakeskin.addDirective(
	'throw',

	{
		notEmpty: true
	},

	function (command) {
		this.startInlineDir();
		if (this.isReady()) {
			this.append(`throw ${this.prepareOutput(command, true)};`);
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
		this.append('try {');
	},

	function () {
		if (this.structure.params.chain) {
			this.append('}');

		} else {
			this.append('} catch (ignore) {}');
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
			return this.error(`directive "${this.name}" can be used only with a "try"`);
		}

		this.structure.params.chain = true;

		if (this.isReady()) {
			this.append(`} catch (${this.declVar(command)}) {`);
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
			return this.error(`directive "${this.name}" can be used only with a "try"`);
		}

		this.structure.params.chain = true;
		this.append('} finally {');
	}
);