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

		if (this.autoReplace) {
			this.autoReplace = false;
			this.structure.params.enabled = true;
		}
	},

	function () {
		if (this.structure.params.enabled) {
			this.autoReplace = true;
		}
	}
);
