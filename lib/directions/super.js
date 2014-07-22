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
				var diff = this.getDiff(commandLength);

				this.source = this.source.substring(0, this.i - diff) +
					(("{__freezeLine__ " + (this.info['line'])) + ("}" + (cache.content)) + "{end}") +
					this.source.substring(this.i + 1);

				this.i -= diff + 1;
			}
		}
	}
);