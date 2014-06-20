/**
 * Добавить новую директиву в пространство имён Snakeskin
 *
 * @param {string} name - название добавляемой директивы
 * @param {Object} params - дополнительные параметры
 *
 * @param {?boolean=} [params.text=false] - если true, то декларируется, что директива выводится как текст
 * @param {?string=} [params.placement] - если указано, то делается проверка
 *     где именно размещена директива ('global', 'template', ...)
 *
 * @param {?boolean=} [params.notEmpty=false] - если true, то директива не может быть "пустой"
 * @param {?boolean=} [params.sys=false] - если true, то директива считается системной
 *
 * @param {Object} [params.replacers] - объект коротких сокращений директивы
 * @param {Object} [params.strongDirs] - объект директив, которые могут быть вложены в исходную
 *
 * @param {function(this:DirObj, string, number, (boolean|number))} constr - конструктор директивы
 * @param {?function(this:DirObj, string, number, (boolean|number))=} opt_end - окончание (деструктор) директивы
 */
Snakeskin.addDirective = function (name, params, constr, opt_end) {
	params = params || {};
	sysDirs[name] = !!params.sys;

	if (params.replacers) {
		var repls = params.replacers;

		for (var key in repls) {
			if (!repls.hasOwnProperty(key)) {
				continue;
			}

			replacers[key] = repls[key];
		}
	}

	strongDirs[name] = params.strongDirs;
	Snakeskin.Directions[name] = function (dir, command, commandLength, jsDoc) {
		switch (params.placement) {
			case 'template': {
				if (!dir.structure.parent) {
					throw dir.error('Directive "' + name + '" can only be used within a "template", "interface", "placeholder" or "proto"');
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

		if (params.notEmpty && !command) {
			throw this.error('Invalid syntax, directive "' + name + '" should have a body');
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

		if (params.text) {
			dir.text = true;
		}

		constr.call(dir, command, commandLength, jsDoc);

		if (dir.inlineDir === true) {
			var sname = dir.structure.name;

			dir.inlineDir = null;
			dir.structure = dir.structure.parent;

			if (dir.blockStructure && sname === 'const') {
				dir.blockStructure = dir.blockStructure.parent;
			}
		}

		if (strongDirs[name]) {
			dir.strongDir = name;
			dir.strongSpace = true;
		}
	};

	Snakeskin.Directions[name + 'End'] = opt_end;
};

//#include ./directions/bem.js
//#include ./directions/block.js
//#include ./directions/call.js
//#include ./directions/const.js
//#include ./directions/cycles.js
//#include ./directions/data.js
//#include ./directions/end.js
//#include ./directions/inherit.js
//#include ./directions/iterator.js
//#include ./directions/logic.js
//#include ./directions/private.js
//#include ./directions/proto.js
//#include ./directions/return.js
//#include ./directions/scope.js
//#include ./directions/space.js
//#include ./directions/template.js
//#include ./directions/try.js
//#include ./directions/var.js
//#include ./directions/void.js