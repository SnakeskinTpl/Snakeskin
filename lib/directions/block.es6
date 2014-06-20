Snakeskin.addDirective(
	'block',

	{
		placement: 'template',
		sys: true,
		notEmpty: true
	},

	function (command) {
		this.startDir(null, {
			name: command
		});

		if (this.isAdvTest()) {
			if (blockCache[this.tplName][command]) {
				throw this.error(`Block "${command}" is already defined`);
			}

			blockCache[this.tplName][command] = {from: this.i - this.startTemplateI + 1};
		}
	},

	function (command, commandLength) {
		if (this.isAdvTest()) {
			let block = blockCache[this.tplName][this.structure.params.name];

			block.to = this.i - this.startTemplateI - commandLength - 1;
			block.content = this.source
				.substring(this.startTemplateI)
				.substring(block.from, block.to);
		}
	}
);