Snakeskin.addDirective(
	'void',

	{
		notEmpty: true,
		replacers: {
			'?': (cmd) => cmd.replace(/^\?/, 'void ')
		}
	},

	function (command) {
		if (/(?:^|\s+)(?:var|const|let) /.test(command)) {
			return this.error('can\'t declare variables within "void"');
		}

		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(`${this.prepareOutput(command, true)};`);
		}
	}
);

Snakeskin.addDirective(
	'eval',

	{
		sys: true,
		placement: 'global'
	},

	function () {
		this.startDir(null, {
			from: this.res.length
		});
	},

	function () {
		this.res.substring(this.structure.params.from, this.res.length);
	}
);

Snakeskin.addDirective(
	'include',

	{

	},

	function (command) {
		if (!IS_NODE) {
			return;
		}


		this.startInlineDir();

		//console.error(`Snakeskin.include('${this.info['file'] || ''}', ${this.pasteDangerBlocks(this.prepareOutput(command, true))});`);

		this.save(`Snakeskin.include('${this.info['file'] || ''}', ${this.pasteDangerBlocks(this.prepareOutput(command, true))});`);
	}
);