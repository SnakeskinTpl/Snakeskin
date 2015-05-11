/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

Snakeskin.addDirective(
	'__setError__',

	{

	},

	function (command) {
		this.error(this.pasteDangerBlocks(command));
	}
);

Snakeskin.addDirective(
	'__appendLine__',

	{
		group: 'ignore'
	},

	function (command) {
		if (!this.structure.parent) {
			return this.error(`directive "cdata" only be used only within a ${groupsList['template'].join(', ')}`);
		}

		this.startInlineDir('cdata');
		this.isSimpleOutput();

		var val = parseInt(command, 10),
			line = this.info.line;

		this.info.line += val;
		if (!this.proto) {
			for (let i = -1; ++i < val;) {
				this.lines[line + i] = '';
			}
		}
	}
);

Snakeskin.addDirective(
	'__setLine__',

	{
		group: 'ignore'
	},

	function (command) {
		this.startInlineDir();
		if (!this.freezeLine) {
			this.info.line = parseInt(command, 10);
		}
	}
);

Snakeskin.addDirective(
	'__cutLine__',

	{
		group: 'ignore'
	},

	function () {
		this.startInlineDir();
		if (!this.freezeLine) {
			this.lines.pop();
			this.info.line--;
		}
	}
);

Snakeskin.addDirective(
	'__sp__',

	{
		group: 'ignore',
		text: true
	},

	function () {
		this.startInlineDir();
	}
);

Snakeskin.addDirective(
	'__switchLine__',

	{
		group: 'ignore'
	},

	function (command) {
		var val = parseInt(command, 10);

		this.startDir(null, {
			line: this.info.line
		});

		if (!this.freezeLine) {
			this.info.line = val;
		}
	},

	function () {
		if (!this.freezeLine) {
			let length =
				this.info.line = this.structure.params.line;

			for (let i = this.lines.length - 1; ++i < length;) {
				this.lines.push('');
			}
		}
	}
);
