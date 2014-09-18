Snakeskin.addDirective(
	'__&__',

	{
		group: 'ignore'
	},

	function () {
		this.startInlineDir();
		this.space = true;
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

			id: this.module.id + 1,
			key: null,

			filename: command,
			parent: this.module,
			root: this.module.root || this.module,

			children: [],
			loaded: true
		};

		module.root.key.push([command, require('fs')['statSync'](command)['mtime'].valueOf()]);
		this.module.children.push(module);

		this.module = module;
		this.info['file'] = command;
	}
);

Snakeskin.addDirective(
	'__endSetFile__',

	{

	},

	function () {
		var file = this.module.filename;

		this.module = this.module.parent;
		this.info['file'] = this.module.filename;

		if (this.params[this.params.length - 1]['@file'] === file) {
			this.params.pop();

			let p = this.params[this.params.length - 1];
			for (let key in p) {
				if (!p.hasOwnProperty(key)) {
					continue;
				}

				this[key] = p[key];
			}
		}
	}
);

Snakeskin.addDirective(
	'__setError__',

	{

	},

	function (command) {
		this.error(this.pasteDangerBlocks(command));
	}
);

Snakeskin.addDirective(
	'__end__',

	{
		alias: true
	},

	function () {
		Snakeskin.Directions['end'].apply(this, arguments);
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
			line = this.info['line'];

		this.info['line'] += val;
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
			this.info['line'] = parseInt(command, 10);
		}
	}
);

Snakeskin.addDirective(
	'__freezeLine__',

	{
		group: 'ignore'
	},

	function (command) {
		this.startDir();

		if (!command && !this.freezeLine) {
			this.lines.pop();
			this.info['line']--;
		}

		if (!command || this.lines.length >= parseInt(command, 10)) {
			this.freezeLine++;
		}
	},

	function () {
		this.freezeLine--;
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
			this.info['line']--;
		}
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
			line: this.info['line']
		});

		if (!this.freezeLine) {
			this.info['line'] = val;
		}
	},

	function () {
		if (!this.freezeLine) {
			this.info['line'] = this.structure.params.line;
		}
	}
);

Snakeskin.addDirective(
	'__protoWhile__',

	{

	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			let i = this.prepareOutput('__I_PROTO__', true);
			protoCache[this.tplName][this.proto.name].i = i;
			this.save(`${i}:while (${this.prepareOutput(command, true)}) {`);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);