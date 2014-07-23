Snakeskin.addDirective(
	'comment',

	{
		placement: 'template',
		text: true,
		replacers: {
			'/!': function(cmd)  {return cmd.replace('/!', 'comment ')}
		}
	},

	function (command) {
		this.startDir(null, {
			command: Boolean(command)
		});

		if (this.isSimpleOutput()) {
			this.save(this.wrap('\'<!--\''));

			if (command) {
				this.save(this.wrap((("'[if " + command) + "]>'")));
			}
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save(this.wrap((("'" + (this.structure.params.command ? ' <![endif]' : '')) + "-->'")));
		}
	}
);