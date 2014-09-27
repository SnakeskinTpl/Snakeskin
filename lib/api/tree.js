/*!
 * API для работы с деревом шаблона
 */

/**
 * Проверить начилие указанной директивы в цепочке структуры,
 * начиная с активной
 *
 * @param {(string|!Object)} name - название директивы или таблица названий
 * @param {Object=} [opt_obj=this.structure] - проверяемый объект
 * @param {?boolean=} [opt_returnObj=false] - если true, то в качестве ответа
 *     вернётся ссылка на найденный объект (если таковой есть)
 *
 * @return {(boolean|string|!Object)}
 */
DirObj.prototype.has = function (name, opt_obj, opt_returnObj) {
	var obj = opt_obj || this.structure;

	while (true) {
		var nm = obj.name;

		if (name[nm] || nm === name) {
			if (name[nm]) {
				return opt_returnObj ? obj : nm;
			}

			return opt_returnObj ? obj: true;

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
 * @param {?boolean=} [opt_returnObj=false] - если true, то в качестве ответа
 *     вернётся ссылка на найденный объект (если таковой есть)
 *
 * @return {(boolean|string)}
 */
DirObj.prototype.hasParent = function (name, opt_returnObj) {
	if (this.structure.parent) {
		return this.has(name, this.structure.parent, opt_returnObj);
	}

	return false;
};

/**
 * Проверить начилие указанной директивы в цепочке блочной структуры
 * (начальная активная директива исключается)
 *
 * @param {(string|!Object)} name - название директивы или таблица названий
 * @param {?boolean=} [opt_returnObj=false] - если true, то в качестве ответа
 *     вернётся ссылка на найденный объект (если таковой есть)
 *
 * @return {(boolean|string)}
 */
DirObj.prototype.hasParentBlock = function (name, opt_returnObj) {
	if (this.blockStructure && this.blockStructure.parent) {
		return this.has(name, this.blockStructure.parent, opt_returnObj);
	}

	return false;
};
