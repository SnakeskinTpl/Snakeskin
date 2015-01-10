Snakeskin.addDirective(
	'when',

	{
		block: true,
		notEmpty: true,

		group: [
			'async',
			'basicAsync'
		],

		inside: {
			'callback': true
		}
	},

	function (command) {
		this.startDir();
		this.append(`${this.prepareOutput(command, true)}.then(`);
	},

	function () {
		this.append(');');
	}
);
