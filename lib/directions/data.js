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
				return this.error((("invalid \"" + (this.name)) + ("\" declaration (" + command) + ")"));
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

	function (command) {var this$0 = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			var parts = command.split(';');
			var exec = function(parts)  {
				parts[0] = parts[0].charAt(0) === '-' ?
					("'data-' + " + (parts[0].slice(1))) : parts[0];

				parts[1] = this$0.prepareOutput(parts[1], true) || '';
			};

			for (var i = 0; i < parts.length; i++) {
				var arg = parts[i].split('=>');

				if (arg.length !== 2) {
					return this.error((("invalid \"" + (this.name)) + ("\" declaration (" + command) + (", " + (parts[i])) + ")"));
				}

				for (var j = 0; j < arg.length; j++) {
					exec(arg);

					this.save((("\
\n						if (" + (arg[1])) + (") {\
\n							" + (this.wrap((("' ' + " + (arg[0])) + (" + ' = \"' + (" + (arg[1])) + ") + '\"'")))) + "\
\n						}\
\n					"));
				}
			}
		}
	}
);