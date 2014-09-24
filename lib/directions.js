var aliasRgxp = /__(.*?)__/;

/**
 * Добавить новую директиву в пространство имён Snakeskin
 *
 * @param {string} name - название добавляемой директивы
 * @param {Object} params - дополнительные параметры
 *
 * @param {?boolean=} [params.alias=false] - если true, то директива считается псевдонимом
 *     (только для приватных директив)
 *
 * @param {?boolean=} [params.text=false] - если true, то декларируется,
 *     что директива выводится как текст
 *
 * @param {?string=} [params.placement] - если параметр задан, то делается проверка
 *     где именно размещена директива ('global', 'template', ...)
 *
 * @param {?boolean=} [params.notEmpty=false] - если true, то директива не может быть "пустой"
 * @param {(Array|string)=} [params.chain] - название главной директивы (цепи), к которой принадлежит директива,
 *     или массив названий
 *
 * @param {(Array|string)=} [params.group] - название группы, к которой принадлежит директива,
 *     или массив названий
 *
 * @param {?boolean=} [params.sys=false] - если true, то директива считается системной
 *     (например, block или proto, т.е. которые участвуют только на этапе трансляции)
 *
 * @param {?boolean=} [params.block=false] - если true, то директива считается блочной
 *     (т.е. требует закрывающей директивы)
 *
 * @param {?boolean=} [params.selfInclude=true] - если false, то директива не может быть вложена
 *     в директиву схожего типа
 *
 * @param {Object=} [params.replacers] - таблица коротких сокращений директивы
 *     replacers: {
 *         // В ключе должно быть не более 2-х символов
 *         '?': (cmd) => cmd.replace(/^\?/, 'void ')
 *     }
 *
 * @param {Object=} [params.inside] - таблица директив, которые могут быть вложены в исходную
 *     inside: {
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
 * @param {function(this:DirObj, string, number, string, (boolean|number))} constr - конструктор директивы
 * @param {?function(this:DirObj, string, number, string, (boolean|number))=} opt_destr - деструктор директивы
 */
