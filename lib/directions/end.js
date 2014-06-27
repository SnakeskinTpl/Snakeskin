Snakeskin.addDirective(
	'end',

	{
		replacers: {
			'/': function(cmd)  {return cmd.replace(/^\//, 'end ')}
		}
	},

	function (command) {var this$0 = this;
		var struct = this.structure;

		if (!struct.parent) {
			return this.error(("invalid call \"end\""));
		}

		// Если в директиве end указано название закрываемой директивы,
		// то проверяем, чтобы оно совпадало с реально закрываемой директивой
		if (command && command !== struct.name) {
			return this.error((("invalid closing tag, expected: \"" + (struct.name)) + ("\", declared: \"" + command) + "\""));
		}

		if (inside[struct.name]) {
			this.strong = null;
			this.strongSpace = false;
		}

		var strong = this.strongStack,
			last = strong.length - 1;

		if (strong[last] && strong[last].child === struct.name) {
			this.strong = strong.dir;
			this.strongSpace = true;
			strong.pop();
		}

		var destruct = Snakeskin.Directions[(("" + (struct.name)) + "End")];

		if (destruct) {
			destruct.apply(this, arguments);

		} else if (!struct.sys && this.isSimpleOutput()) {
			this.save('};');
		}

		this.endDir();
		this.toQueue(function()  {
			this$0.startInlineDir();
		});
	}
);