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
			let async = this.getGroup('async');

			if (this.proto && !command) {
				let val = this.prepareOutput('break __I_PROTO__;', true);

				if (useCallback) {
					let prfx = '__RETURN__ = true;';

					if (async[strongParent]) {
						if (strongParent === 'waterfall') {
							this.save(`
								${prfx}
								return arguments[arguments.length - 1](false);
							`);

						} else {
							this.save(`
								${prfx}

								if (typeof arguments[0] === 'function') {
									return arguments[0](false);
								}

								return false;
							`);
						}

					} else {
						this.save(`
							${prfx}
							return false;
						`);
					}

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
					let prfx = `
						__RETURN__ = true;
						${chunk ? `__RETURN_VAL__ = ${chunk};` : ''}
					`;

					if (async[strongParent]) {
						if (strongParent === 'waterfall') {
							this.save(`
								${prfx}
								return arguments[arguments.length - 1](false);
							`);

						} else {
							this.save(`
								${prfx}

								if (typeof arguments[0] === 'function') {
									return arguments[0](false);
								}

								return false;
							`);
						}

					} else {
						this.save(`
							${prfx}
							return false;
						`);
					}

					this.deferReturn = chunk ? true : val;

				} else {
					this.save(val);
				}
			}
		}
	}
);