var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'block',

	{
		placement: 'template',
		sys: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!command) {
			throw this.error('Invalid syntax');
		}

		this.startDir(null, {
			name: command
		});

		if (this.isAdvTest()) {
			if (blockCache[this.tplName][command]) {
				throw this.error('Block "' + command + '" is already defined');
			}

			blockCache[this.tplName][command] = {from: this.i - this.startI + 1};
		}
	},

	function (command, commandLength) {
		var __NEJS_THIS__ = this;
		if (this.isAdvTest()) {
			var block = blockCache[this.tplName][this.structure.params.name];

			block.to = this.i - this.startI - commandLength - 1;
			block.body = this.source
				.substring(this.startI)
				.substring(block.from, block.to);
		}
	}
);