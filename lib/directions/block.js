Snakeskin.addDirective(
	'block',

	{
		block: true,
		placement: 'template',
		sys: true,
		notEmpty: true,
		group: 'inherit'
	},

	function (command) {
		this.startDir(null, {
			name: command
		});

		if (this.isAdvTest()) {
			if (blockCache[this.tplName][command]) {
				return this.error((("block \"" + command) + "\" is already defined"));
			}

			blockCache[this.tplName][command] = {from: this.i - this.startTemplateI + 1};
		}
	},

	function (command, commandLength) {
		if (this.isAdvTest()) {
			var block = blockCache[this.tplName][this.structure.params.name];

			block.to = this.i - this.startTemplateI - commandLength - 1;
			block.content = this.source
				.substring(this.startTemplateI)
				.substring(block.from, block.to);
		}
	}
);