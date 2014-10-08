(function()  {
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
			this.prevSpace = true;
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
		'__&+__',

		{
			group: 'ignore'
		},

		function () {
			this.startInlineDir();
			this.sysSpace++;
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

				if (!this.superStrongSpace) {
					this.space = false;
				}
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

				if (!this.sysSpace && !this.space) {
					this.space = false;
				}
			}
		}
	);
})();
