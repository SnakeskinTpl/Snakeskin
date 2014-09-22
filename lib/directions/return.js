/**
 * Количество отложенных return
 * @type {number}
 */
DirObj.prototype.deferReturn = 0;

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
				var str = '';

				if (fnParent !== 'final') {
					str += (("\
\n						__RETURN__ = true;\
\n						__RETURN_VAL__ = " + val) + ";\
\n					");
				}

				if (this.getGroup('async')[fnParent]) {
					if (fnParent === 'waterfall') {
						str += 'return arguments[arguments.length - 1](__RETURN_VAL__);';

					} else {
						str += ("\
\n							if (typeof arguments[0] === 'function') {\
\n								return arguments[0](__RETURN_VAL__);\
\n							}\
\n\
\n							return false;\
\n						");
					}

				} else {
					str += 'return false;';
					this.deferReturn = fnParent !== 'final' ?
						1 : 0;
				}

				this.append(str);

			} else {
				this.append((("return " + val) + ";"));
			}
		}
	}
);