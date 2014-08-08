Snakeskin.addDirective(
	'if',

	{
		block: true,
		notEmpty: true,
		group: 'if'
	},

	function (command) {
		this.startDir();
		if (this.isReady()) {
			this.append(`if (${this.prepareOutput(command, true)}) {`);
		}
	},

	function () {
		this.append('}');
	}
);

Snakeskin.addDirective(
	'unless',

	{
		block: true,
		notEmpty: true,
		group: 'if'
	},

	function (command) {
		this.startDir();
		if (this.isReady()) {
			this.append(`if (!(${this.prepareOutput(command, true)})) {`);
		}
	},

	function () {
		this.append('}');
	}
);

Snakeskin.addDirective(
	'elseIf',

	{
		notEmpty: true
	},

	function (command) {
		if (!this.getGroup('if')[this.structure.name]) {
			return this.error(`directive "${this.name}" can be used only with a ${groupsList['if'].join(', ')}`);
		}

		if (this.isReady()) {
			this.append(`} else if (${this.prepareOutput(command, true)}) {`);
		}
	}
);

Snakeskin.addDirective(
	'elseUnless',

	{
		notEmpty: true
	},

	function (command) {
		if (!this.getGroup('if')[this.structure.name]) {
			return this.error(`directive "${this.name}" can be used only with a ${groupsList['if'].join(', ')}`);
		}

		if (this.isReady()) {
			this.append(`} else if (!(${this.prepareOutput(command, true)})) {`);
		}
	}
);

Snakeskin.addDirective(
	'else',

	{

	},

	function (command) {
		if (!this.getGroup('if')[this.structure.name]) {
			return this.error(`directive "${this.name}" can be used only with a ${groupsList['if'].join(', ')}`);
		}

		if (command) {
			let parts = command.split(' '),
				unless = parts[0] === 'unless' ?
					'!' : '';

			if (unless || parts[0] === 'if') {
				parts = parts.slice(1);
			}

			this.append(`} else if (${unless}(${this.prepareOutput(parts.join(' '), true)})) {`);

		} else {
			this.append('} else {');
		}
	}
);

Snakeskin.addDirective(
	'switch',

	{
		block: true,
		notEmpty: true,
		inside: {
			'case': true,
			'default': true
		}
	},

	function (command) {
		this.startDir();
		if (this.isReady()) {
			this.append(`switch (${this.prepareOutput(command, true)}) {`);
		}
	},

	function () {
		this.append('}');
	}
);

Snakeskin.addDirective(
	'case',

	{
		block: true,
		notEmpty: true,
		replacers: {
			'>': (cmd) => cmd.replace('>', 'case '),
			'/>': (cmd) => cmd.replace('\/>', 'end case')
		}
	},

	function (command) {
		this.startDir();

		if (this.structure.parent.name !== 'switch') {
			return this.error(`directive "${this.name}" can be used only within a "switch"`);
		}

		if (this.isReady()) {
			this.append(`case ${this.prepareOutput(command, true)}: {`);
		}
	},

	function () {
		this.append('} break;');
	}
);

Snakeskin.addDirective(
	'default',

	{
		block: true
	},

	function () {
		this.startDir();

		if (this.structure.parent.name !== 'switch') {
			return this.error(`directive "${this.name}" can be used only within a "switch"`);
		}

		this.append('default: {');
	},

	function () {
		this.append('}');
	}
);