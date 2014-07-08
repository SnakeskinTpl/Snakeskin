Snakeskin.addDirective(
	'break',

	{

	},

	function () {
		this.startInlineDir();
		this.space = true;

		var combo = this.getGroup('cycle', 'async');
		combo['proto'] = true;

		var cycles = this.getGroup('cycle'),
			async = this.getGroup('async');

		var inside = this.hasParent(combo),
			insideCallback = this.hasParent(this.getGroup('callback'));

		if (!cycles[inside] && !async[inside] && inside !== 'proto' && !this.proto) {
			return this.error(`directive "${this.name}" can only be used with a cycles, "proto" or a async series`);
		}

		if (this.isSimpleOutput()) {
			if (cycles[inside]) {
				if (inside === insideCallback) {
					this.save('return false;');

				} else {
					this.save('break;');
				}

			} else if (async[inside]) {
				if (inside === 'waterfall') {
					this.save('return arguments[arguments.length - 1](false);');

				} else {
					this.save(`
						if (typeof arguments[0] === 'function') {
							return arguments[0](false);
						}

						return false;
					`);
				}

			} else {
				this.save(this.prepareOutput('break __I_PROTO__;', true));
			}
		}
	}
);

Snakeskin.addDirective(
	'continue',

	{

	},

	function () {
		this.startInlineDir();
		this.space = true;

		var combo = this.getGroup('cycle', 'async');
		combo['proto'] = true;

		var cycles = this.getGroup('cycle'),
			async = this.getGroup('async');

		var inside = this.hasParent(combo),
			insideCallback = this.hasParent(this.getGroup('callback'));

		if (!cycles[inside] && !async[inside] && inside !== 'proto' && !this.proto) {
			return this.error(`directive "${this.name}" can only be used with a cycles, "proto" or a async series`);
		}

		if (this.isSimpleOutput()) {
			if (cycles[inside]) {
				if (inside === insideCallback) {
					this.save('return;');

				} else {
					this.save('continue;');
				}

			} else if (async[inside]) {
				if (inside === 'waterfall') {
					this.save('return arguments[arguments.length - 1]();');

				} else {
					this.save(`
						if (typeof arguments[0] === 'function') {
							return arguments[0]();
						}

						return;
					`);
				}

			} else {
				this.save(this.prepareOutput('continue __I_PROTO__;', true));
			}
		}
	}
);