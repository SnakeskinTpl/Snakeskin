(() => {
	var voidRgxp = /(?:^|\s+)(?:var|const|let) /;

	Snakeskin.addDirective(
		'void',

		{
			notEmpty: true,
			replacers: {
				'?': (cmd) => cmd.replace('?', 'void ')
			}
		},

		function (command) {
			if (voidRgxp.test(command)) {
				return this.error('can\'t declare variables within "void"');
			}

			this.startInlineDir();
			if (this.isReady()) {
				this.append(`${this.prepareOutput(command, true)};`);
			}
		}
	);
})();