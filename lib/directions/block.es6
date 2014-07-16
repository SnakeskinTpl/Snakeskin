Snakeskin.addDirective(
	'block',

	{
		sys: true,
		block: true,
		notEmpty: true,
		placement: 'template',
		group: 'inherit'
	},

	function (command) {
		this.startDir(null, {
			name: command
		});

		if (this.isAdvTest()) {
			if (blockCache[this.tplName][command]) {
				return this.error(`block "${command}" is already defined`);
			}

			blockCache[this.tplName][command] = {
				from: this.i - this.startTemplateI + 1,
				needPrfx: this.needPrfx
			};
		}
	},

	function (command, commandLength) {
		if (this.isAdvTest()) {
			let block = blockCache[this.tplName][this.structure.params.name];

			block.to = this.i - this.startTemplateI - this.getDiff(commandLength);
			block.content = this.source
				.substring(this.startTemplateI)
				.substring(block.from, block.to);
		}
	}
);