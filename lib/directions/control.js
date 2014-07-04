Snakeskin.addDirective(
	'break',

	{
		placement: 'template'
	},

	function () {
		this.startInlineDir();

		var combo = this.getGroup('cycle', 'async');
		var cycles = this.getGroup('cycle'),
			async = this.getGroup('async');

		var inside = this.hasParent(combo),
			insideCallback = this.hasParent(this.getGroup('callback'));

		if (!cycles[inside] && !async[inside]) {
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
					this.save(("\
\n						if (typeof arguments[0] === 'function') {\
\n							return arguments[0](false);\
\n						}\
\n\
\n						return false;\
\n					"));
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

		var combo = this.getGroup('cycle', 'async');
		var cycles = this.getGroup('cycle'),
			async = this.getGroup('async');

		var inside = this.hasParent(combo),
			insideCallback = this.hasParent(this.getGroup('callback'));

		if (!cycles[inside] && !async[inside]) {
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
					this.save(("\
\n						if (typeof arguments[0] === 'function') {\
\n							return arguments[0]();\
\n						}\
\n\
\n						return;\
\n					"));
				}
			}

			this.space = true;
		}
	}
);