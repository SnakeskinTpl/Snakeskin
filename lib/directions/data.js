Snakeskin.addDirective(
	'data',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'=': function(cmd)  {return cmd.replace(/^=/, 'data ')}
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(this.wrap((("'" + (this.replaceTplVars(command))) + "'")));
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
			'{': function(cmd)  {return cmd.replace(/^\{/, 'decl ')}
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			var code = this.replaceTplVars(command);

			var start = /^\{+/.exec(code) ||
				[''];

			var end = /\}+$/.exec(code) ||
				[''];

			var add;
			try {
				add = new Array(end[0].length - start[0].length + 1).join('{');

			} catch (ignore) {
				return this.error((("invalid \"" + (this.name)) + "\" declaration"));
			}

			this.save(this.wrap((("'{" + (add + code)) + "}'")));
		}
	}
);