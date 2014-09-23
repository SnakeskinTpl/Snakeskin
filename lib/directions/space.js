Snakeskin.addDirective(
	'ignoreWhitespaces',

	{
		placement: 'template',
		replacers: {
			'&': function(cmd)  {return cmd.replace('&', 'ignoreWhitespaces ')}
		}
	},

	function () {
		this.startInlineDir();
		this.space = true;
	}
);

Snakeskin.addDirective(
	'__&__',

	{
		group: 'ignore'
	},

	function () {
		this.startInlineDir();
		this.space = true;
	}
);

Snakeskin.addDirective(
	'ignoreAllWhitespaces',

	{
		placement: 'template',
		replacers: {
			'&+': function(cmd)  {return cmd.replace('&+', 'ignoreAllWhitespaces ')}
		}
	},

	function () {
		this.startInlineDir();
		this.superStrongSpace++;
	}
);

Snakeskin.addDirective(
	'unIgnoreAllWhitespaces',

	{
		placement: 'template',
		replacers: {
			'&-': function(cmd)  {return cmd.replace('&-', 'unIgnoreAllWhitespaces ')}
		}
	},

	function () {
		this.startInlineDir();

		if (this.superStrongSpace) {
			this.superStrongSpace--;
		}

		if (!this.superStrongSpace) {
			this.text = true;
		}
	}
);

Snakeskin.addDirective(
	'ignore',

	{
		placement: 'global'
	},

	function (command) {
		this.startInlineDir();

		var rgxp = '[',
			arr = command.split(' ');

		for (var i = arr.length; i--;) {
			if (arr[i]) {
				if (arr[i].length !== 2 || arr[i].charAt(0) !== '%') {
					return this.error((("invalid \"" + (this.name)) + "\" declaration"));
				}

				rgxp += ("\\" + (arr[i].charAt(1)));
			}
		}

		rgxp += ']';
		this.ignoreRgxp = new RegExp(rgxp);
	}
);