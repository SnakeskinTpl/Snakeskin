Snakeskin.addDirective(
	'super',

	{
		placement: 'template'
	},

	function (command, commandLength) {
		var map = this.getGroup('inherit');

		if (this.parentTplName) {
			var obj = this.blockStructure;
			var cache,
				drop;

			while (true) {
				if (map[obj.name]) {
					var name = obj.params.name;

					cache = (obj.name === 'proto' ? protoCache : blockCache)[this.parentTplName][name];
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

			if (cache && !drop) {
				this.source = this.source.substring(0, this.i - commandLength - 1) +
					cache.content +
					this.source.substring(this.i + 1);

				this.i -= commandLength + 1;
			}
		}
	}
);