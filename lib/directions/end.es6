Snakeskin.addDirective(
	'end',

	{
		replacers: {
			'/': (cmd) => cmd.replace(/^\//, 'end ')
		}
	},

	function (command) {
		var struct = this.structure,
			name = struct.name;

		if (!struct.parent) {
			return this.error(`invalid call "end"`);
		}

		if (command && command !== name) {
			if (!(this.interface && this.getGroup('rootTemplate')[name])) {
				return this.error(`invalid closing directive, expected: "${name}", declared: "${command}"`);
			}
		}

		if (inside[name]) {
			this.strongSpace = struct.parent.strong;
		}

		var destruct = Snakeskin.Directions[`${name}End`],
			isSimpleOutput = this.isSimpleOutput();

		if (destruct) {
			destruct.apply(this, arguments);

		} else if (!struct.sys && isSimpleOutput) {
			this.save('};');
		}

		Snakeskin.Directions[`${name}BaseEnd`].apply(this, arguments);
		this.endDir();

		struct = this.structure;
		name = struct.name;

		if (this.deferReturn && isSimpleOutput) {
			let async = this.getGroup('async');

			if (this.getGroup('callback')[name]) {
				let parent = struct.parent.name;

				if (async[parent]) {
					if (parent === 'waterfall') {
						this.save(`
							if (__RETURN__) {
								return arguments[arguments.length - 1](false);
							}
						`);

					} else {
						this.save(`
							if (__RETURN__) {
								if (typeof arguments[0] === 'function') {
									return arguments[0](false);
								}

								return false;
							}
						`);
					}

				} else {
					this.save(`
						if (__RETURN__) {
							return false;
						}
					`);
				}

			} else if (!async[name]) {
				this.save(`
					if (__RETURN__) {
						${this.deferReturn !== true ? this.deferReturn : 'return __RETURN_VAL__;'}
					}
				`);

				this.deferReturn = null;
			}
		}

		this.toQueue(() => {
			this.startInlineDir();
		});
	}
);