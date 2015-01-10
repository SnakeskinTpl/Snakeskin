Snakeskin.addDirective(
	'$forEach',

	{
		block: true,
		notEmpty: true,
		group: [
			'cycle',
			'callback',
			'selfThis'
		]
	},

	function (command) {
		var parts = command.split('=>');

		if (!parts.length || parts.length > 3) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startDir(null, {
			params: parts[2] ? parts[1] : null
		});

		if (this.isReady()) {
			this.append(/* cbws */`
				${this.prepareOutput(`$C(${parts[0]})`, true)}.forEach(function (${this.declCallbackArgs(parts)}) {
					${this.declArguments()}
			`);
		}
	},

	function () {
		if (this.isReady()) {
			let params = this.structure.params.params;

			if (params) {
				this.append(`}, ${this.prepareOutput(params, true)});`);

			} else {
				this.append('});');
			}
		}
	}
);
