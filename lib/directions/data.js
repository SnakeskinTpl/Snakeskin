Snakeskin.addDirective(
	'data',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'=': function(cmd)  {return cmd.replace('=', 'data ')}
		}
	},

	function (command) {
		this.startInlineDir();
		this.append(this.wrap((("'" + (this.replaceTplVars(command))) + "'")));
	}
);

var declStartRgxp = /^\{+/,
	declEndRgxp = /\}+$/;

Snakeskin.addDirective(
	'decl',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'{': function(cmd)  {return cmd.replace('{', 'decl ')}
		}
	},

	function (command) {
		this.startInlineDir();

		var code = this.replaceTplVars(command);
		var start = declStartRgxp.exec(code) ||
			[''];

		var end = declEndRgxp.exec(code) ||
			[''];

		var add;
		try {
			add = new Array(end[0].length - start[0].length + 1).join('{');

		} catch (ignore) {
			return this.error((("invalid \"" + (this.name)) + "\" declaration"));
		}

		this.append(this.wrap((("'{" + (add + code)) + "}'")));
	}
);