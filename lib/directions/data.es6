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

			for (let i = 0; i < parts.length; i++) {
				let arg = parts[i].split('=>');

				if (arg.length !== 2) {
					return this.error(`invalid "${this.name}" declaration`);
				}

				this.save('__STR__ = \'\';');
				arg[0] = arg[0].charAt(0) === '-' ?
					`'data-' + ${arg[0].slice(1)}` : arg[0];

				let vals = arg[1].split(','),
					str = '';

				for (let j = 0; j < vals.length; j++) {
					let val = this.prepareOutput(vals[j], true) || '';

					str += `
						if (${val}) {
							__STR__ += ' ' + ${val};
						}
					`;
				}

				this.save(`
					${str}

					if (__STR__) {
						${this.wrap(`' ' + ${arg[0]} + ' = "' + __STR__ + '"'`)}
					}
				`);
			}
		}
	}
);