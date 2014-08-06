/**
 * Таблица созданных переменных
 */
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
			':': function(cmd)  {return cmd.replace(':', 'var ')}
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isReady()) {
			this.append(this.multiDeclVar(command));
		}
	}
);