/**
 * Вернуть таблицу названий директивы,
 * которые принадлежат к заданным группам
 *
 * @param {...string} names - название группы
 * @return {!Object}
 */
DirObj.prototype.getGroup = function (/*= names */) {var SLICE$0 = Array.prototype.slice;var names = SLICE$0.call(arguments, 0);
	var map = {},
		ignore = {};

	for (var i = -1; ++i < names.length;) {
		var name = names[i],
			group = groups[name];

		if (name === 'callback' && this.inlineIterators) {
			var inline = groups['inlineIterator'];

			for (var key = void 0 in inline) {
				if (!inline.hasOwnProperty(key)) {
					continue;
				}

				ignore[key] = true;
			}
		}

		for (var key$0 = void 0 in group) {
			if (!group.hasOwnProperty(key$0) || ignore[key$0]) {
				continue;
			}

			map[key$0] = true;
		}
	}

	return map;
};

/**
 * Проверить начилие указанной директивы в цепочке структуры,
 * начиная с активной
 *
 * @param {(string|!Object)} name - название директивы или таблица названий
 * @param {Object=} [opt_obj=this.structure] - проверяемый объект
 * @return {(boolean|string)}
 */
DirObj.prototype.has = function (name, opt_obj) {
	var obj = opt_obj || this.structure;

	while (true) {
		var nm = obj.name;

		if (name[nm] || nm === name) {
			if (name[nm]) {
				return nm;
			}

			return true;

		} else if (obj.parent && obj.parent.name !== 'root') {
			obj = obj.parent;

		} else {
			return false;
		}
	}
};

/**
 * Проверить начилие указанной директивы в цепочке структуры
 * (начальная активная директива исключается)
 *
 * @param {(string|!Object)} name - название директивы или таблица названий
 * @return {(boolean|string)}
 */
DirObj.prototype.hasParent = function (name) {
	if (this.structure.parent) {
		return this.has(name, this.structure.parent);
	}

	return false;
};

/**
 * Проверить начилие указанной директивы в цепочке блочной структуры
 * (начальная активная директива исключается)
 *
 * @param {(string|!Object)} name - название директивы или таблица названий
 * @return {(boolean|string)}
 */
DirObj.prototype.hasParentBlock = function (name) {
	if (this.blockStructure && this.blockStructure.parent) {
		return this.has(name, this.blockStructure.parent);
	}

	return false;
};