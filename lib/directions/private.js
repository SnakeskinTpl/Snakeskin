var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'__appendLine__',

	null,

	function (command, commandLength, dir, params) {
		
		if (!dir.structure.parent) {
			throw dir.error('Directive "cdata" can only be used within a "template" or "proto"');
		}

		dir.startInlineDir('cdata');
		dir.isSimpleOutput();

		params.info.line += parseInt(command);
	}
);