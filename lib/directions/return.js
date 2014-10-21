var $freeze$0 = Object.freeze;var $defProps$0 = Object.defineProperties;var $TS$0 = ["\n					__RETURN__ = true;\n					__RETURN_VAL__ = ", ";\n				"];$TS$0 = $freeze$0($defProps$0($TS$0, {"raw": {"value": $TS$0}}));var $TS$1 = ["\n								if (typeof arguments[0] === 'function') {\n									return arguments[0](__RETURN_VAL__);\n								}\n\n								return false;\n							"];$TS$1 = $freeze$0($defProps$0($TS$1, {"raw": {"value": $TS$1}}));var $TS$2 = ["\n							__RETURN__ = true;\n							__RETURN_VAL__ = ", ";\n						"];$TS$2 = $freeze$0($defProps$0($TS$2, {"raw": {"value": $TS$2}}));/**
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
		this.skipSpace = true;

		if (this.isReady()) {
			var cb = this.hasParent(this.getGroup('callback'));
			var val = command ?
				this.prepareOutput(command, true) : this.returnResult();

			if (cb) {
				var str = '';
				var def = cbws($TS$0

, val
);

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
							str += cbws($TS$1





);
						}

					} else {
						str += 'return false;'
					}

				} else {
					if (!this.getGroup('basicAsync')[cb]) {
						str += cbws($TS$2

, val
);
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
