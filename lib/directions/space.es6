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

	Snakeskin.addDirective(
		'ignoreAllWhitespaces',

		{
			placement: 'template',
			replacers: {
				'&+': (cmd) => cmd.replace('&+', 'ignoreAllWhitespaces ')
			}
		},

		function ignoreAllWhitespaces() {
			this.startInlineDir();
			this.superStrongSpace++;
		}
	);

	Snakeskin.addDirective(
		'__&+__',

		{
			group: 'ignore'
		},

		function ignoreAllWhitespaces() {
			this.startInlineDir();
			this.sysSpace++;
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
				this.space = false;
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

			if (this.sysSpace) {
				this.sysSpace--;
			}

			if (!this.sysSpace && !this.space) {
				this.space = false;
			}
		}
	);
})();
