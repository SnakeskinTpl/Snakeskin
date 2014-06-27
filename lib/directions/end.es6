Snakeskin.addDirective(
	'end',

	{
		replacers: {
			'/': (cmd) => cmd.replace(/^\//, 'end ')
		}
	},

	function (command) {
		var struct = this.structure,
			name = struct.name;

		if (!struct.parent) {
			return this.error(`invalid call "end"`);
		}

		if (command && command !== name) {
			return this.error(`invalid closing tag, expected: "${name}", declared: "${command}"`);
		}

		if (inside[name]) {
			this.strongSpace = struct.parent.strong;
		}

		var destruct = Snakeskin.Directions[`${name}End`];

		if (destruct) {
			destruct.apply(this, arguments);

		} else if (!struct.sys && this.isSimpleOutput()) {
			this.save('};');
		}

		this.endDir();
		this.toQueue(() => {
			this.startInlineDir();
		});
	}
);