var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'setBEM',

	{
		placement: 'global',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		var parts = command.match(/(.*?),\s+(.*)/);

		try {
			bem[parts[1]] = (new Function('return {' +
				this.pasteDangerBlocks(parts[2]) +
			'}'))();

		} catch (ignore) {
			throw this.error('Invalid syntax');
		}
	}
);

Snakeskin.addDirective(
	'bem',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir(null, {
			tag: /^\(/.test(command) ? /\((.*?)\)/.exec(command)[1] : null
		});

		if (this.isSimpleOutput()) {
			var lastBEM = this.structure.params;

			// Получаем параметры инициализации блока и врапим имя кавычками
			command = lastBEM.tag ? command.replace(/^.*?\)(.*)/, '$1') : command;
			var parts = command.trim().split(',');

			var bemName = parts[0];
			lastBEM.original = bem[bemName] && bem[bemName].tag;

			parts[0] += '\'';
			command = parts.join(',');

			this.save(
				'__SNAKESKIN_RESULT__ += \'' +
					'<' + (lastBEM.tag || lastBEM.original || 'div') + ' class="i-block" data-params="{name: \\\'' +
					this.replaceTplVars(command.replace(/\s+/g, ' ')) +
				'}">\';'
			);
		}
	},

	function () {
		var __NEJS_THIS__ = this;
		if (this.isSimpleOutput()) {
			var lastBEM = this.structure.params;
			this.save('__SNAKESKIN_RESULT__ += \'</' + (lastBEM.tag || lastBEM.original || 'div') + '>\';');
		}
	}
);