/**
 * Добавить новую директиву в пространство имён Snakeskin
 *
 * @param {string} name - название добавляемой директивы
 * @param {Object} params - дополнительные параметры
 *
 * @param {?boolean=} [params.text=false] - если true, то декларируется,
 *     что директива выводится как текст
 *
 * @param {?string=} [params.placement] - если параметр задан, то делается проверка
 *     где именно размещена директива ('global', 'template', ...)
 *
 * @param {?boolean=} [params.notEmpty=false] - если true, то директива не может быть "пустой"
 * @param {?boolean=} [params.sys=false] - если true, то директива считается системной
 *     (например, block или proto, т.е. которые участвуют только на этапе трансляции)
 *
 * @param {Object=} [params.replacers] - таблица коротких сокращений директивы
 *     replacers: {
 *         // В ключе должно быть не более 2-х символов
 *         '?': (cmd) => cmd.replace(/^\?/, 'void ')
 *     }
 *
 * @param {Object=} [params.strongDirs] - таблица директив, которые могут быть вложены в исходную
 *     strongDirs: {
 *         'case': true,
 *         'default': true
 *     }
 *
 * @param {Object=} [params.after] - таблица директив, которые могут идти после исходной
 *     after: {
 *         'catch': true,
 *         'finally': true
 *     }
 *
 * @param {function(this:DirObj, string, number, (boolean|number))} constr - конструктор директивы
 * @param {?function(this:DirObj, string, number, (boolean|number))=} opt_destr - деструктор директивы
 */
Snakeskin.addDirective = function (name, params, constr, opt_destr) {
	params = params || {};
	sysDirs[name] = Boolean(params.sys);

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
	afterDirs[name] = params.after;

	Snakeskin.Directions[name] = function (dir, command, commandLength, jsDoc) {
		if (dir.ctx) {
			name = dir.name || name;
			dir = dir.ctx;
		}

		switch (params.placement) {
			case 'template': {
				if (!dir.structure.parent) {
					dir.error((("directive \"" + name) + "\" can only be used within a \"template\", \"interface\", \"placeholder\" or \"proto\""));
				}

			} break;

			case 'global': {
				if (dir.structure.parent) {
					dir.error((("directive \"" + name) + "\" can be used only within the global space"));
				}

			} break;

			default: {
				if (params.placement && dir.hasParent(params.placement)) {
					dir.error((("directive \"" + name) + ("\" can be used only within a \"" + (params.placement)) + "\""));
				}
			}
		}

		if (params.notEmpty && !command) {
			return dir.error((("directive \"" + name) + "\" should have a body"));
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

		var parent = name === 'end' ?
			dir.structure : dir.structure.parent;

		if (parent) {
			var list = parent.children;
			var j = name === 'end' ? 1 : 2,
				prev;

			while ((prev = list[list.length - j]) && prev.name === 'text') {
				j++;
			}

			if (prev && afterDirs[prev.name] && !afterDirs[prev.name][dir.name]) {
				return dir.error((("directive \"" + (dir.name)) + ("\" can't be used after a \"" + (prev.name)) + "\""));
			}
		}

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

	Snakeskin.Directions[(("" + name) + "End")] = opt_destr;
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