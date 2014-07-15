Snakeskin.addDirective(
	'break',

	{

	},

	function () {
		var combo = this.getGroup('cycle', 'async');
		combo['proto'] = true;

		var cycles = this.getGroup('cycle'),
			async = this.getGroup('async');

		var inside = this.has(combo),
			insideCallback = this.has(this.getGroup('callback'));

		if (!cycles[inside] && !async[inside] && inside !== 'proto' && !this.proto) {
			return this.error((("directive \"" + (this.name)) + "\" can only be used with a cycles, \"proto\" or a async series"));
		}

		this.startInlineDir();
		this.space = true;

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
					this.save(("\
\n						if (typeof arguments[0] === 'function') {\
\n							return arguments[0](false);\
\n						}\
\n\
\n						return false;\
\n					"));
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
		var combo = this.getGroup('cycle', 'async');
		combo['proto'] = true;

		var cycles = this.getGroup('cycle'),
			async = this.getGroup('async');

		var inside = this.has(combo),
			insideCallback = this.has(this.getGroup('callback'));

		if (!cycles[inside] && !async[inside] && inside !== 'proto' && !this.proto) {
			return this.error((("directive \"" + (this.name)) + "\" can only be used with a cycles, \"proto\" or a async series"));
		}

		this.startInlineDir();
		this.space = true;

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
					this.save(("\
\n						if (typeof arguments[0] === 'function') {\
\n							return arguments[0]();\
\n						}\
\n\
\n						return;\
\n					"));
				}

			} else {
				this.save(this.prepareOutput('continue __I_PROTO__;', true));
			}
		}
	}
);