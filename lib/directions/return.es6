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
				let val = this.prepareOutput('break __I_PROTO__;', true);

				if (useForEach) {
					this.save('__RETURN__ = true; return false;');
					this.deferReturn = val;

				} else {
					this.save(val);
				}

			} else {
				let val;

				if (command) {
					val = `return ${this.prepareOutput(command, true)};`;

				} else {
					val = `return __RESULT__${this.stringBuffer ? '.join(\'\')' : ''};`;
				}

				if (useForEach) {
					this.save('__RETURN__ = true; return false;');
					this.deferReturn = val;

				} else {
					this.save(val);
				}
			}
		}
	}
);