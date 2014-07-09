Snakeskin.addDirective(
	'script',

	{
		placement: 'template',
		block: true,
		notEmpty: true
	},

	function (command) {
		this.startDir();

		var parts = command.split(' '),
			type = parts[0];

		var types = {
			'js': 'text/javascript',
			'dart': 'application/dart',
			'coffee': 'application/coffeescript',
			'ts': 'application/typescript',
			'json': 'application/json',
			'html': 'text/html'
		};

		this.space = true;

		if (this.isSimpleOutput()) {
			this.save(this.wrap(`'<script type="${types[type] || this.prepareOutput(type, true)}"'`));

			if (parts.length > 1) {
				Snakeskin.Directions['attr'](this, parts.slice(1).join(' '));
			}

			this.save(this.wrap('\'>\''));
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save(this.wrap('\'</script>\''));
		}
	}
);