Snakeskin.addDirective(
	'style',

	{
		placement: 'template',
		block: true
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
				'css': 'text/css'
			};

			this.append(this.wrap((("'<style type=\"" + (types[type] || this.replaceTplVars(type))) + "\"'")));

			if (parts.length > 1) {
				var args = [].slice.call(arguments);

				args[0] = parts.slice(1).join(' ');
				args[1] = args[0].length;

				Snakeskin.Directions['attr'].apply(this, args);
				this.inline = false;
			}

			this.append(this.wrap('\'>\''));
		}
	},

	function () {
		this.append(this.wrap('\'</style>\''));
	}
);