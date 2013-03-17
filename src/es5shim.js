/*!
 * Полифилы для старых ишаков
 */

if (!Array.prototype.forEach) {
	/**
	 * Перебрать элементы массива
	 * (выполнения цикла нельзя прервать, но для этого можно использовать some или every)
	 *
	 * @this {!Array}
	 * @param {function(this:thisObject, *, number, !Array)} callback - функция, которая будет вызываться для каждого элемента массива
	 * @param {thisObject=} [opt_thisObject] - контекст функции callback
	 * @template thisObject
	 */
	Array.prototype.forEach = function (callback, opt_thisObject) {
		var i = -1,
			aLength = this.length;

		if (!opt_thisObject) {
			while (++i < aLength) {
				callback(this[i], i, this);
			}
		} else {
			while (++i < aLength) {
				callback.call(opt_thisObject, this[i], i, this);
			}
		}
	};
}

if (!Array.prototype.some) {
	/**
	 * Вернуть true, если есть хотя бы один элемент удовлетворяющий условию
	 * (метод прерывает исполнение, когда callback возвращает true)
	 *
	 * @this {!Array}
	 * @param {function(this:thisObject, *, number, !Array): (boolean|void)} callback - функция, которая будет вызываться для каждого элемента массива
	 * @param {thisObject=} [opt_thisObject] - контекст функции callback
	 * @template thisObject
	 * @return {boolean}
	 */
	Array.prototype.some = function (callback, opt_thisObject) {
		var i = -1,
			aLength = this.length,
			res;

		if (!opt_thisObject) {
			while (++i < aLength) {
				res = callback(this[i], i, this);
				if (res) { return true; }
			}
		} else {
			while (++i < aLength) {
				res = callback.call(opt_thisObject, this[i], i, this);
				if (res) { return true; }
			}
		}

		return false;
	};
}

if (!Array.prototype.reduce) {
	/**
	 * Рекурсивно привести массив к другому значению
	 * (функция callback принимает результат выполнения предыдущей итерации и актуальный элемент)
	 *
	 * @this {!Array}
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