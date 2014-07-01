Snakeskin.addDirective(
	'return',

	{
		placement: 'template'
	},

	function (command) {
		this.startInlineDir();

		var useForEach = this.hasParent({
			'proto': true,
			'$forEach': true
		}) === '$forEach';

		if (this.isSimpleOutput()) {
			this.space = true;
			if (this.proto && !command) {
				var val = this.prepareOutput('break __I_PROTO__;', true);

				if (useForEach) {
					this.save('__RETURN__ = true; return false;');
					this.deferReturn = val;

				} else {
					this.save(val);
				}

			} else {
				var val$0;

				if (command) {
					val$0 = (("return " + (this.prepareOutput(command, true))) + ";");

				} else {
					val$0 = (("return __RESULT__" + (this.stringBuffer ? '.join(\'\')' : '')) + ";");
				}

				if (useForEach) {
					this.save('__RETURN__ = true; return false;');
					this.deferReturn = val$0;

				} else {
					this.save(val$0);
				}
			}
		}
	}
);