Snakeskin.addDirective(
	'block',

	{
		sys: true,
		block: true,
		notEmpty: true,
		placement: 'template',
		group: 'inherit'
	},

	function (command, commandLength) {
		this.startDir(null, {
			name: command
		});

		if (this.isAdvTest()) {
			if (blockCache[this.tplName][command]) {
				return this.error(`block "${command}" is already defined`);
			}

			let start = this.i - this.startTemplateI;

			blockCache[this.tplName][command] = {
				from: start - this.getDiff(commandLength),
				bodyFrom: start + 1,
				needPrfx: this.needPrfx
			};
		}
	},

	function (command, commandLength) {
		if (this.isAdvTest()) {
			let block = blockCache[this.tplName][this.structure.params.name],
				start = this.i - this.startTemplateI;

			block.to = start + 1;
			block.bodyTo = start - this.getDiff(commandLength);

			block.content = this.source
				.substring(this.startTemplateI)
				.substring(block.bodyFrom, block.bodyTo);
		}
	}
);