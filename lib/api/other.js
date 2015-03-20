/*!
 * Some helpers
 */

/**
 * Returns a list of template names
 * that are involved in an inheritance chain
 *
 * @param {string} name - the template name
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
 * Clears cache scope of a template
 * @param {string} name - the template name
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
 * Returns diff of a directive command and directive declaration
 *
 * @param {number} length - the command length
 * @return {number}
 */
DirObj.prototype.getDiff = function (length) {
	return length + Number(this.needPrfx) + 1;
};

/**
 * Resets a layer of compilation parameters
 * @return {!DirObj}
 */
DirObj.prototype.popParams = function () {
	this.params.pop();

	forIn(this.params[this.params.length - 1], (el, key) => {
		this[key] = el;
	});

	return this;
};
