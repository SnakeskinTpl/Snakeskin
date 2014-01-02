var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'data',

	{
		inBlock: true,
		replacers: {
			'*': function (cmd) {
				return cmd.replace(/^\*/, 'data ');}
		}
	},

	function (command) {
		
		__NEJS_THIS__.startDir();
		if (__NEJS_THIS__.isSimpleOutput()) {
			__NEJS_THIS__.save('__SNAKESKIN_RESULT__ += \'' + __NEJS_THIS__.replaceTplVars(command) + '\';');
		}
	}
);