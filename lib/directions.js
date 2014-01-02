var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Добавить новую директиву
 *
 * @param {string} name - название директивы
 * @param {Object} params - дополнительные параметры
 *
 * @param {?boolean=} [params.block=false] - если true, то директива может находиться только внутри шаблона или прототипа
 * @param {?boolean=} [params.global=false] - если true, то директива может находиться только в глобальном пространстве
 * @param {?boolean=} [params.sysDir=false] - если true, то директива считается системной
 *
 * @param {Object} [params.replacers] - объект с указанием сокращений директив
 * @param {Object} [params.strongDirs] - объект с указанием директив, которые могут быть вложены в исходную
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

	Snakeskin.Directions[name] = function (command, commandLength) {
		var __NEJS_THIS__ = this;
		if (params.block && !this.structure.parent) {
			throw this.error('Directive "' + name + '" can only be used within a "template" or "proto"');
		}

		if (params.global && this.structure.parent) {
			throw this.error('Directive "' + name + '" can be used only within the global space');
		}

		constr.apply(this, arguments);
	};

	Snakeskin.Directions[name + 'End'] = opt_end;
};