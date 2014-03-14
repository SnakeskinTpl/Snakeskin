var __NEJS_THIS__ = this;
Snakeskin.addDirective(
	'end',

	{
		replacers: {
			'/': function (cmd) {
				return cmd.replace(/^\//, 'end ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		var struct = this.structure;

		if (!struct.parent) {
			throw this.error('Invalid call "end"');
		}

		// Если в директиве end указано название закрываемой директивы,
		// то проверяем, чтобы оно совпадало с реально закрываемой директивой
		if (command && command !== struct.name) {
			throw this.error('Invalid closing tag, expected: ' +
				struct.name +
				', declared: ' +
				command
			);
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

		if (Snakeskin.Directions[struct.name + 'End']) {
			Snakeskin.Directions[struct.name + 'End'].apply(this, arguments);

		} else if (!struct.sys && this.isSimpleOutput()) {
			this.save('};');
		}

		this.endDir();
	}
);