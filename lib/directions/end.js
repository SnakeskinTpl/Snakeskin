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
			var group = this.getGroup('rootTemplate');
			if (!(this.renderAs && group[name] && group[command])) {
				return this.error((("invalid closing directive, expected: \"" + name) + ("\", declared: \"" + command) + "\""));
			}
		}

		if (inside[name]) {
			this.chainSpace = struct.parent.strong;
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
					var basicAsync = this.getGroup('basicAsync');

					if (basicAsync[name] || basicAsync[parent]) {
						this.save(/* cbws */("\
\n							if (__RETURN__) {\
\n								return false;\
\n							}\
\n						"));

					} else if (parent === 'waterfall') {
						this.save(/* cbws */("\
\n							if (__RETURN__) {\
\n								return arguments[arguments.length - 1](__RETURN_VAL__);\
\n							}\
\n						"));

					} else {
						this.save(/* cbws */("\
\n							if (__RETURN__) {\
\n								if (typeof arguments[0] === 'function') {\
\n									return arguments[0](__RETURN_VAL__);\
\n								}\
\n\
\n								return false;\
\n							}\
\n						"));
					}

					this.deferReturn = 0;

				} else if (this.deferReturn > 1) {
					this.save(/* cbws */("\
\n						if (__RETURN__) {\
\n							return false;\
\n						}\
\n					"));
				}

				if (this.deferReturn !== 0) {
					this.deferReturn++;
				}

			} else if (!async[name]) {
				this.save(/* cbws */("\
\n					if (__RETURN__) {\
\n						return __RETURN_VAL__;\
\n					}\
\n				"));

				this.deferReturn = 0;
			}
		}

		this.toQueue(function()  {
			this$0.startInlineDir();
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
