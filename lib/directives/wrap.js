Snakeskin.addDirective(
	'wrap',

	{
		block: true,
		after: {
			'and': true,
			'end': true
		}
	},

	function (command, commandLength, commandType, jsDocStart) {
		this.startDir(null, {
			chunkLength: 1,
			command,
			commandLength,
			commandType,
			jsDocStart
		});

		if (this.isReady()) {
			this.append(/* cbws */`
				var __WRAP_CACHE__ = __RESULT__,
						__WRAP_TMP__ = [];
				__RESULT__ = ${this.declResult()};
			`);
		}
	},

	function () {
		if (this.isReady()) {
			this.append(/* cbws */`
				__WRAP_TMP__.push(__RESULT__);
				__RESULT__ = __WRAP_CACHE__;
			`);

			let
				params = this.structure.params,
				parts = params.command.split(' '),
				i = params.chunkLength,
				j = 0,
				adv = '';

			while (i--) {
				if (adv) {
					adv += ',';
				}

				adv += `__WRAP_TMP__[${j++}]`;
			}

			Snakeskin.Directions[parts[0]].call(
				this,
				parts
					.slice(1)
					.join(' ')
					.replace(/\((.*?)\)$/, (sstr, $0) => {
						$0 = $0.trim();
						return $0 ? `(${$0},${adv})` : `(${adv})`;
					}),

				params.commandLength,
				parts[0],
				params.jsDocStart
			);
		}
	}

);

Snakeskin.addDirective(
	'and',

	{
		chain: 'wrap'
	},

	function () {
		this.structure.params.chunkLength++;
		if (this.isReady()) {
			this.append(/* cbws */`
				__WRAP_TMP__.push(__RESULT__);
				__RESULT__ = ${this.declResult()};
			`);
		}
	}

);
