var varDeclRgxp = /\bvar\b/,
	splitDeclRgxp = /;/,
	forRgxp = /\s*(var|)\s+(.*?)\s+(in|of)\s+(.*)/;

Snakeskin.addDirective(
	'for',

	{
		block: true,
		notEmpty: true,
		group: 'cycle'
	},

	function (command) {
		this.startDir();

		if (splitDeclRgxp.test(command)) {
			var parts = command.split(';');

			if (parts.length !== 3) {
				return this.error((("invalid \"" + (this.name)) + "\" declaration"));
			}

			if (this.isSimpleOutput()) {
				var decl = varDeclRgxp.test(parts[0]) ?
					this.multiDeclVar(parts[0].replace(varDeclRgxp, '')) : this.prepareOutput(parts[0], true);

				parts[1] = parts[1] && (("(" + (parts[1])) + ")");
				parts[2] = parts[2] && (("(" + (parts[2])) + ")");

				this.save((("for (" + (decl + this.prepareOutput(parts.slice(1).join(';'), true))) + ") {"));
			}

		} else {
			var parts$0 = forRgxp.exec(command);

			if (!parts$0) {
				return this.error((("invalid \"" + (this.name)) + "\" declaration"));
			}

			if (this.isSimpleOutput()) {
				var decl$0 = parts$0[1] ?
					this.multiDeclVar(parts$0[2], false, '') : this.prepareOutput(parts$0[2], true);

				this.save((("for (" + decl$0) + (" " + (parts$0[3])) + (" " + (this.prepareOutput(parts$0[4], true))) + ") {"));
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
				this.save((("} while (" + (this.prepareOutput(command, true))) + ");"));
			}

			Snakeskin.Directions['end'].call(this);

		} else {
			this.startDir();
			if (this.isSimpleOutput()) {
				this.save((("while (" + (this.prepareOutput(command, true))) + ") {"));
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
			return this.error((("directive \"" + (this.name)) + "\" can be used only with a \"repeat\""));
		}

		this.structure.params.chain = true;

		if (this.isSimpleOutput()) {
			this.save((("} while (" + (this.prepareOutput(command, true))) + ");"));
		}

		Snakeskin.Directions['end'].call(this);
	}
);