Snakeskin.addDirective(
	'eval',

	{
		sys: true,
		placement: 'global'
	},

	function () {
		this.startDir(null, {
			from: this.res.length
		});
	},

	function () {
		this.res.substring(this.structure.params.from, this.res.length);
	}
);