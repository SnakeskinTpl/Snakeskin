Snakeskin.addDirective(
	'yield',

	{
		placement: 'template'
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(`yield ${this.prepareOutput(command, true)};`);
		}
	}
);