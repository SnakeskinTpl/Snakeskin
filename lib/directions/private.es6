Snakeskin.addDirective(
	'__setFile__',

	{

	},

	function (command) {
		let module = {
			exports: {},
			require: require,

			id: this.module.id + 1,
			filename: command,

			parent: this.module,
			children: [],

			loaded: true
		};

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
		this.module = this.module.parent;
		this.info['file'] = this.module.filename;
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
	'__appendLine__',

	{

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
			for (let i = 0; i < val; i++) {
				this.lines[line + i] = '';
			}
		}
	}
);

Snakeskin.addDirective(
	'__setLine__',

	{

	},

	function (command) {
		this.startInlineDir();
		this.info['line'] = parseInt(command, 10);
	}
);

Snakeskin.addDirective(
	'__switchLine__',

	{

	},

	function (command) {
		var val = parseInt(command, 10);

		this.startDir(null, {
			line: this.info['line']
		});

		this.info['line'] = val;
	},

	function () {
		this.info['line'] = this.structure.params.line;
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

Snakeskin.addDirective(
	'__const__',

	{

	},

	function (command, commandLength) {
		let name = command.split('=')[0].trim();

		this.startInlineDir('const', {
			name: name
		});

		if (this.isSimpleOutput()) {
			this.save(this.prepareOutput(`var ${command};`, true));
		}

		if (this.isAdvTest()) {
			let start = this.i - this.startTemplateI;

			constCache[this.tplName][name] = {
				from: start - commandLength,
				to: start,
				tmp: true
			};

			fromConstCache[this.tplName] = start + 1;
		}
	}
);