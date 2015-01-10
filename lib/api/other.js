/*!
 * Различные вспомогательные методы и функции
 */

/**
 * Вернуть список названий шаблонов,
 * которые участвуют в цепи наследования указанного
 *
 * @param {string} name - имя шаблона
 * @return {!Array}
 */
function getExtList(name) {
	if (extListCache[name]) {
		return extListCache[name].slice();
	}

	var res = [];
	while (name = extMap[name]) {
		res.unshift(name);
	}

	extListCache[name] = res;
	return res.slice();
}

/**
 * Очистить кеш областей видимости заданного шаблона
 * @param {string} name - имя шаблона
 */
function clearScopeCache(name) {
	forIn(scopeCache, (cluster, key) => {
		if (key === 'template') {
			if (cluster[name] && cluster[name].parent) {
				delete cluster[name].parent.children[name];
			}

		} else {
			forIn(cluster[name], (el) => {
				if (el.parent) {
					delete el.parent.children[name];
				}
			});
		}

		delete cluster[name];
	});
}

/**
 * Вернуть значение разницы длины команды с учётом типа декларации директивы
 *
 * @param {number} length - исходная длина
 * @return {number}
 */
DirObj.prototype.getDiff = function (length) {
	return length + Number(this.needPrfx) + 1;
};

/**
 * Сбросить слой параметров компиляции
 * @return {!DirObj}
 */
DirObj.prototype.popParams = function () {
	this.params.pop();

	forIn(this.params[this.params.length - 1], (el, key) => {
		this[key] = el;
	});

	return this;
};
