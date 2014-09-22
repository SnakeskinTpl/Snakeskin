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
			let fnParent = this.hasParent(this.getGroup('callback', 'async'));
			let val = command ?
				this.prepareOutput(command, true) : this.returnResult();

			if (fnParent) {
				let str = '';

				if (fnParent !== 'final') {
					str += `
						__RETURN__ = true;
						__RETURN_VAL__ = ${val};
					`;
				}

				if (this.getGroup('async')[fnParent]) {
					if (fnParent === 'waterfall') {
						str += 'return arguments[arguments.length - 1](__RETURN_VAL__);';

					} else {
						str += `
							if (typeof arguments[0] === 'function') {
								return arguments[0](__RETURN_VAL__);
							}

							return false;
						`;
					}

				} else {
					str += 'return false;';
				}

				this.append(str);
				this.deferReturn = fnParent !== 'final';

			} else {
				this.append(`return ${val};`);
			}
		}
	}
);