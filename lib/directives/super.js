/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

Snakeskin.addDirective(
	'super',

	{
		placement: 'template'
	},

	function (command, commandLength) {
		this.startInlineDir();
		if (this.parentTplName && !this.outerLink) {
			let map = this.getGroup('inherit'),
				obj = this.blockStructure;

			let cache,
				drop;

			while (true) {
				if (map[obj.name]) {
					let name = obj.params.name;

					cache = routerCache[obj.name][this.parentTplName][name];
					drop = this.blockTable[`${obj.name}_${name}`].drop;

					if (cache) {
						break;
					}
				}

				if (obj.parent && obj.parent.name !== 'root') {
					obj = obj.parent;

				} else {
					break;
				}
			}

			let s = (this.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK,
				e = RIGHT_BLOCK;

			if (cache && !drop) {
				let diff = this.getDiff(commandLength);

				this.source = this.source.substring(0, this.i - diff) +
					`/*!!= ${s}super${e} =*/${s}__super__ ${this.info.line}${e}${cache.content}${!this.tolerateWhitespace ? `${s}__&-__${e}` : ''}${s}__end__${e}` +
					this.source.substring(this.i + 1);

				this.i -= diff + 1;
			}
		}
	}
);

Snakeskin.addDirective(
	'__super__',

	{
		group: 'ignore'
	},

	function (command) {
		this.startDir();

		if (!command && !this.freezeLine) {
			this.lines.pop();
			this.info.line--;
		}

		if (!command || this.lines.length >= parseInt(command, 10)) {
			this.freezeLine++;
		}
	},

	function () {
		this.freezeLine--;
	}
);
