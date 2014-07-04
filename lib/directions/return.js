Snakeskin.addDirective(
	'return',

	{
		placement: 'template'
	},

	function (command) {
		var strongParent = this.structure.parent.name;
		this.startInlineDir();

		var map = this.getGroup('callback');
		map['proto'] = true;

		var parent = this.hasParent(map),
			useCallback = parent && parent !== 'proto';

		if (this.isSimpleOutput()) {
			this.space = true;
			var async = this.getGroup('async');

			if (this.proto && !command) {
				var val = this.prepareOutput('break __I_PROTO__;', true);

				if (useCallback) {
					var prfx = '__RETURN__ = true;';

					if (async[strongParent]) {
						if (strongParent === 'waterfall') {
							this.save((("\
\n								" + prfx) + "\
\n								return arguments[arguments.length - 1](false);\
\n							"));

						} else {
							this.save((("\
\n								" + prfx) + "\
\n\
\n								if (typeof arguments[0] === 'function') {\
\n									return arguments[0](false);\
\n								}\
\n\
\n								return false;\
\n							"));
						}

					} else {
						this.save((("\
\n							" + prfx) + "\
\n							return false;\
\n						"));
					}

					this.deferReturn = String(val);

				} else {
					this.save(val);
				}

			} else {
				var chunk,
					val$0;

				if (command) {
					chunk = this.prepareOutput(command, true);
					val$0 = (("return " + chunk) + ";");

				} else {
					val$0 = this.returnResult();
				}

				if (useCallback) {
					var prfx$0 = (("\
\n						__RETURN__ = true;\
\n						" + (chunk ? (("__RETURN_VAL__ = " + chunk) + ";") : '')) + "\
\n					");

					if (async[strongParent]) {
						if (strongParent === 'waterfall') {
							this.save((("\
\n								" + prfx$0) + "\
\n								return arguments[arguments.length - 1](false);\
\n							"));

						} else {
							this.save((("\
\n								" + prfx$0) + "\
\n\
\n								if (typeof arguments[0] === 'function') {\
\n									return arguments[0](false);\
\n								}\
\n\
\n								return false;\
\n							"));
						}

					} else {
						this.save((("\
\n							" + prfx$0) + "\
\n							return false;\
\n						"));
					}

					this.deferReturn = chunk ? true : val$0;

				} else {
					this.save(val$0);
				}
			}
		}
	}
);