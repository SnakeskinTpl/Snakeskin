Snakeskin.addDirective(
	'for',

	{
		block: true,
		placement: 'template',
		notEmpty: true,
		group: 'cycle'
	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			var parts = command.split(';');

			if (parts.length !== 3) {
				return this.error((("invalid \"" + (this.name)) + ("\" declaration (" + command) + ")"));
			}

			var varDeclRgxp = /var /;
			var decl = varDeclRgxp.test(parts[0]) ?
				this.multiDeclVar(parts[0].replace(varDeclRgxp, '')) : this.prepareOutput(parts[0], true);

			this.save((("for (" + (decl + this.prepareOutput(parts.slice(1).join(';'), true))) + ") {"));
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
		placement: 'template',
		notEmpty: true,
		group: 'cycle'
	},

	function (command) {var this$0 = this;
		if (this.structure.name == 'do') {
			if (this.isSimpleOutput()) {
				this.save((("} while (" + (this.prepareOutput(command, true))) + ");"));
			}

			this.toQueue(function()  {
				Snakeskin.Directions['end']({
					ctx: this$0,
					name: 'while'
				});
			});

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
	'repeat',

	{
		block: true,
		placement: 'template',
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
	'do',

	{
		block: true,
		placement: 'template',
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
	'until',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {var this$0 = this;
		if (this.structure.name !== 'repeat') {
			return this.error((("directive \"" + (this.name)) + "\" can only be used with a \"repeat\""));
		}

		if (this.isSimpleOutput()) {
			this.save((("} while (" + (this.prepareOutput(command, true))) + ");"));
		}

		this.toQueue(function()  {
			Snakeskin.Directions['end']({
				ctx: this$0,
				name: 'until'
			});
		});
	}
);

Snakeskin.addDirective(
	'break',

	{
		placement: 'template'
	},

	function () {
		this.startInlineDir();

		var parent = this.hasParent({
			'repeat': true,
			'while': true,
			'do': true,
			'$forEach': true,
			'forEach': true,
			'forIn': true
		});

		if (!parent) {
			return this.error((("directive \"" + (this.name)) + "\" can only be used with a cycles"));
		}

		if (this.isSimpleOutput()) {
			if (parent === '$forEach') {
				this.save('return false;');

			} else {
				this.save('break;');
			}

			this.space = true;
		}
	}
);

Snakeskin.addDirective(
	'continue',

	{
		placement: 'template'
	},

	function () {
		this.startInlineDir();

		var parent = this.hasParent({
			'repeat': true,
			'while': true,
			'do': true,
			'$forEach': true,
			'forEach': true,
			'forIn': true
		});

		if (!parent) {
			return this.error((("directive \"" + (this.name)) + "\" can only be used with a cycles"));
		}

		if (this.isSimpleOutput()) {
			if (parent === '$forEach') {
				this.save('return;');

			} else {
				this.save('continue;');
			}

			this.space = true;
		}
	}
);