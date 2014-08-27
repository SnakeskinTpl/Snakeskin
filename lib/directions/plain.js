Snakeskin.addDirective(
	'plain',

	{
		sys: true,
		block: true
	},

	function () {
		this.startDir();
		this.ignoreTypography = true;
	},

	function () {
		this.ignoreTypography = false;
	}
);