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
			this.save((("__SNAKESKIN_RESULT__ += '" + (this.replaceTplVars(command))) + "';"));
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

			this.save((("__SNAKESKIN_RESULT__ += '{" + (add + code)) + "}';"));
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
			var parts = command.match(/(.*?),\s+(.*)/);

			if (!parts) {
				return this.error((("invalid \"" + (this.name)) + ("\" declaration (" + command) + ")"));
			}

			parts[1] = parts[1].charAt(0) === '-' ?
				("'data-' + " + (parts[1].slice(1))) : parts[1];

			parts[2] = this.prepareOutput(parts[2], true);

			this.save((("\
\n				if (" + (parts[2])) + (") {\
\n					__SNAKESKIN_RESULT__ += ' ' + " + (parts[1])) + (" + ' = \"' + (" + (parts[2])) + ") + '\"';\
\n				}\
\n			"));
		}
	}
);