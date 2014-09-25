Snakeskin.addDirective(
	'ignoreWhitespaces',

	{
		placement: 'template',
		replacers: {
			'&': (cmd) => cmd.replace('&', 'ignoreWhitespaces ')
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
			'&+': (cmd) => cmd.replace('&+', 'ignoreAllWhitespaces ')
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
			'&-': (cmd) => cmd.replace('&-', 'unIgnoreAllWhitespaces ')
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
