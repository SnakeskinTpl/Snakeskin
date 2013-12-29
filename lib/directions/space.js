var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'&',

	null,

	function (command, commandLength, dir, params) {
		
		dir
			.isDirectiveInBlock(params.name)
			.startInlineDir(params.name);

		if (dir.isSimpleOutput()) {
			dir.space = true;
		}
	}
);