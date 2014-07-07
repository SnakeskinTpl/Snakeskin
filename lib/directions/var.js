DirObj.prototype.varCache = {
	init: function () {
		return {};
	}
};

Snakeskin.addDirective(
	'var',

	{
		notEmpty: true,
		replacers: {
			':': function(cmd)  {return cmd.replace(/^:/, 'var ')}
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(this.multiDeclVar(command));
		}
	}
);