{
	let declStartRgxp = /^\{+/,
		declEndRgxp = /\}+$/;

	Snakeskin.addDirective(
		'decl',

		{
			placement: 'template',
			notEmpty: true,
			text: true,
			replacers: {
				'{': (cmd) => cmd.replace('{', 'decl ')
			}
		},

		function (command) {
			this.startInlineDir();
			if (this.isReady()) {
				let code = this.replaceTplVars(command);
				let start = declStartRgxp.exec(code) ||
					[''];

				let end = declEndRgxp.exec(code) ||
					[''];

				let add;
				try {
					add = new Array(end[0].length - start[0].length + 1).join('{');

				} catch (ignore) {
					return this.error(`invalid "${this.name}" declaration`);
				}

				this.append(this.wrap(`'{${add + code}}'`));
			}
		}
	);
}
