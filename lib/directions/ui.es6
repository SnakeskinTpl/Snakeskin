Snakeskin.addDirective(
	'setUI',

	{
		placement: 'global',
		notEmpty: true
	},

	function (command) {
		this.startInlineDir();
		var parts = command.match(/(.*?),\s+(.*)/);

		try {
			ui[parts[1]] = (new Function('return {' +
				this.pasteDangerBlocks(parts[2]) +
			'}'))();

		} catch (ignore) {
			return this.error(`invalid "${this.name}" declaration`);
		}
	}
);

Snakeskin.addDirective(
	'ui',

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
			let lastBEM = this.structure.params;

			command = lastBEM.tag ?
				command.replace(/^.*?\)(.*)/, '$1') : command;

			let parts = command.trim().split(',');
			let bemName = parts[0];

			parts[0] += '\'';
			command = parts.join(',');

			lastBEM.original = ui[bemName] &&
				ui[bemName].tag;

			this.save(this.wrap(`
				'<${lastBEM.tag || lastBEM.original || 'div'}
					class="i-block"
					data-params="{name: \\'${this.replaceTplVars(command.replace(/\s+/g, ' '))}}"
				>'
			`));
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			let lastBEM = this.structure.params;
			this.save(this.wrap(`'</${(lastBEM.tag || lastBEM.original || 'div')}>'`));
		}
	}
);