Snakeskin.addDirective(
	'break',

	{
		placement: 'template'
	},

	function () {
		this.startInlineDir();

		var combo = this.getGroup('cycle', 'series');
		var cycles = this.getGroup('cycle'),
			series = this.getGroup('series');

		var inside = this.hasParent(combo),
			insideCallback = this.hasParent(this.getGroup('callback'));

		if (!cycles[inside] && !series[inside]) {
			return this.error((("directive \"" + (this.name)) + "\" can only be used with a cycles or a async series"));
		}

		if (this.isSimpleOutput()) {
			if (cycles[inside]) {
				if (inside === insideCallback) {
					this.save('return false;');

				} else {
					this.save('break;');
				}

			} else {
				if (inside === 'waterfall') {
					this.save('return arguments[arguments.length - 1](false);');

				} else {
					this.save('return arguments[0](false);');
				}
			}

			this.space = true;
		}
	}
);

Snakeskin.addDirective(
	'continue',

	{
		placement: 'template'
	},

	function () {
		this.startInlineDir();

		var combo = this.getGroup('cycle', 'series');
		var cycles = this.getGroup('cycle'),
			series = this.getGroup('series');

		var inside = this.hasParent(combo),
			insideCallback = this.hasParent(this.getGroup('callback'));

		if (!cycles[inside] && !series[inside]) {
			return this.error((("directive \"" + (this.name)) + "\" can only be used with a cycles or a async series"));
		}

		if (this.isSimpleOutput()) {
			if (cycles[inside]) {
				if (inside === insideCallback) {
					this.save('return;');

				} else {
					this.save('continue;');
				}

			} else {
				if (inside === 'waterfall') {
					this.save('return arguments[arguments.length - 1]();');

				} else {
					this.save('return arguments[0]();');
				}
			}

			this.space = true;
		}
	}
);