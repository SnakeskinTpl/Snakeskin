Snakeskin.addDirective(
	'call',

	{
		placement: 'template',
		notEmpty: true,
		text: true
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(`__SNAKESKIN_RESULT__ += ${this.prepareOutput(command, true)};`);
		}
	}
);