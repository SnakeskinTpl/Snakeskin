var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'data',

	{
		placement: 'template',
		notEmpty: true,
		replacers: {
			'=': function (cmd) {
				return cmd.replace(/^=/, 'data ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save('__SNAKESKIN_RESULT__ += \'' + this.replaceTplVars(command) + '\';');
		}
	}
);

Snakeskin.addDirective(
	'decl',

	{
		placement: 'template',
		notEmpty: true,
		replacers: {
			'{': function (cmd) {
				return cmd.replace(/^\{/, 'decl ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save('__SNAKESKIN_RESULT__ += \'{' + (command.charAt(0) === '{' ? '' : '{') + this.replaceTplVars(command) + '}\';');
		}
	}
);

Snakeskin.addDirective(
	'attr',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			var parts = command.match(/(.*?),\s+(.*)/);

			if (!parts) {
				throw this.error('Invalid syntax');
			}

			parts[1] = parts[1].charAt(0) === '-' ? 'data' + parts[1] : parts[1];
			parts[2] = this.prepareOutput(parts[2], true);

			this.save(
				'if (' + parts[2] + ') {' +
					'__SNAKESKIN_RESULT__ += \'' + parts[1] + '="\' + ' + parts[2] + ' + \'"\';' +
				'}'
			);
		}
	}
);