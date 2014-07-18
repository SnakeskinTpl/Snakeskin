Snakeskin.addDirective(
	'yield',

	{
		placement: 'template'
	},

	function (command) {
		var cb = this.has(this.getGroup('callback'));

		if (cb) {
			return this.error(`directive "${this.name}" can't be used within the "${cb}"`);
		}

		this.startInlineDir();
		if (this.isSimpleOutput()) {
			if (command) {
				this.save(`yield ${this.prepareOutput(command, true)};`);

			} else {
				this.save(`
					yield ${this.returnResult()};
					__RESULT__ = ${this.declResult()};
				`);
			}
		}
	}
);