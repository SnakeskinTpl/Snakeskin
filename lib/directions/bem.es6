Snakeskin.addDirective(
	'setBEM',

	{
		placement: 'global',
		notEmpty: true
	},

	function (command) {
		this.startInlineDir();
		var parts = command.match(/(.*?),\s+(.*)/);

		try {
			bem[parts[1]] = (new Function('return {' +
				this.pasteDangerBlocks(parts[2]) +
			'}'))();

		} catch (ignore) {
			throw this.error(`Invalid "setBEM" declaration: ${command}`);
		}
	}
);

Snakeskin.addDirective(
	'bem',

	{
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

			lastBEM.original = bem[bemName] &&
				bem[bemName].tag;

			this.save(`
				__SNAKESKIN_RESULT__ += '<${lastBEM.tag || lastBEM.original || 'div'}
					class="i-block"
					data-params="{name: \\'${this.replaceTplVars(command.replace(/\s+/g, ' '))}}"
				>';
			`);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			let lastBEM = this.structure.params;
			this.save(`__SNAKESKIN_RESULT__ += '</${(lastBEM.tag || lastBEM.original || 'div')}>';`);
		}
	}
);