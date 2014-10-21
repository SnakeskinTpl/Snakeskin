var $freeze$0 = Object.freeze;var $defProps$0 = Object.defineProperties;var $TS$0 = ["\n							if (__RETURN__) {\n								return false;\n							}\n						"];$TS$0 = $freeze$0($defProps$0($TS$0, {"raw": {"value": $TS$0}}));var $TS$1 = ["\n							if (__RETURN__) {\n								return arguments[arguments.length - 1](__RETURN_VAL__);\n							}\n						"];$TS$1 = $freeze$0($defProps$0($TS$1, {"raw": {"value": $TS$1}}));var $TS$2 = ["\n							if (__RETURN__) {\n								if (typeof arguments[0] === 'function') {\n									return arguments[0](__RETURN_VAL__);\n								}\n\n								return false;\n							}\n						"];$TS$2 = $freeze$0($defProps$0($TS$2, {"raw": {"value": $TS$2}}));var $TS$3 = ["\n						if (__RETURN__) {\n							return false;\n						}\n					"];$TS$3 = $freeze$0($defProps$0($TS$3, {"raw": {"value": $TS$3}}));var $TS$4 = ["\n					if (__RETURN__) {\n						return __RETURN_VAL__;\n					}\n				"];$TS$4 = $freeze$0($defProps$0($TS$4, {"raw": {"value": $TS$4}}));Snakeskin.addDirective(
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
						this.save(cbws($TS$0



));

					} else if (parent === 'waterfall') {
						this.save(cbws($TS$1



));

					} else {
						this.save(cbws($TS$2







));
					}

					this.deferReturn = 0;

				} else if (this.deferReturn > 1) {
					this.save(cbws($TS$3



));
				}

				if (this.deferReturn !== 0) {
					this.deferReturn++;
				}

			} else if (!async[name]) {
				this.save(cbws($TS$4



));

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
