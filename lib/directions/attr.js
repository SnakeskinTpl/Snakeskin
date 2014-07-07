Snakeskin.addDirective(
	'attr',

	{
		placement: 'template',
		notEmpty: true,
		text: true
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			var parts = command.split(';');

			for (var i = 0; i < parts.length; i++) {
				var arg = parts[i].split('=>');

				if (arg.length !== 2) {
					return this.error((("invalid \"" + (this.name)) + "\" declaration"));
				}

				this.save('__STR__ = \'\';');
				arg[0] = arg[0].charAt(0) === '-' ?
					("'data-' + " + (arg[0].slice(1))) : arg[0];

				var vals = arg[1].split(','),
					str = '';

				for (var j = 0; j < vals.length; j++) {
					var val = this.prepareOutput(vals[j], true) || '';

					str += (("\
\n						if (" + val) + (") {\
\n							__STR__ += ' ' + " + val) + ";\
\n						}\
\n					");
				}

				this.save((("\
\n					" + str) + ("\
\n\
\n					if (__STR__) {\
\n						" + (this.wrap((("' ' + " + (arg[0])) + " + ' = \"' + __STR__ + '\"'")))) + "\
\n					}\
\n				"));
			}
		}
	}
);