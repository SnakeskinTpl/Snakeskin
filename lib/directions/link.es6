Snakeskin.addDirective(
	'link',

	{
		placement: 'template'
	},

	function (command) {
		this.startDir();
		this.space = true;

		if (this.autoCorrect) {
			this.autoCorrect = false;
			this.structure.params.autoCorrect = true;
		}

		if (this.isReady()) {
			if (command) {
				command = command.replace(tagRgxp, 'css $1');

			} else {
				command = 'css';
			}

			let parts = command.split(' '),
				type = parts[0];

			let types = {
				'css': 'type="text/css" rel="stylesheet"',
				'acss': 'type="text/css" rel="alternate stylesheet"'
			};

			this.append(this.wrap(`'<link ${types[type] || this.replaceTplVars(type)}'`));

			if (parts.length > 1) {
				let args = [].slice.call(arguments);

				args[0] = parts.slice(1).join(' ');
				args[1] = args[0].length;

				Snakeskin.Directions['attr'].apply(this, args);
				this.inline = false;
			}

			this.append(this.wrap('\' href="\''));
		}
	},

	function () {
		if (this.structure.params.autoCorrect) {
			this.autoCorrect = true;
		}

		this.append(this.wrap('\'"/>\''));
	}
);