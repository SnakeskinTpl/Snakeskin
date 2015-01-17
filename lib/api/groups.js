{
	let cache = {};

	/**
	 * Вернуть таблицу названий директив,
	 * которые принадлежат к заданным группам
	 *
	 * @param {...string} names - название группы
	 * @return {!Object}
	 */
	DirObj.prototype.getGroup = function (names) {
		var cacheKey = null,
			inline = this.inlineIterators;

		if (JSON_SUPPORT) {
			let args = [];

			for (let i = -1; ++i < arguments.length;) {
				args.push(arguments[i]);
			}

			cacheKey = args.join();
			if (cache[inline] && cache[inline][cacheKey]) {
				return clone(cache[inline][cacheKey]);
			}
		}

		var map = {},
			ignore = {};

		for (let i = -1; ++i < arguments.length;) {
			let name = arguments[i],
				group = groups[name];

			if (name === 'callback' && inline) {
				forIn(groups['inlineIterator'], (el, key) => {
					ignore[key] = true;
				});
			}

			forIn(group, (el, key) => {
				if (ignore[key]) {
					return;
				}

				map[key] = true;
			});
		}

		if (JSON_SUPPORT) {
			cache[inline] = cache[inline] || {};
			cache[inline][cacheKey] = clone(map);
		}

		return map;
	};
}
