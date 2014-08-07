Snakeskin.addDirective(
	'comment',

	{
		placement: 'template',
		text: true,
		replacers: {
			'#!': (cmd) => cmd.replace('#!', 'comment '),
			'/#': (cmd) => cmd.replace('\/#', 'end comment')
		}
	},

	function (command) {
		this.startDir(null, {
			command: Boolean(command)
		});

		var str = this.wrap('\'<!--\'');

		if (command) {
			str += this.wrap(`'[if ${command}]>'`);
		}

		this.append(str);
	},

	function () {
		this.append(this.wrap(`'${this.structure.params.command ? ' <![endif]' : ''}-->'`));
	}
);