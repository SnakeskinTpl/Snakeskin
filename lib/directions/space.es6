Snakeskin.addDirective(
	'&',

	{
		placement: 'template'
	},

	function () {
		this.startInlineDir();
		this.space = true;
	}
);

Snakeskin.addDirective(
	'__&__',

	{
		group: 'ignore'
	},

	function () {
		this.startInlineDir();
		this.space = true;
	}
);

Snakeskin.addDirective(
	'&+',

	{
		placement: 'template'
	},

	function () {
		this.startInlineDir();
		this.superStrongSpace++;
	}
);

Snakeskin.addDirective(
	'&-',

	{
		placement: 'template'
	},

	function () {
		this.startInlineDir();

		if (this.superStrongSpace) {
			this.superStrongSpace--;
		}

		if (!this.superStrongSpace) {
			this.text = true;
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
					return this.error(`invalid "${this.name}" declaration`);
				}

				rgxp += `\\${arr[i].charAt(1)}`;
			}
		}

		rgxp += ']';
		this.ignoreRgxp = new RegExp(rgxp);
	}
);