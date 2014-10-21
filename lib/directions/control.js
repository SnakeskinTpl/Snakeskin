var $freeze$0 = Object.freeze;var $defProps$0 = Object.defineProperties;var $TS$0 = ["\n						if (typeof arguments[0] === 'function') {\n							return arguments[0](", ");\n						}\n\n						return false;\n					"];$TS$0 = $freeze$0($defProps$0($TS$0, {"raw": {"value": $TS$0}}));var $TS$1 = ["\n						if (typeof arguments[0] === 'function') {\n							return arguments[0](", ");\n						}\n\n						return;\n					"];$TS$1 = $freeze$0($defProps$0($TS$1, {"raw": {"value": $TS$1}}));Snakeskin.addDirective(
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
			return this.error((("directive \"" + (this.name)) + "\" can be used only with a cycles, \"proto\" or a async series"));
		}

		this.startInlineDir();
		this.skipSpace = true;

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
				var val = command ? this.prepareOutput(command, true) : 'false';

				if (inside === 'waterfall') {
					this.append((("return arguments[arguments.length - 1](" + val) + ");"));

				} else {
					this.append(cbws($TS$0

, val



));
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
			return this.error((("directive \"" + (this.name)) + "\" can be used only with a cycles, \"proto\" or a async series"));
		}

		this.startInlineDir();
		this.skipSpace = true;

		if (this.isReady()) {
			if (command === 'proto') {
				if (!insideProto) {
					return this.error(("proto is not defined"));
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
				var val = command ? ("null," + (this.prepareOutput(command, true))) : '';

				if (inside === 'waterfall') {
					this.append((("return arguments[arguments.length - 1](" + val) + ");"));

				} else {
					this.append(cbws($TS$1

, val



));
				}

			} else {
				this.append(this.prepareOutput('continue __I_PROTO__;', true));
			}
		}
	}
);
