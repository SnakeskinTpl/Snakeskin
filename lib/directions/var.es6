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
			':': (cmd) => cmd.replace(':', 'var ')
		}
	},

	function (command) {
		this.startInlineDir();
		this.append(this.multiDeclVar(command));
	}
);