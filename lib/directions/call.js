var __NEJS_THIS__ = this;
Snakeskin.addDirective(
	'call',

	{
		placement: 'template',
		notEmpty: true,
		text: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save('__SNAKESKIN_RESULT__ += ' + this.prepareOutput(command, true) + ';');
		}
	}
);