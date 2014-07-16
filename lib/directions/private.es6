Snakeskin.addDirective(
	'__setFile__',

	{

	},

	function (command) {
		this.info['file'] = applyDefEscape(command);
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
			return this.error(`directive "cdata" can only be used within a ${groupsList['template'].join(', ')}`);
		}

		this.startInlineDir('cdata');
		this.isSimpleOutput();

		this.info['line'] += parseInt(command, 10);
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