Snakeskin.addDirective(
	'comment',

	{
		placement: 'template',
		text: true,
		replacers: {
			'#!': function(cmd)  {return cmd.replace('#!', 'comment ')},
			'/#': function(cmd)  {return cmd.replace('\/#', 'end comment')}
		}
	},

	function (command) {
		this.startDir(null, {
			command: Boolean(command)
		});

		if (this.renderMode === 'dom') {
			return this.error((("directive \"" + (this.name)) + "\" can't be used with a \"dom\" render mode"));
		}

		var str = this.wrap('\'<!--\'');

		if (command) {
			str += this.wrap((("'[if " + (this.replaceTplVars(command))) + "]>'"));
		}

		this.append(str);
	},

	function () {
		this.append(this.wrap((("'" + (this.structure.params.command ? ' <![endif]' : '')) + "-->'")));
	}
);