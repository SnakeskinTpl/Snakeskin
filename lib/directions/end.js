var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'end',

	{
		replacers: {
			'/': function (cmd) {
				return cmd.replace(/^\//, 'end ');}
		}
	},

	function (command, commandLength, dir, params) {
		
		var struct = dir.structure;

		if (!struct.parent) {
			throw dir.error('Invalid call "end", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		// Если в директиве end указано название закрываемой директивы,
		// то проверяем, чтобы оно совпадало с реально закрываемой директивой
		if (command && command !== struct.name) {
			throw dir.error('Invalid closing tag, expected: ' +
				struct.name +
				', declared: ' +
				command +
				', ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		if (strongDirs[struct.name]) {
			dir.strongDir = null;
		}

		if (dir.returnStrongDir && dir.returnStrongDir.child === struct.name) {
			dir.strongDir = dir.returnStrongDir.dir;
			dir.strongSpace = true;
			dir.returnStrongDir = null;
		}

		if (Snakeskin.Directions[struct.name + 'End']) {
			Snakeskin.Directions[struct.name + 'End'].apply(Snakeskin, arguments);

		} else if (!struct.isSys && dir.isSimpleOutput()) {
			dir.save('};');
		}

		dir.endDir();
	}
);