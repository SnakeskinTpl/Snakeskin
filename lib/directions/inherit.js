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

	function () {
		var __NEJS_THIS__ = this;
		var table = {
			'block': true,
			'proto': true,
			'const': true
		};

		if (!extMap[this.tplName] || this.parentTplName) {
			var obj = this.blockStructure;
			var current = obj.name;
			var cache;

			while (1) {
				if (table[current]) {
					switch (current) {
						case 'proto': {
							cache = protoCache[this.parentTplName][obj.params.name];
						} break;

						case 'block': {
							cache = blockCache[this.parentTplName][obj.params.name];
						} break;
					}

					if (cache) {
						break;
					}

				} else if (obj.parent) {
					obj = obj.parent;

				} else {
					break;
				}
			}

			if (cache) {
				this.source = this.source.substring(0, this.i + 1) +
					cache.content +
					this.source.substring(this.i + 1);
			}
		}
	}
);