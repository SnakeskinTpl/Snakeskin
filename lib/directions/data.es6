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
				return this.error(`invalid "${this.name}" declaration (${command})`);
			}

			this.save(this.wrap(`'{${add + code}}'`));
		}
	}
);

Snakeskin.addDirective(
	'attr',

	{
		placement: 'template',
		notEmpty: true,
		text: true
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			let parts = command.split(';');
			let exec = (parts) => {
				parts[0] = parts[0].charAt(0) === '-' ?
					`'data-' + ${parts[0].slice(1)}` : parts[0];

				parts[1] = this.prepareOutput(parts[1], true) || '';
			};

			for (let i = 0; i < parts.length; i++) {
				let arg = parts[i].split('=>');

				if (arg.length !== 2) {
					return this.error(`invalid "${this.name}" declaration (${command}, ${parts[i]})`);
				}

				for (let j = 0; j < arg.length; j++) {
					exec(arg);

					this.save(`
						if (${arg[1]}) {
							${this.wrap(`' ' + ${arg[0]} + ' = "' + (${arg[1]}) + '"'`)}
						}
					`);
				}
			}
		}
	}
);