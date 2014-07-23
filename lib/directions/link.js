Snakeskin.addDirective(
	'link',

	{
		placement: 'template'
	},

	function (command) {
		this.startDir();
		this.space = true;

		if (this.isSimpleOutput()) {
			var parts = command.split(' '),
				type = parts[0] || 'css';

			var types = {
				'css': 'type="text/css" rel="stylesheet"',
				'acss': 'type="text/css" rel="alternate stylesheet"'
			};

			this.save(this.wrap((("'<link " + (types[type])) + "'")));

			if (parts.length > 1) {
				var args = [].slice.call(arguments);

				args[0] = parts.slice(1).join(' ');
				args[1] = args[0].length;

				Snakeskin.Directions['attr'].apply(this, args);
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