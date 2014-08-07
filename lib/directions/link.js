Snakeskin.addDirective(
	'link',

	{
		placement: 'template'
	},

	function (command) {
		this.startDir();
		this.space = true;

		if (this.isReady()) {
			if (command) {
				command = command.replace(tagRgxp, 'css $1');

			} else {
				command = 'css';
			}

			var parts = command.split(' '),
				type = parts[0];

			var types = {
				'css': 'type="text/css" rel="stylesheet"',
				'acss': 'type="text/css" rel="alternate stylesheet"'
			};

			this.append(this.wrap((("'<link " + (types[type] || this.replaceTplVars(type))) + "'")));

			if (parts.length > 1) {
				var args = [].slice.call(arguments);

				args[0] = parts.slice(1).join(' ');
				args[1] = args[0].length;

				Snakeskin.Directions['attr'].apply(this, args);
				this.inline = false;
			}

			this.append(this.wrap('\' href="\''));
		}
	},

	function () {
		this.append(this.wrap('\'"/>\''));
	}
);