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
		this.prevSpace = true;
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
		this.strongSpace++;
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

		if (this.strongSpace) {
			this.strongSpace--;

			if (!this.strongSpace) {
				this.space = false;
			}
		}
	}
);

Snakeskin.addDirective(
	'__&+__',

	{
		group: 'ignore'
	},

	function () {
		this.startInlineDir();
		if (!this.tolerateWhitespace) {
			this.sysSpace = true;
		}
	}
);

Snakeskin.addDirective(
	'__&-__',

	{
		group: 'ignore'
	},

	function () {
		this.startInlineDir();
		if (!this.tolerateWhitespace) {
			this.sysSpace = false;
		}
	}
);

Snakeskin.addDirective(
	'sp',

	{
		text: true
	},

	function () {
		this.startInlineDir();
	}
);
