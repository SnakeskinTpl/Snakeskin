Snakeskin.addDirective(
	'plain',

	{
		sys: true,
		placement: 'template',
		block: true,
		selfInclude: false
	},

	function () {
		this.startDir();

		if (this.autoCorrect) {
			this.autoCorrect = false;
			this.structure.params.enabled = true;
		}
	},

	function () {
		if (this.structure.params.enabled) {
			this.autoCorrect = true;
		}
	}
);