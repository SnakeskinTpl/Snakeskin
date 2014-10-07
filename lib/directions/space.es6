(() => {
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

	function ignoreAllWhitespaces() {
		this.startInlineDir();
		this.superStrongSpace++;
	}

	Snakeskin.addDirective(
		'ignoreAllWhitespaces',

		{
			placement: 'template',
			replacers: {
				'&+': (cmd) => cmd.replace('&+', 'ignoreAllWhitespaces ')
			}
		},

		ignoreAllWhitespaces
	);

	Snakeskin.addDirective(
		'__&+__',

		{
			group: 'ignore'
		},

		ignoreAllWhitespaces
	);

	function unIgnoreAllWhitespaces() {
		this.startInlineDir();

		if (this.superStrongSpace) {
			this.superStrongSpace--;
		}

		if (!this.superStrongSpace && !this.space) {
			this.space = false;
		}
	}

	Snakeskin.addDirective(
		'unIgnoreAllWhitespaces',

		{
			placement: 'template',
			replacers: {
				'&-': (cmd) => cmd.replace('&-', 'unIgnoreAllWhitespaces ')
			}
		},

		unIgnoreAllWhitespaces
	);

	Snakeskin.addDirective(
		'__&-__',

		{
			group: 'ignore'
		},

		unIgnoreAllWhitespaces
	);
})();
