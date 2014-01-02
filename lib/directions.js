var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Добавить новую директиву
 *
 * @param {string} name - название директивы
 *
 * @param {Object} params - дополнительные параметры
 * @param {Object} [params.replacers] - объект с указанием сокращений директив
 * @param {Object} [params.strongDirs] - объект с указанием директив, которые могут быть вложены в эту
 * @param {?boolean=} [params.sysDir=false] - если true, то директива считается системной
 *
 * @param {function(this:DirObj, string, number, Object)} constr - конструктор директивы
 * @param {?function(this:DirObj, string, number, Object)=} opt_end - окончание директивы
 */
Snakeskin.addDirective = function (name, params, constr, opt_end) {
	var __NEJS_THIS__ = this;
	params = params || {};

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

	sysDirs[name] = !!params.sysDir;

	Snakeskin.Directions[name] = function (command, commandLength) {
		var __NEJS_THIS__ = this;
		if (params.inBlock) {
			if (!this.structure.parent) {
				throw this.error('Directive "' + params.name + '" can only be used within a "template" or "proto", ' +
					this.genErrorAdvInfo(this.info)
				);
			}
		}

		if (params.inGlobalSpace) {
			if (this.structure.parent) {
				throw this.error('Directive "' + params.name + '" can be used only within the global space, ' +
					this.genErrorAdvInfo(this.info)
				);
			}
		}

		constr.apply(this, arguments);
	};

	Snakeskin.Directions[name + 'End'] = opt_end;
};