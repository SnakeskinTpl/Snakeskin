var __NEJS_THIS__ = this;
DirObj.prototype.varCache = {
	init: function () {
		var __NEJS_THIS__ = this;
		return {};
	}
};

Snakeskin.addDirective(
	'var',

	{
		placement: 'template',
		notEmpty: true,
		replacers: {
			':': function (cmd) {
				return cmd.replace(/^:/, 'var ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(this.multiDeclVar(command));
		}
	}
);