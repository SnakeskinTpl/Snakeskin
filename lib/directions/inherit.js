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
		var table = {
			'block': true,
			'proto': true,
			'const': true
		};

		if (this.isSimpleOutput()) {
			var obj = this.blockStructure;
			var current = obj.name;

			while (1) {
				if (table[current]) {
					switch (current) {
						case 'proto': {
							protoCache
						} break;

						case 'block': {
							blockCache
						} break;

						case 'const': {
							constCache
						} break;
					}

				} else if (obj.parent) {
					obj = obj.parent;

				} else {
					break;
				}
			}

			/*this.source = this.source.substring(0, this.i + 1) +
				blockCache[extMap[dirObj.tplName]][type[1]].body +
				dirObj.source.substring(dirObj.i + 1);*/
		}
	}
);