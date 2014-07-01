Snakeskin.addDirective(
	'return',

	{
		placement: 'template'
	},

	function (command) {
		this.startInlineDir();

		var map = this.getGroup('callback');
		map['proto'] = true;

		var useCallback = this.hasParent(map) !== 'proto';

		if (this.isSimpleOutput()) {
			this.space = true;
			if (this.proto && !command) {
				let val = this.prepareOutput('break __I_PROTO__;', true);

				if (useCallback) {
					this.save(`
						__RETURN__ = true;
						return false;
					`);

					this.deferReturn = String(val);

				} else {
					this.save(val);
				}

			} else {
				let chunk,
					val;

				if (command) {
					chunk = this.prepareOutput(command, true);
					val = `return ${chunk};`;

				} else {
					val = this.returnResult();
				}

				if (useCallback) {
					this.save(`
						__RETURN__ = true;
						${chunk ? `__RETURN_VAL__ = ${chunk};` : ''}

						return false;
					`);

					this.deferReturn = chunk ? true : val;

				} else {
					this.save(val);
				}
			}
		}
	}
);