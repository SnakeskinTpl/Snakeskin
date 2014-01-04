var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

DirObj.prototype.varCache = {
	init: function () {
		var __NEJS_THIS__ = this;
		return {};
	}
};

DirObj.prototype.multiDeclVar = function (str) {
	var __NEJS_THIS__ = this;
	var isSys = 0,
		cache = '';

	var final = 'var ';

	var sysTable = {
		'(': true,
		'[': true,
		'{': true
	};

	var closeSysTable = {
		')': true,
		']': true,
		'}': true
	};

	var length = str.length;
	for (var i = 0; i < length; i++) {
		var el = str.charAt(i);

		if (sysTable[el]) {
			isSys++;

		} else if (closeSysTable[el]) {
			isSys--;

		} else if ((el === ',' || i === length - 1) && !isSys) {
			if (i === length - 1) {
				cache += el;
			}

			var parts = cache.split('='),
				realVar = this.declVar(parts[0].trim());

			parts[0] = realVar + ' ';
			final += this.prepareOutput(parts.join('=') + ',', true);

			cache = '';
			continue;
		}

		cache += el;
	}

	if (isSys) {
		throw this.error('Invalid syntax');
	}

	return final.slice(0, -1) + ';';
};

Snakeskin.addDirective(
	'var',

	{
		placement: 'template',
		replacers: {
			':': function (cmd) {
				return cmd.replace(/^:/, 'var ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!command) {
			throw this.error('Invalid syntax');
		}

		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(this.multiDeclVar(command));
		}
	}
);