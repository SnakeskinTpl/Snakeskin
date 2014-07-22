Snakeskin.addDirective(
	'super',

	{
		placement: 'template'
	},

	function (command, commandLength) {
		this.startInlineDir();
		if (this.parentTplName) {
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

			if (cache && !drop) {
				let diff = this.getDiff(commandLength);

				this.source = this.source.substring(0, this.i - diff) +
					`{__freezeLine__ ${this.info['line']}}${cache.content}{end}` +
					this.source.substring(this.i + 1);

				this.i -= diff + 1;
			}
		}
	}
);