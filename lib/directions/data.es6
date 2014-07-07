Snakeskin.addDirective(
	'data',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'=': (cmd) => cmd.replace(/^=/, 'data ')
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(this.wrap(`'${this.replaceTplVars(command)}'`));
		}
	}
);

Snakeskin.addDirective(
	'decl',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'{': (cmd) => cmd.replace(/^\{/, 'decl ')
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			let code = this.replaceTplVars(command);

			let start = /^\{+/.exec(code) ||
				[''];

			let end = /\}+$/.exec(code) ||
				[''];

			let add;
			try {
				add = new Array(end[0].length - start[0].length + 1).join('{');

			} catch (ignore) {
				return this.error(`invalid "${this.name}" declaration`);
			}

			this.save(this.wrap(`'{${add + code}}'`));
		}
	}
);