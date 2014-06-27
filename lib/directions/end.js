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

		if (this.structure.name !== '$forEach' && this.deferReturn) {
			this.save((("if (__RETURN__) { " + (this.deferReturn)) + " }"));
			this.deferReturn = null;
		}

		this.toQueue(function()  {
			this$0.startInlineDir();
		});
	}
);