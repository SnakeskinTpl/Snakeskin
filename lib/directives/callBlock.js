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
			let str;
			const
				name = this.getFnName(command);

			if (name === '&') {
				const block = this.hasBlock('block', true);

				if (block) {
					str = block.params.fn + this.prepareOutput(command.replace(name, ''), true);

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
