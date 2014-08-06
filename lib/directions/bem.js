Snakeskin.addDirective(
	'setBEM',

	{
		placement: 'global',
		notEmpty: true
	},

	function (command) {
		this.startInlineDir();
		var parts = command.match(/([^,]+),\s+(.*)/);

		try {
			bem[parts[1]] = this.evalStr((("{" + (this.prepareOutput(parts[2], true, null, null, false))) + "}"));

		} catch (ignore) {
			return this.error((("invalid \"" + (this.name)) + "\" declaration"));
		}
	}
);

Snakeskin.addDirective(
	'bem',

	{
		block: true,
		placement: 'template',
		notEmpty: true,
		text: true
	},

	function (command) {
		this.startDir(null, {
			tag: /^\(/.test(command) ?
				/\((.*?)\)/.exec(command)[1] : null
		});

		var params = this.structure.params;

		command = params.tag ?
			command.replace(/^[^)]+\)(.*)/, '$1') : command;

		var parts = command.trim().split(','),
			bemName = parts[0];

		parts[0] += '\'';
		command = parts.join(',');

		params.original = bem[bemName] &&
			bem[bemName].tag;

		this.append(this.wrap((("\
\n			'<" + (params.tag || params.original || 'div')) + ("\
\n				class=\"i-block\"\
\n				data-params=\"{name: \\'" + (this.replaceTplVars(command.replace(/\s+/g, ' ')))) + "}\"\
\n			>'\
\n		")));
	},

	function () {
		var params = this.structure.params;
		this.append(this.wrap((("'</" + (params.tag || params.original || 'div')) + ">'")));
	}
);