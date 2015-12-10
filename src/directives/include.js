/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

Snakeskin.addDirective(
	'include',

	{
		notEmpty: true
	},

	function (command) {
		if (this.tplName || this.hasParent('head')) {
			return this.error(`directive "${this.name}" can't be used within a ${groupsList['template'].join(', ')} or a "head"`);
		}

		this.startInlineDir(null, {
			from: this.res.length
		});

		var parts = command.split(' as ');

		if (!parts[0]) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		var path = this.out(parts[0], {sys: true}),
			type = parts[1] ?
				`'${parts[1].trim()}'` : '\'\'';

		if (path !== undefined && type !== undefined) {
			this.save(ws`
				Snakeskin.include(
					'${escapeBackslash(this.info.file || '')}',
					${this.pasteDangerBlocks(path)},
					'${escapeNextLine(this.eol)}',
					${type}
				);
			`);
		}
	},

	function () {
		if (this.hasParent('eval')) {
			return;
		}

		this.res = this.res.slice(0, this.structure.params.from);
	}
);

Snakeskin.addDirective(
	'__setFile__',

	{

	},

	function (command) {
		command = this.pasteDangerBlocks(command);

		let module = {
			exports: {},
			require: require,

			id: this.environment.id + 1,
			key: null,

			filename: command,
			parent: this.module,
			root: this.module.root || this.module,

			children: [],
			loaded: true
		};

		module.root.key.push([command, require('fs').statSync(command).mtime.valueOf()]);

		this.module.children.push(module);
		this.module = module;

		this.info.file = command;
		this.files[command] = true;

		this.save(this.declVars('$_'));
	}
);

Snakeskin.addDirective(
	'__endSetFile__',

	{

	},

	function () {
		var file = this.module.filename;

		this.module = this.module.parent;
		this.info.file = this.module.filename;

		if (this.params[this.params.length - 1]['@file'] === file) {
			this.popParams();
		}
	}
);
