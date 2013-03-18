/*!
 * Управление конечным кодом
 */

/**
 * Директива cut
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {!Array.<string>} vars.quotContent - массив строк
 */
Snakeskin.Directions['cut'] = function (command, commandLength, vars) {
	command = this._uescape(command, vars.quotContent);

	if (!this.write[command]) {
		this.write[command] = false;
	}
};

/**
 * Директива save
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {!Array.<string>} vars.quotContent - массив строк
 */
Snakeskin.Directions['save'] = function (command, commandLength, vars) {
	this.write[this._uescape(command, vars.quotContent)] = true;
};