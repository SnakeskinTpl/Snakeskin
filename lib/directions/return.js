Snakeskin.addDirective(
	'return',

	{
		placement: 'template'
	},

	function (command) {
		this.startInlineDir();

		var map = this.getGroup('callback');
		map['proto'] = true;

		var parent = this.hasParent(map);
		var useCallback = parent && parent !== 'proto';

		if (this.isSimpleOutput()) {
			this.space = true;
			if (this.proto && !command) {
				var val = this.prepareOutput('break __I_PROTO__;', true);

				if (useCallback) {
					this.save(("\
\n						__RETURN__ = true;\
\n						return false;\
\n					"));

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
					this.save((("\
\n						__RETURN__ = true;\
\n						" + (chunk ? (("__RETURN_VAL__ = " + chunk) + ";") : '')) + "\
\n\
\n						return false;\
\n					"));

					this.deferReturn = chunk ? true : val$0;

				} else {
					this.save(val$0);
				}
			}
		}
	}
);