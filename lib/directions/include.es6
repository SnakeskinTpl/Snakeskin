Snakeskin.addDirective(
	'include',

	{
		notEmpty: true
	},

	function (command) {
		if (!IS_NODE) {
			return;
		}

		this.startInlineDir();
		this.save(`Snakeskin.include('${this.info['file'] || ''}', ${this.pasteDangerBlocks(this.prepareOutput(command, true))});`);
	}
);