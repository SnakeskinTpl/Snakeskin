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
		var path = this.prepareOutput(command, true);

		if (path !== void 0) {
			path = String(path);
			this.save(`Snakeskin.include('${this.info['file'] || ''}', ${this.pasteDangerBlocks(path)});`);
		}
	}
);