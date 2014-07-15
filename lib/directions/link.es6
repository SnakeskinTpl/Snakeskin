Snakeskin.addDirective(
	'link',

	{
		placement: 'template'
	},

	function (command) {
		var parts = command.split(' '),
			type = parts[0] || 'css';

		var types = {
			'css': 'type="text/css" rel="stylesheet"',
			'acss': 'type="text/css" rel="alternate stylesheet"'
		};

		this.startDir();
		this.space = true;

		if (this.isSimpleOutput()) {
			this.save(this.wrap(`'<link ${types[type]}'`));

			if (parts.length > 1) {
				Snakeskin.Directions['attr'](this, parts.slice(1).join(' '));
				this.inline = false;
			}

			this.save(this.wrap('\' href="\''));
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save(this.wrap('\'" />\''));
		}
	}
);