Snakeskin.addDirective = function (name, params, constr, opt_destr) {
	params = params || {};

	if (params.replacers) {
		var repls = params.replacers;

		for (var key in repls) {
			if (!repls.hasOwnProperty(key)) {
				continue;
			}

			replacers[key] = repls[key];

			if (key.charAt(0) !== '/') {
				shortMap[key] = true;
			}
		}
	}

	after[name] = params.after;
	inside[name] = params.inside;

	sys[name] = Boolean(params.sys);
	block[name] = Boolean(params.block);

	if (params.alias) {
		aliases[name] = name.replace(aliasRgxp, '$1');
	}

	if (params.group) {
		var group = Array.isArray(params.group) ?
			params.group : [params.group];

		for (var i = -1; ++i < group.length;) {
			if (!groups[group[i]]) {
				groups[group[i]] = {};
				groupsList[group[i]] = [];
			}

			groups[group[i]][name] = true;
			groupsList[group[i]].push((("\"" + name) + "\""));
		}
	}

	if (params.chain) {
		var chain = Array.isArray(params.chain) ?
			params.chain : [params.chain];

		for (var i$0 = -1; ++i$0 < chain.length;) {
			if (!chains[chain[i$0]]) {
				chains[chain[i$0]] = {};
			}

			chains[chain[i$0]][name] = true;
		}
	}

	params.selfInclude = params.selfInclude !== false;

	if (!params.selfInclude) {
		params.block = true;
	}

	Snakeskin.Directions[name] = function (command, commandLength, type, jsDoc) {
		var dir = this;
		var sourceName = getName(name),
			dirName = getName(name);

		if (dir.ctx) {
			dirName = dir.name || dirName;
			dir = dir.ctx;
		}

		var ignore = groups['ignore'][dirName],
			struct = dir.structure;

		dir.name = dirName;
		switch (params.placement) {
			case 'template': {
				if (!struct.parent) {
					dir.error((("directive \"" + dirName) + ("\" can be used only within a " + (groupsList['template'].join(', '))) + ""));
				}

			} break;

			case 'global': {
				if (struct.parent) {
					dir.error((("directive \"" + dirName) + "\" can be used only within the global space"));
				}

			} break;

			default: {
				if (params.placement && dir.hasParent(params.placement)) {
					dir.error((("directive \"" + dirName) + ("\" can be used only within a \"" + (params.placement)) + "\""));
				}
			}
		}

		if (params.notEmpty && !command) {
			return dir.error((("directive \"" + dirName) + "\" should have a body"));
		}

		if (struct.strong) {
			if (inside[struct.name][dirName]) {
				dir.strongSpace = false;

			} else if (!ignore && sourceName === dirName && dirName !== 'end') {
				return dir.error((("directive \"" + dirName) + ("\" can't be used within the \"" + (struct.name)) + "\""));
			}
		}

		if (!params.selfInclude && dir.has(dirName)) {
			return dir.error((("directive \"" + dirName) + ("\" can't be used within the \"" + dirName) + "\""));
		}

		if (params.text) {
			dir.text = true;
		}

		var from = dir.res.length;

		constr.call(dir, command, commandLength, type, jsDoc);

		if (dir.structure.params._from === void 0) {
			dir.structure.params._from = from;
		}

		var newStruct = dir.structure;

		if (inside[dirName]) {
			newStruct.strong = true;
			dir.strongSpace = true;
		}

		if (dirName === sourceName) {
			if (struct === newStruct) {
				if (!ignore && after[struct.name] && !after[struct.name][dirName]) {
					return dir.error((("directive \"" + dirName) + ("\" can't be used after the \"" + (struct.name)) + "\""));
				}

			} else {
				var siblings = sourceName === 'end' ?
					newStruct.children : newStruct.parent && newStruct.parent.children;

				if (siblings) {
					var j = 1,
						prev;

					while ((prev = siblings[siblings.length - j]) && (prev.name === 'text' || prev === newStruct)) {
						j++;
					}

					if (!ignore && prev && after[prev.name] && !after[prev.name][dirName]) {
						return dir.error((("directive \"" + dirName) + ("\" can't be used after the \"" + (prev.name)) + "\""));
					}
				}
			}
		}

		dir.applyQueue();

		if (dir.inline === true) {
			baseEnd.call(dir);

			if (opt_destr) {
				opt_destr.call(dir, command, commandLength, type, jsDoc);
			}

			dir.inline = null;
			dir.structure = dir.structure.parent;

			if (dir.blockStructure && dir.blockStructure.name === 'const') {
				dir.blockStructure = dir.blockStructure.parent;
			}
		}
	};

	Snakeskin.Directions[(("" + name) + "End")] = opt_destr;
	var baseEnd = Snakeskin.Directions[(("" + name) + "BaseEnd")] = function () {
		var struct = this.structure,
			params = struct.params;

		if (params._scope) {
			this.scope.pop();
		}

		if (params._consts) {
			var consts = Object(params._consts);

			for (var key in consts) {
				if (!consts.hasOwnProperty(key)) {
					continue;
				}

				constCache[this.tplName][key] = consts[key];
			}
		}

		var res = params._res ?
			params._res : this.res;

		var from = params._from,
			to = res.length;

		if (from == null) {
			return;
		}

		var parent = struct.parent;

		if ((!parent || parent.name === 'root') && !this.getGroup('define')[name] && from !== to) {
			try {
				var str = this.pasteDangerBlocks(res.substring(from, to));
				this.evalStr(str);

			} catch (err) {
				return this.error(err.message);
			}

			if (fsStack.length) {
				this.source = this.source.substring(0, this.i + 1) +
					fsStack.join('') +
					this.source.substring(this.i + 1);

				fsStack.splice(0, fsStack.length);
			}
		}
	};
};

//#include ./directions/bem.js
//#include ./directions/block.js
//#include ./directions/call.js
//#include ./directions/const.js
//#include ./directions/cycles.js
//#include ./directions/data.js
//#include ./directions/attr.js
//#include ./directions/end.js
//#include ./directions/super.js
//#include ./directions/iterator.js
//#include ./directions/logic.js
//#include ./directions/private.js
//#include ./directions/proto.js
//#include ./directions/return.js
//#include ./directions/with.js
//#include ./directions/space.js
//#include ./directions/template.js
//#include ./directions/try.js
//#include ./directions/var.js
//#include ./directions/void.js
//#include ./directions/async.js
//#include ./directions/control.js
//#include ./directions/eval.js
//#include ./directions/head.js
//#include ./directions/include.js
//#include ./directions/yield.js
//#include ./directions/doctype.js
//#include ./directions/script.js
//#include ./directions/style.js
//#include ./directions/link.js
//#include ./directions/import.js
//#include ./directions/comment.js
//#include ./directions/tag.js
//#include ./directions/set.js
//#include ./directions/plain.js
//#include ./directions/compiler.js
//#include ./directions/cdn.js