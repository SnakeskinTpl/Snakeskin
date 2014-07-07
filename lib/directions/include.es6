Snakeskin.addDirective(
	'include',

	{
		notEmpty: true
	},

	function (command) {
		if (this.tplName) {
			return this.error(`directive "${this.name}" can't be used within a ${groupsList['template'].join(', ')}`);
		}

		this.startInlineDir();
		this.save(`Snakeskin.include('${this.info['file'] || ''}', ${this.pasteDangerBlocks(this.prepareOutput(command, true))});`);
	}
);