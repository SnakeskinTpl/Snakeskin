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
				var str = this.wrap('\'[if \'');
				str += this.wrap(this.prepareOutput(command));
				str += this.wrap('\']>\'');
				this.save(str);
			}
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save(this.wrap((("'" + (this.structure.params.command ? ' <![endif]' : '')) + "-->'")));
		}
	}
);