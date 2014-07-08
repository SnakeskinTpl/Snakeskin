Snakeskin.addDirective(
	'yield',

	{
		placement: 'template'
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			if (command) {
				this.save(`yield ${this.prepareOutput(command, true)};`);

			} else {
				this.save(`yield __RESULT__;`);
			}
		}
	}
);