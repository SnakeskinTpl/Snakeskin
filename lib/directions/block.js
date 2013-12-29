var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'block',

	{
		isSys: true
	},

	function (command, commandLength, dir, params) {
		
		dir
			.isDirectiveInBlock(params.name)
			.startDir(params.name, {
				name: command
			});

		if (dir.isAdvTest(params.dryRun)) {
			// Попытка декларировать блок несколько раз
			if (blockCache[dir.tplName][command]) {
				throw dir.error('Block "' + command + '" is already defined, ' +
					dir.genErrorAdvInfo(params.info)
				);
			}

			blockCache[dir.tplName][command] = {from: dir.i - dir.startI + 1};
		}
	},

	function (command, commandLength, dir, params) {
		
		if (dir.isAdvTest(params.dryRun)) {
			var block = blockCache[dir.tplName][dir.structure.params.name];
			block.body = dir.source.substring(dir.startI).substring(block.from, block.to);
		}
	}
);