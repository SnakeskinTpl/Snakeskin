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

	Snakeskin.addDirective(
		'__&-__',

		{
			group: 'ignore'
		},

		function () {
			this.startInlineDir();

			if (this.superStrongSpace) {
				this.superStrongSpace--;
			}
		}
	);
})();
