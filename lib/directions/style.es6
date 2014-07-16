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
			let parts = command.split(' '),
				type = parts[0] || 'css';

			let types = {
				'css': 'text/css'
			};

			this.save(this.wrap(`'<style type="${types[type] || this.prepareOutput(type, true)}"'`));

			if (parts.length > 1) {
				Snakeskin.Directions['attr'](this, parts.slice(1).join(' '));
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