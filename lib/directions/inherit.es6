Snakeskin.addDirective(
	'super',

	{
		placement: 'template'
	},

	function (command, commandLength) {
		var map = this.getGroup('inherit');

		if (this.parentTplName) {
			let obj = this.blockStructure,
				cache;

			while (true) {
				if (map[obj.name]) {
					cache = (obj.name === 'proto' ? protoCache : blockCache)[this.parentTplName][obj.params.name];

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

			if (cache) {
				this.source = this.source.substring(0, this.i - commandLength - 1) +
					cache.content +
					this.source.substring(this.i + 1);

				this.i -= commandLength + 1;
			}
		}
	}
);