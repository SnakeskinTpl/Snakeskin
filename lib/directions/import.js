Snakeskin.addDirective(
	'import',

	{
		notEmpty: true
	},

	function (command) {
		if (!{'root': true, 'head': true}[this.structure.name]) {
			return this.error((("directive \"" + (this.name)) + "\" can be used only within the global space or a \"head\""));
		}

		var parts = command.split('='),
			obj = parts[0].trim();

		if (parts.length < 2) {
			return this.error((("invalid \"" + (this.name)) + "\" declaration"));
		}

		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save((("\
\n				var " + obj) + (" = __LOCAL__." + obj) + (" = " + (this.prepareOutput((("(" + (parts.slice(1).join('='))) + ")"), true))) + ";\
\n			"));
		}
	}
);