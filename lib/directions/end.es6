Snakeskin.addDirective(
	'end',

	{
		replacers: {
			'/': (cmd) => cmd.replace(/^\//, 'end ')
		}
	},

	function (command) {
		var struct = this.structure;

		if (!struct.parent) {
			return this.error('invalid call "end"');
		}

		// Если в директиве end указано название закрываемой директивы,
		// то проверяем, чтобы оно совпадало с реально закрываемой директивой
		if (command && command !== struct.name) {
			return this.error(`invalid closing tag, expected: "${struct.name}", declared: "${command}"`);
		}

		if (strongDirs[struct.name]) {
			this.strongDir = null;
			this.strongSpace = false;
		}

		if (this.returnStrongDir && this.returnStrongDir.child === struct.name) {
			this.strongDir = this.returnStrongDir.dir;
			this.strongSpace = true;
			this.returnStrongDir = null;
		}

		var destruct = Snakeskin.Directions[`${struct.name}End`];

		if (destruct) {
			destruct.apply(this, arguments);

		} else if (!struct.sys && this.isSimpleOutput()) {
			this.save('};');
		}

		this.endDir();
	}
);