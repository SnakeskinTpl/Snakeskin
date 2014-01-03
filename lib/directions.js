var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Добавить новую директиву в пространство имён шаблонизатора
 *
 * @param {string} name - название директивы
 * @param {Object} params - дополнительные параметры
 *
 * @param {?string=} [params.placement] - если true, то делается проверка,
 *     где именно размещена директива ('global', 'template', ...)
 *
 * @param {?boolean=} [params.sysDir=false] - если true, то директива считается системной
 *
 * @param {Object} [params.replacers] - объект коротких сокращений директивы
 * @param {Object} [params.strongDirs] - объект директив, которые могут быть вложены в исходную
 *
 * @param {function(this:DirObj, string, number)} constr - конструктор директивы
 * @param {?function(this:DirObj, string, number)=} opt_end - окончание директивы
 */
Snakeskin.addDirective = function (name, params, constr, opt_end) {
	var __NEJS_THIS__ = this;
	params = params || {};
	sysDirs[name] = !!params.sysDir;

	if (params.replacers) {
		var repls = params.replacers;

		for (var key in repls) {
			if (!repls.hasOwnProperty(key)) {
				continue;
			}

			replacers[key] = repls[key];
		}
	}

	if (params.strongDirs) {
		var dirs = params.strongDirs;

		for (var key$0 in dirs) {
			if (!dirs.hasOwnProperty(key$0)) {
				continue;
			}

			strongDirs[key$0] = dirs[key$0];
		}
	}

	Snakeskin.Directions[name] = function (dir, command, commandLength) {
		var __NEJS_THIS__ = this;
		switch (params.placement) {
			case 'template': {
				if (!dir.structure.parent) {
					throw dir.error('Directive "' + name + '" can only be used within a "template" or "proto"');
				}
			} break;

			case 'global': {
				if (dir.structure.parent) {
					throw dir.error('Directive "' + name + '" can be used only within the global space');
				}
			} break;

			default: {
				if (params.placement) {
					if (dir.hasParent(params.placement)) {
						throw dir.error('Directive "' + name + '" can be used only within a "' + params.placement + '"');
					}
				}
			}
		}

		dir.name = name;

		if (dir.strongDir && strongDirs[dir.strongDir][name]) {
			dir.returnStrongDir = {
				child: name,
				dir: dir.strongDir
			};

			dir.strongDir = null;
			dir.strongSpace = false;
		}

		constr.call(dir, command, commandLength);

		if (dir.inlineDir === true) {
			dir.inlineDir = null;
			dir.structure = dir.structure.parent;
		}

		if (strongDirs[name]) {
			dir.strongDir = name;
			dir.strongSpace = true;
		}
	};

	Snakeskin.Directions[name + 'End'] = opt_end;
};