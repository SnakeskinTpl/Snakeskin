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
			var cb = this.hasParent(this.getGroup('callback'));
			var val = command ?
				this.prepareOutput(command, true) : this.returnResult();

			if (cb) {
				var str = '';
				var def = (("\
\n					__RETURN__ = true;\
\n					__RETURN_VAL__ = " + val) + ";\
\n				");

				var asyncParent;
				if (cb === 'callback') {
					asyncParent = this.hasParent(this.getGroup('async'));
				}

				if (asyncParent) {
					if (this.getGroup('Async')[asyncParent]) {
						str += def;

						if (asyncParent === 'waterfall') {
							str += 'return arguments[arguments.length - 1](__RETURN_VAL__);';

						} else {
							str += ("\
\n								if (typeof arguments[0] === 'function') {\
\n									return arguments[0](__RETURN_VAL__);\
\n								}\
\n\
\n								return false;\
\n							");
						}

					} else {
						str += 'return false;'
					}

				} else {
					if (!this.getGroup('basicAsync')[cb]) {
						str += (("\
\n							__RETURN__ = true;\
\n							__RETURN_VAL__ = " + val) + ";\
\n						");
					}

					str += 'return false;';
					this.deferReturn = cb !== 'final' ?
						1 : 0;
				}

				this.append(str);

			} else {
				this.append((("return " + val) + ";"));
			}
		}
	}
);
