Snakeskin.addDirective(
	'call',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'^=': (cmd) => cmd.replace('^=', 'call ')
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isReady()) {
			this.append(this.wrap(this.prepareOutput(command, true)));
		}
	}

);
