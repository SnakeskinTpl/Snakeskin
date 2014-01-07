var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'super',

	{
		placement: 'template'
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (this.isSimpleOutput()) {
			console.log(this.structure);

			/*this.source = this.source.substring(0, this.i + 1) +
				blockCache[extMap[dirObj.tplName]][type[1]].body +
				dirObj.source.substring(dirObj.i + 1);*/
		}
	}
);