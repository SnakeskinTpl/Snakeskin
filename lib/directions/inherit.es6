Snakeskin.addDirective(
	'super',

	{
		placement: 'template'
	},

	function (command, commandLength) {
		var table = {
			'block': true,
			'proto': true,
			'const': true
		};

		if (this.parentTplName) {
			let obj = this.blockStructure;
			let cache;

			while (true) {
				if (table[obj.name]) {
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