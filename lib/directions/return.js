/**
 * Текст, который будет возвращён шаблоном
 * после выхода из директив группы callback
 * @type {(string|boolean)}
 */
DirObj.prototype.deferReturn = false;

Snakeskin.addDirective(
	'return',

	{
		placement: 'template'
	},

	function (command) {
		this.startInlineDir();
		this.space = true;

		if (this.isReady()) {
			var fnParent = this.hasParent(this.getGroup('callback', 'async'));
			var val = command ?
				this.prepareOutput(command, true) : this.returnResult();

			if (fnParent) {
				var str = (("\
\n					__RETURN__ = true;\
\n					__RETURN_VAL__ = " + val) + ";\
\n				");

				if (this.getGroup('async')[fnParent]) {
					if (fnParent === 'waterfall') {
						str += (("return arguments[arguments.length - 1](" + val) + ");");

					} else {
						str += (("\
\n							if (typeof arguments[0] === 'function') {\
\n								return arguments[0](" + val) + ");\
\n							}\
\n\
\n							return false;\
\n						");
					}

				} else {
					str += 'return false';
				}

				this.append(str);
				this.deferReturn = true;

			} else {
				this.append((("return " + val) + ";"));
			}
		}
	}
);