var importMap = {
	'root': true,
	'head': true
};

Snakeskin.addDirective(
	'import',

	{
		notEmpty: true
	},

	function (command) {
		if (!importMap[this.structure.name]) {
			return this.error((("directive \"" + (this.name)) + "\" can be used only within the global space or a \"head\""));
		}

		var parts = command.split('='),
			obj = parts[0].trim();

		if (parts.length < 2) {
			return this.error((("invalid \"" + (this.name)) + "\" declaration"));
		}

		this.startInlineDir();

		this.save((("\
\n			var " + obj) + (" = __LOCAL__." + obj) + (" = " + (this.prepareOutput((("(" + (parts.slice(1).join('='))) + ")"), true))) + ";\
\n		"));

		var root = this.structure;

		while (root.name !== 'root') {
			root = root.parent;
		}

		root.vars[obj] = {
			value: ("__LOCAL__." + obj),
			scope: 0
		};
	}
);