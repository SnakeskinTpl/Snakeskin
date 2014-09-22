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
				let def = `
					__RETURN__ = true;
					__RETURN_VAL__ = ${val};
				`;

				let asyncParent;
				if (callback === 'callback') {
					asyncParent = this.hasParent(this.getGroup('async'));
				}

				if (asyncParent) {
					if (this.getGroup('Async')[asyncParent]) {
						str += def;

						if (asyncParent === 'waterfall') {
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
						str += 'return false;'
					}

				} else {
					if (!this.getGroup('basicAsync')[callback]) {
						str += `
							__RETURN__ = true;
							__RETURN_VAL__ = ${val};
						`;
					}

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