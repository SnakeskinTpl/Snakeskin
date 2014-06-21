Snakeskin.addDirective(
	'return',

	{
		placement: 'template'
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.space = true;
			if (this.proto) {
				this.save(this.prepareOutput('break __I_PROTO__;', true));

			} else {
				if (command) {
					this.save(this.prepareOutput(`return ${command};`, true));

				} else {
					this.save('return __SNAKESKIN_RESULT__;');
				}
			}
		}
	}
);