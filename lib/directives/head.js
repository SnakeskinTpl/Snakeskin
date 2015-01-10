Snakeskin.addDirective(
	'head',

	{
		sys: true,
		block: true,
		placement: 'global',
		group: [
			'define',
			'import'
		]
	},

	function () {
		this.startDir();
	}
);
