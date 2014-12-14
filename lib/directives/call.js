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
	'callBlock',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'~=': (cmd) => cmd.replace('~=', 'callBlock ')
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isReady()) {
			let name = this.getFnName(command),
				str;

			if (name === '&') {
				let tmp = this.hasBlock('block', true);

				if (tmp) {
					str = tmp.params.fn + this.prepareOutput(command.replace(name, ''), true);

				} else {
					return this.error(`invalid "${this.name}" declaration`);
				}

			} else {
				str = this.prepareOutput(`__BLOCKS__.${command}`, true);
			}

			this.append(this.wrap(str));
		}
	}
);
