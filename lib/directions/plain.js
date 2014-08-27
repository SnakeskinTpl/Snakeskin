Snakeskin.addDirective(
	'plain',

	{
		sys: true,
		block: true
	},

	function () {
		this.startDir();

		if (this.typography) {
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