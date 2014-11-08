Snakeskin.addDirective(
	'break',

	{

	},

	function (command) {
		var combo = this.getGroup('cycle', 'async');
		combo['proto'] = true;

		var cycles = this.getGroup('cycle'),
			async = this.getGroup('async');

		var inside = this.has(combo),
			insideCallback = this.has(this.getGroup('callback')),
			insideProto = inside === 'proto' || this.proto;

		if (!cycles[inside] && !async[inside] && !insideProto) {
			return this.error(`directive "${this.name}" can be used only with a cycles, "proto" or an async series`);
		}

		this.startInlineDir();
		if (!this.tolerateWhitespace) {
			this.skipSpace = true;
		}

		if (this.isReady()) {
			if (command === 'proto') {
				if (!insideProto) {
					return this.error('proto is not defined');
				}

				if (insideCallback) {
					return this.error('can\'t break proto inside a callback');
				}

				this.append(this.prepareOutput('break __I_PROTO__;', true));
				return;
			}

			if (cycles[inside]) {
				if (inside === insideCallback) {
					this.append('return false;');

				} else {
					this.append('break;');
				}

			} else if (async[inside]) {
				let val = command ? this.prepareOutput(command, true) : 'false';

				if (inside === 'waterfall') {
					this.append(`return arguments[arguments.length - 1](${val});`);

				} else {
					this.append(/* cbws */`
						if (typeof arguments[0] === 'function') {
							return arguments[0](${val});
						}

						return false;
					`);
				}

			} else {
				this.append(this.prepareOutput('break __I_PROTO__;', true));
			}
		}
	}
);

Snakeskin.addDirective(
	'continue',

	{

	},

	function (command) {
		var combo = this.getGroup('cycle', 'async');
		combo['proto'] = true;

		var cycles = this.getGroup('cycle'),
			async = this.getGroup('async');

		var inside = this.has(combo),
			insideCallback = this.has(this.getGroup('callback')),
			insideProto = inside === 'proto' || this.proto;

		if (!cycles[inside] && !async[inside] && !insideProto) {
			return this.error(`directive "${this.name}" can be used only with a cycles, "proto" or an async series`);
		}

		this.startInlineDir();
		if (!this.tolerateWhitespace) {
			this.skipSpace = true;
		}

		if (this.isReady()) {
			if (command === 'proto') {
				if (!insideProto) {
					return this.error(`proto is not defined`);
				}

				if (insideCallback) {
					return this.error('can\'t continue proto inside a callback');
				}

				this.append(this.prepareOutput('continue __I_PROTO__;', true));
				return;
			}

			if (cycles[inside]) {
				if (inside === insideCallback) {
					this.append('return;');

				} else {
					this.append('continue;');
				}

			} else if (async[inside]) {
				let val = command ? `null,${this.prepareOutput(command, true)}` : '';

				if (inside === 'waterfall') {
					this.append(`return arguments[arguments.length - 1](${val});`);

				} else {
					this.append(/* cbws */`
						if (typeof arguments[0] === 'function') {
							return arguments[0](${val});
						}

						return;
					`);
				}

			} else {
				this.append(this.prepareOutput('continue __I_PROTO__;', true));
			}
		}
	}
);
