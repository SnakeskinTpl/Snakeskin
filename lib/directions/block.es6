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
		var start = this.i - this.startTemplateI;

		this.startDir(null, {
			name: command,
			from: start + 1
		});

		if (this.isAdvTest()) {
			if (blockCache[this.tplName][command]) {
				return this.error(`block "${command}" is already defined`);
			}

			blockCache[this.tplName][command] = {
				from: start - this.getDiff(commandLength),
				needPrfx: this.needPrfx
			};
		}
	},

	function (command, commandLength) {
		if (this.isAdvTest()) {
			let block = blockCache[this.tplName][this.structure.params.name],
				start = this.i - this.startTemplateI;

			block.to = start + 1;
			block.content = this.source
				.substring(this.startTemplateI)
				.substring(this.structure.params.from, start - this.getDiff(commandLength));
		}
	}
);