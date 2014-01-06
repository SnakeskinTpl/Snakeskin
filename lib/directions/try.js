var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'try',

	{
		placement: 'template'
	},

	function () {
		var __NEJS_THIS__ = this;
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
		var __NEJS_THIS__ = this;
		if (this.structure.name !== 'try') {
			throw this.error('Directive "' + this.name + '" can only be used with a "try"');
		}

		if (this.isSimpleOutput()) {
			this.save('} catch (' + this.declVar(command) + ') {');
		}
	}
);

Snakeskin.addDirective(
	'finally',

	{
		placement: 'template'
	},

	function () {
		var __NEJS_THIS__ = this;
		if (this.structure.name !== 'try') {
			throw this.error('Directive "' + this.name + '" can only be used with a "try"');
		}

		if (this.isSimpleOutput()) {
			this.save('} finally {');
		}
	}
);
