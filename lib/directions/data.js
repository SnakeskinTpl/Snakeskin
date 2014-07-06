Snakeskin.addDirective(
	'data',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'=': function(cmd)  {return cmd.replace(/^=/, 'data ')}
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(this.wrap((("'" + (this.replaceTplVars(command))) + "'")));
		}
	}
);

Snakeskin.addDirective(
	'decl',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'{': function(cmd)  {return cmd.replace(/^\{/, 'decl ')}
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			var code = this.replaceTplVars(command);

			var start = /^\{+/.exec(code) ||
				[''];

			var end = /\}+$/.exec(code) ||
				[''];

			var add;
			try {
				add = new Array(end[0].length - start[0].length + 1).join('{');

			} catch (ignore) {
				return this.error((("invalid \"" + (this.name)) + "\" declaration"));
			}

			this.save(this.wrap((("'{" + (add + code)) + "}'")));
		}
	}
);

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