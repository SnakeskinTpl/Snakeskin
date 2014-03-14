Snakeskin.addDirective(
	'void',

	{
		placement: 'template',
		notEmpty: true,
		replacers: {
			'?': (cmd) => cmd.replace(/^\?/, 'void ')
		}
	},

	function (command) {
		if (/(?:^|\s+)(?:var|const|let) /.test(command)) {
			throw this.error('Can\'t declare variables within "void"');
		}

		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(this.prepareOutput(command, true) + ';');
		}
	}
);