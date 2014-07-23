Snakeskin.addDirective(
	'style',

	{
		placement: 'template',
		block: true
	},

	function (command) {
		this.startDir();
		this.space = true;

		if (this.isSimpleOutput()) {
			var parts = command.split(' '),
				type = parts[0] || 'css';

			var types = {
				'css': 'text/css'
			};

			this.save(this.wrap((("'<style type=\"" + (types[type] || this.prepareOutput(type, true))) + "\"'")));

			if (parts.length > 1) {
				var args = [].slice.call(arguments);

				args[0] = parts.slice(1).join(' ');
				args[1] = args[0].length;

				Snakeskin.Directions['attr'].apply(this, args);
				this.inline = false;
			}

			this.save(this.wrap('\'>\''));
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save(this.wrap('\'</style>\''));
		}
	}
);