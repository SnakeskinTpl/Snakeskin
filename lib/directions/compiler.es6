Snakeskin.addDirective(
	'setSSFlag',

	{
		placement: 'global',
		notEmpty: true,
		replacers: {
			'@=': (cmd) => cmd.replace('@=', 'setSSFlag ')
		}
	},

	function (command) {
		this.startInlineDir();

		var root = this.params[0],
			last = this.params[this.params.length - 1],
			params = last;

		if (last['@root'] || (this.info['file'] === void 0 || last['@file'] !== this.info['file'])) {
			params = {
				'@file': this.info['file']
			};

			for (let key in last) {
				if (!last.hasOwnProperty(key)) {
					continue;
				}

				if (key.charAt(0) !== '@' && key in root) {
					params[key] =
						this[key] = last[key];
				}
			}

			this.params.push(params);
		}

		var parts = command.split(' ');
		var flag = parts[0].trim(),
			value = this.evalStr('return ' + this.pasteDangerBlocks(parts.slice(1).join(' ')));

		if (flag in root) {
			params[flag] = value;
			this[flag] = value;
		}
	}
);