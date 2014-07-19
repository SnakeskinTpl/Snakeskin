Snakeskin.addDirective(
	'import',

	{
		placement: 'global',
		notEmpty: true
	},

	function (command) {
		var parts = command.split('='),
			obj = parts[0].trim();

		if (parts.length < 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(`
				var ${obj} = __LOCAL__.${obj} = ${this.prepareOutput(`(${parts.slice(1).join('=')})`, true)};
			`);
		}
	}
);