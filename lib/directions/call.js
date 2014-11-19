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

Snakeskin.addDirective(
	'callBlocks',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'~=': (cmd) => cmd.replace('~=', 'callBlocks ')
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isReady()) {
			this.append(this.wrap(this.prepareOutput(`__BLOCKS__.${command}`, true)));
		}
	}
);
