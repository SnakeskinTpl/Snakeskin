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

		if (!this.parentTplName && !this.generator && !this.proto && !this.protoLink) {
			return this.error(`directive "${this.name}" can be used only with a generator`);
		}

		this.startInlineDir();

		if (command) {
			this.append(`yield ${this.prepareOutput(command, true)};`);

		} else {
			this.append(`
				yield ${this.returnResult()};
				__RESULT__ = ${this.declResult()};
			`);
		}
	}
);