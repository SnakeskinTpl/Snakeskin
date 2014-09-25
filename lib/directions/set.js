Snakeskin.addDirective(
	'set',

	{
		notEmpty: true
	},

	function (command) {
		this.startInlineDir();

		if (!this.getGroup('rootTemplate')[this.structure.parent.name]) {
			return this.error((("directive \"" + (this.name)) + "\" can be used only within the top level of template"));
		}

		var parts = command.split(' ');

		if (parts.length < 2) {
			return this.error((("invalid \"" + (this.name)) + "\" declaration"));
		}

		if (parts[0] === '&') {
			this.bemRef = parts.slice(1).join(' ');
		}
	}
);
