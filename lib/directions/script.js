Snakeskin.addDirective(
	'script',

	{
		placement: 'template',
		block: true
	},

	function (command) {
		this.startDir();
		this.space = true;

		var parts = command.split(' '),
			type = parts[0] || 'js';

		var types = {
			'js': 'text/javascript',
			'dart': 'application/dart',
			'coffee': 'application/coffeescript',
			'ts': 'application/typescript',
			'json': 'application/json',
			'html': 'text/html'
		};

		var str = this.wrap((("'<script type=\"" + (types[type] || this.prepareOutput(type, true))) + "\"'"));

		if (parts.length > 1) {
			var args = [].slice.call(arguments);

			args[0] = parts.slice(1).join(' ');
			args[1] = args[0].length;

			Snakeskin.Directions['attr'].apply(this, args);
			this.inline = false;
		}

		this.save(str + this.wrap('\'>\''));
	},

	function () {
		this.append(this.wrap('\'</script>\''));
	}
);