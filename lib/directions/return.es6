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
			let callback = this.hasParent(this.getGroup('callback'));
			let val = command ?
				this.prepareOutput(command, true) : this.returnResult();

			if (callback) {
				let str = '';

				if (callback !== 'final') {
					str += `
						__RETURN__ = true;
						__RETURN_VAL__ = ${val};
					`;
				}

				let asyncParent;

				if (callback === 'callback') {
					asyncParent = this.hasParent(this.getGroup('Async'));
				}

				if (asyncParent) {
					if (asyncParent === 'waterfall') {
						str += 'return arguments[arguments.length - 1](__RETURN_VAL__);';

					} else {
						str += 'return arguments[0](__RETURN_VAL__);';
					}

				} else {
					str += 'return false;';
					this.deferReturn = callback !== 'final' ?
						1 : 0;
				}

				this.append(str);

			} else {
				this.append(`return ${val};`);
			}
		}
	}
);