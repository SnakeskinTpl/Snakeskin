var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'for',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			var parts = command.split(';');

			if (parts.length !== 3) {
				throw this.error('Invalid syntax');
			}

			var rgxp = /var /;
			this.save('for (' +
				(rgxp.test(parts[0]) ?
					this.multiDeclVar(parts[0].replace(rgxp, '')) :
					this.prepareOutput(parts[0], true)
				) +
				this.prepareOutput(parts.slice(1).join(';'), true) +
			') {');
		}
	}
);

Snakeskin.addDirective(
	'while',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (this.structure.name == 'do') {
			if (this.isSimpleOutput()) {
				this.save('} while (' + this.prepareOutput(command, true) + ');');
			}

			Snakeskin.Directions['end'](this);

		} else {
			this.startDir();
			if (this.isSimpleOutput()) {
				this.save('while (' + this.prepareOutput(command, true) + ') {');
			}
		}
	}
);

Snakeskin.addDirective(
	'repeat',

	{
		placement: 'template',
		sys: true
	},

	function () {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('do {');
		}
	}
);

Snakeskin.addDirective(
	'do',

	{
		placement: 'template',
		sys: true
	},

	function () {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('do {');
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
		var __NEJS_THIS__ = this;
		if (this.structure.name !== 'repeat') {
			throw this.error('Directive "' + this.name + '" can only be used with a "repeat"');
		}

		if (this.isSimpleOutput()) {
			this.save('} while (' + this.prepareOutput(command, true) + ');');
		}

		Snakeskin.Directions['end'](this);
	}
);

Snakeskin.addDirective(
	'break',

	{
		placement: 'template'
	},

	function () {
		var __NEJS_THIS__ = this;
		this.startInlineDir();

		if (!this.hasParent({
			'repeat': true,
			'while': true,
			'do': true,
			'forEach': true,
			'forIn': true
		})) {
			throw this.error('Directive "' + this.name + '" can only be used with a cycles');
		}

		if (this.isSimpleOutput()) {
			this.save('break;');
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
		var __NEJS_THIS__ = this;
		this.startInlineDir();

		if (!this.hasParent({
			'repeat': true,
			'while': true,
			'do': true,
			'forEach': true,
			'forIn': true
		})) {
			throw this.error('Directive "' + this.name + '" can only be used with a cycles');
		}

		if (this.isSimpleOutput()) {
			this.save('continue;');
			this.space = true;
		}
	}
);