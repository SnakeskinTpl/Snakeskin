Snakeskin.addDirective(
	'super',

	{
		placement: 'template'
	},

	function (command, commandLength) {
		this.startInlineDir();
		if (this.parentTplName) {
			var map = this.getGroup('inherit'),
				obj = this.blockStructure;

			var cache,
				drop;

			while (true) {
				if (map[obj.name]) {
					var name = obj.params.name;

					cache = routerCache[obj.name][this.parentTplName][name];
					drop = this.blockTable[(("" + (obj.name)) + ("_" + name) + "")].drop;

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

			var s = (this.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK,
				e = RIGHT_BLOCK;

			if (cache && !drop) {
				var diff = this.getDiff(commandLength);

				this.source = this.source.substring(0, this.i - diff) +
					(("/*!!= " + s) + ("super" + e) + (" =*/" + s) + ("__freezeLine__ " + (this.info['line'])) + ("" + e) + ("" + (cache.content)) + ("" + s) + ("end" + e) + "") +
					this.source.substring(this.i + 1);

				this.i -= diff + 1;
			}
		}
	}
);
