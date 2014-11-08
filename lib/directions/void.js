Snakeskin.addDirective(
	'void',

	{
		notEmpty: true,
		replacers: {
			'?': (cmd) => cmd.replace('?', 'void ')
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isReady()) {
			this.append(`${this.prepareOutput(command, true)};`);
		}
	}
);
