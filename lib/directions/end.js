Snakeskin.addDirective(
	'end',

	{
		replacers: {
			'/': function(cmd)  {return cmd.replace(/^\//, 'end ')}
		}
	},

	function (command) {var this$0 = this;
		var struct = this.structure,
			name = struct.name;

		if (!struct.parent) {
			return this.error(("invalid call \"end\""));
		}

		if (command && command !== name) {
			return this.error((("invalid closing directive, expected: \"" + name) + ("\", declared: \"" + command) + "\""));
		}

		if (inside[name]) {
			this.strongSpace = struct.parent.strong;
		}

		var destruct = Snakeskin.Directions[(("" + name) + "End")],
			isSimpleOutput = this.isSimpleOutput();

		if (destruct) {
			destruct.apply(this, arguments);

		} else if (!struct.sys && isSimpleOutput) {
			this.save('};');
		}

		Snakeskin.Directions[(("" + name) + "BaseEnd")].apply(this, arguments);
		this.endDir();

		struct = this.structure;
		name = struct.name;

		if (this.deferReturn && isSimpleOutput) {
			var async = this.getGroup('async');

			if (this.getGroup('callback')[name]) {
				var parent = struct.parent.name;

				if (async[parent]) {
					if (parent === 'waterfall') {
						this.save(("\
\n							if (__RETURN__) {\
\n								return arguments[arguments.length - 1](false);\
\n							}\
\n						"));

					} else {
						this.save(("\
\n							if (__RETURN__) {\
\n								if (typeof arguments[0] === 'function') {\
\n									return arguments[0](false);\
\n								}\
\n\
\n								return false;\
\n							}\
\n						"));
					}

				} else {
					this.save(("\
\n						if (__RETURN__) {\
\n							return false;\
\n						}\
\n					"));
				}

			} else if (!async[name]) {
				this.save((("\
\n					if (__RETURN__) {\
\n						" + (this.deferReturn !== true ? this.deferReturn : 'return __RETURN_VAL__;')) + "\
\n					}\
\n				"));

				this.deferReturn = null;
			}
		}

		this.toQueue(function()  {
			this$0.startInlineDir();
		});
	}
);