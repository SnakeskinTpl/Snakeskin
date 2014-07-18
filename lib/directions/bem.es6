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
			ui[parts[1]] = this.evalStr(`{${this.prepareOutput(parts[2], true, null, null, false)}}`);

		} catch (ignore) {
			return this.error(`invalid "${this.name}" declaration`);
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

		if (this.isSimpleOutput()) {
			let params = this.structure.params;

			command = params.tag ?
				command.replace(/^[^)]+\)(.*)/, '$1') : command;

			let parts = command.trim().split(','),
				bemName = parts[0];

			parts[0] += '\'';
			command = parts.join(',');

			params.original = ui[bemName] &&
				ui[bemName].tag;

			this.save(this.wrap(`
				'<${params.tag || params.original || 'div'}
					class="i-block"
					data-params="{name: \\'${this.replaceTplVars(command.replace(/\s+/g, ' '))}}"
				>'
			`));
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			let params = this.structure.params;
			this.save(this.wrap(`'</${(params.tag || params.original || 'div')}>'`));
		}
	}
);