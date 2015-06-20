/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * The number of deferred return callings
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
		if (!this.tolerateWhitespace) {
			this.skipSpace = true;
		}

		if (this.isReady()) {
			let cb = this.hasParent(this.getGroup('callback'));
			let val = command ?
				this.out(command, true) : this.returnResult();

			if (cb) {
				let str = '';
				let def = ws`
					__RETURN__ = true;
					__RETURN_VAL__ = ${val};
				`;

				let asyncParent;
				if (cb === 'callback') {
					asyncParent = this.hasParent(this.getGroup('async'));
				}

				if (asyncParent) {
					if (this.getGroup('Async')[asyncParent]) {
						str += def;

						if (asyncParent === 'waterfall') {
							str += 'return arguments[arguments.length - 1](__RETURN_VAL__);';

						} else {
							str += ws`
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
					if (!this.getGroup('basicAsync')[cb]) {
						str += ws`
							__RETURN__ = true;
							__RETURN_VAL__ = ${val};
						`;
					}

					str += 'return false;';
					this.deferReturn = cb !== 'final' ?
						1 : 0;
				}

				this.append(str);

			} else {
				this.append(`return ${val};`);
			}
		}
	}
);
