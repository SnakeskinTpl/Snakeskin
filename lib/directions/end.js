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
			let group = this.getGroup('rootTemplate');
			if (!(this.renderAs && group[name] && group[command])) {
				return this.error(`invalid closing directive, expected: "${name}", declared: "${command}"`);
			}
		}

		if (inside[name]) {
			this.chainSpace = struct.parent.strong;
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
					let basicAsync = this.getGroup('basicAsync');

					if (basicAsync[name] || basicAsync[parent]) {
						this.save(/* cbws */`
							if (__RETURN__) {
								return false;
							}
						`);

					} else if (parent === 'waterfall') {
						this.save(/* cbws */`
							if (__RETURN__) {
								return arguments[arguments.length - 1](__RETURN_VAL__);
							}
						`);

					} else {
						this.save(/* cbws */`
							if (__RETURN__) {
								if (typeof arguments[0] === 'function') {
									return arguments[0](__RETURN_VAL__);
								}

								return false;
							}
						`);
					}

					this.deferReturn = 0;

				} else if (this.deferReturn > 1) {
					this.save(/* cbws */`
						if (__RETURN__) {
							return false;
						}
					`);
				}

				if (this.deferReturn !== 0) {
					this.deferReturn++;
				}

			} else if (!async[name]) {
				this.save(/* cbws */`
					if (__RETURN__) {
						return __RETURN_VAL__;
					}
				`);

				this.deferReturn = 0;
			}
		}

		this.toQueue(() => {
			this.startInlineDir();
		});
	}
);

Snakeskin.addDirective(
	'__end__',

	{
		alias: true
	},

	function () {
		Snakeskin.Directions['end'].apply(this, arguments);
	}
);
