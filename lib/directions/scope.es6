Snakeskin.addDirective(
	'with',

	{
		sys: true,
		block: true,
		notEmpty: true
	},

	function (command) {
		this.startDir();
		this.scope.push(this.prepareOutput(command, true));
	},

	function () {
		this.scope.pop();
	}
);