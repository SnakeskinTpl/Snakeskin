Snakeskin.addDirective(
	'with',

	{
		placement: 'template',
		sys: true,
		notEmpty: true
	},

	function (command) {
		this.startDir();
		this.scope.push(command);
	},

	function () {
		this.scope.pop();
	}
);