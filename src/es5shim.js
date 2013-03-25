/*!
 * Полифилы для старых ишаков
 */

if (!Array.prototype.reduce) {
	/**
	 * Рекурсивно привести массив к другому значению
	 * (функция callback принимает результат выполнения предыдущей итерации и актуальный элемент)
	 *
	 * @this {Array}
	 * @param {function(*, *, number, !Array): *} callback - функция, которая будет вызываться для каждого элемента массива
	 * @param {Object=} [opt_initialValue=this[0]] - объект, который будет использоваться как первый элемент при первом вызове callback
	 * @return {*}
	 */
	Array.prototype.reduce = function (callback, opt_initialValue) {
		var i = 0,
			aLength = this.length,
			res;

		if (aLength === 1) { return this[0]; }

		if (typeof opt_initialValue !== 'undefined') {
			res = opt_initialValue;
		} else {
			res = this[0];
		}

		while (++i < aLength) {
			res = callback(res, this[i], i, this);
		}

		return res;
	};
}