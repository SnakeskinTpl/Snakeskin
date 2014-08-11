Snakeskin.addDirective(
	'include',

	{
		notEmpty: true
	},

	function (command) {
		if (this.tplName) {
			return this.error(`directive "${this.name}" can't be used within a ${groupsList['template'].join(', ')}`);
		}

		this.startInlineDir(null, {
			from: this.res.length
		});

		var path = this.prepareOutput(command, true);

		if (path !== void 0) {
			path = this.pasteDangerBlocks(String(path));
			this.save(`Snakeskin._include('${applyDefEscape(this.info['file'] || '')}', ${path});`);
		}
	},

	function () {
		if (this.hasParent('eval')) {
			return;
		}

		this.res = this.res.substring(0, this.structure.params.from);
	}
);