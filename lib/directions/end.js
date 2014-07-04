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
			return this.error((("invalid closing tag, expected: \"" + name) + ("\", declared: \"" + command) + "\""));
		}

		if (inside[name]) {
			this.strongSpace = struct.parent.strong;
		}

		var destruct = Snakeskin.Directions[(("" + name) + "End")];

		if (destruct) {
			destruct.apply(this, arguments);

		} else if (!struct.sys && this.isSimpleOutput()) {
			this.save('};');
		}

		this.endDir();

		struct = this.structure;
		name = struct.name;

		if (this.deferReturn) {
			var series = this.getGroup('series');

			if (this.getGroup('callback')[name]) {
				var parent = struct.parent.name;

				if (series[parent]) {
					if (parent === 'waterfall') {
						this.save('return arguments[arguments.length - 1](false);');

					} else {
						this.save('return arguments[0](false);');
					}

				} else {
					this.save('return false;');
				}

			} else if (!series[name]) {
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