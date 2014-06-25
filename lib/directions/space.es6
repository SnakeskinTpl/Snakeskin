Snakeskin.addDirective(
	'&',

	{
		placement: 'template'
	},

	function () {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.space = true;
		}
	}
);

Snakeskin.addDirective(
	'&+',

	{
		placement: 'template'
	},

	function () {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.superStrongSpace = true;
		}
	}
);

Snakeskin.addDirective(
	'&-',

	{
		placement: 'template'
	},

	function () {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.superStrongSpace = false;
		}
	}
);

Snakeskin.addDirective(
	'ignore',

	{
		placement: 'global'
	},

	function (command) {
		this.startInlineDir();

		var rgxp = '[';
		var arr = command.split(' ');

		for (let i = arr.length; i--;) {
			if (arr[i]) {
				if (arr[i].length !== 2 || arr[i].charAt(0) !== '%') {
					return this.error(`invalid "${this.name}" declaration (${command}, ${arr[i]})`);
				}

				rgxp += `\\${arr[i].charAt(1)}`;
			}
		}

		rgxp += ']';
		this.ignoreRgxp = new RegExp(rgxp);
	}
);