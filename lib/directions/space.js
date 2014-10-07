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
				'&+': function(cmd)  {return cmd.replace('&+', 'ignoreAllWhitespaces ')}
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
