(() => {
	var aliasRgxp = /__(.*?)__/;

	/**
	 * Adds a new directive to Snakeskin's namespace
	 *
	 * @param {string} name - a name of the new directive
	 * @param {{
	 *     alias: (?boolean|undefined),
	 *     text: (?boolean|undefined),
	 *     placement: (?string|undefined),
	 *     notEmpty: (?boolean|undefined),
	 *     chain: (Array|string|undefined),
	 *     end: (Array|string|undefined),
	 *     group: (Array|string|undefined),
	 *     sys: (?boolean|undefined),
	 *     block: (?boolean|undefined),
	 *     selfInclude: (?boolean|undefined),
	 *     replacers: (Object|undefined),
	 *     inside: (Object|undefined),
	 *     after: (Object|undefined)
	 * }} params - additional parameters:
	 *
	 *     *) [params.alias = false] - if is true, then the directive is considered as an alias
	 *            (only for private directives)
	 *
	 *     *) [params.text = false] - if is true, then the directive will be outputted as a plain text
	 *     *) [params.placement] - layout of the directive ('global', 'template', ...)
	 *     *) [params.notEmpty = false] - if is true, then the directive can't be empty
	 *
	 *     *) [params.chain] - a name of a main directive, which belongs to the directive
	 *            or an array of names
	 *
	 *     *) [params.end] - a name of a main directive, which ends to the directive
	 *            or an array of names
	 *
	 *     *) [params.group] - a name of a group, which belongs to the directive
	 *            or an array of names
	 *
	 *     *) [params.sys = false] - if is true, then the directive is considered as system
	 *     *) [params.block = false] - if is true, then the directive is considered as block
	 *     *) [params.selfInclude = true] - if is false, then the directive can't be placed inside another directive
	 *            of the same type
	 *
	 *     *) [params.replacers] - shorthands for the directive
	 *            replacers: {
	 *                // Can be no more than two symbols in the key
	 *                '?': (cmd) => cmd.replace(/^\?/, 'void ')
	 *            }
	 *
	 *     *) [params.inside] - a table of directives, which can be included in the directive
	 *            inside: {
	 *                'case': true,
	 *                'default': true
	 *            }
	 *
	 *     *) [params.after] - a table of directives, which can be placed after the directive
	 *            after: {
	 *                'catch': true,
	 *                'finally': true
	 *            }
	 *
	 * @param {function(this:DirObj, string, number, string, (boolean|number))} constr - constructor
	 * @param {?function(this:DirObj, string, number, string, (boolean|number))=} opt_destr - destructor
	 */
	Snakeskin.addDirective = function (name, params, constr, opt_destr) {
		params = params || {};

		forIn(params.replacers, (el, key) => {
			if (key.length > 2) {
				throw new Error(`Invalid shorthand key "${key}" (key.length > 2)`);
			}

			replacers[key] = el;

			if (key.charAt(0) !== '/') {
				shortMap[key] = true;
			}
		});

		after[name] = params.after;
		inside[name] = params.inside;
		sys[name] = Boolean(params.sys);
		block[name] = Boolean(params.block);
		text[name] = Boolean(params.text);

		if (params.alias) {
			aliases[name] = name.replace(aliasRgxp, '$1');
		}

		if (params.group) {
			let group = Array.isArray(params.group) ?
				params.group : [params.group];

			for (let i = -1; ++i < group.length;) {
				if (!groups[group[i]]) {
					groups[group[i]] = {};
					groupsList[group[i]] = [];
				}

				groups[group[i]][name] = true;
				groupsList[group[i]].push(`"${name}"`);
			}
		}

		if (params.chain) {
			let chain = Array.isArray(params.chain) ?
				params.chain : [params.chain];

			for (let i = -1; ++i < chain.length;) {
				if (!chains[chain[i]]) {
					chains[chain[i]] = {};
				}

				chains[chain[i]][name] = true;
			}
		}

		if (params.end) {
			let chain = Array.isArray(params.end) ?
				params.end : [params.end];

			for (let i = -1; ++i < chain.length;) {
				if (!ends[chain[i]]) {
					ends[chain[i]] = {};
				}

				ends[chain[i]][name] = true;
			}
		}

		params.selfInclude = params.selfInclude !== false;

		if (!params.selfInclude) {
			params.block = true;
		}

		Snakeskin.Directions[name] = function (command, commandLength, type, jsDoc) {
			var dir = this;
			var sourceName = getDirName(name),
				dirName = getDirName(name);

			if (dir.ctx) {
				dirName = dir.name || dirName;
				dir = dir.ctx;
			}

			var ignore = groups['ignore'][dirName],
				struct = dir.structure;

			dir.name = dirName;
			switch (params.placement) {
				case 'template':
					if (!struct.parent) {
						dir.error(`directive "${dirName}" can be used only within a ${groupsList['template'].join(', ')}`);
					}

					break;

				case 'global':
					if (struct.parent) {
						dir.error(`directive "${dirName}" can be used only within the global space`);
					}

					break;

				default:
					if (params.placement && dir.hasParent(params.placement)) {
						dir.error(`directive "${dirName}" can be used only within a "${params.placement}"`);
					}
			}

			if (params.notEmpty && !command) {
				return dir.error(`directive "${dirName}" must have a body`);
			}

			if (struct.strong) {
				if (inside[struct.name][dirName]) {
					dir.chainSpace = false;

				} else if (!ignore && sourceName === dirName && dirName !== 'end') {
					return dir.error(`directive "${dirName}" can't be used within the "${struct.name}"`);
				}
			}

			if (!params.selfInclude && dir.has(dirName)) {
				return dir.error(`directive "${dirName}" can't be used within the "${dirName}"`);
			}

			if (params.text) {
				dir.text = true;
			}

			var from = dir.res.length;

			constr.call(dir, command, commandLength, type, jsDoc);

			if (dir.structure.params._from === undefined) {
				dir.structure.params._from = from;
			}

			var newStruct = dir.structure;

			if (inside[dirName]) {
				newStruct.strong = true;
				dir.chainSpace = true;
			}

			if (dirName === sourceName) {
				if (struct === newStruct) {
					if (!ignore && after[struct.name] && !after[struct.name][dirName]) {
						return dir.error(`directive "${dirName}" can't be used after the "${struct.name}"`);
					}

				} else {
					let siblings = sourceName === 'end' ?
						newStruct.children : newStruct.parent && newStruct.parent.children;

					if (siblings) {
						let j = 1,
							prev;

						while ((prev = siblings[siblings.length - j]) && (prev.name === 'text' || prev === newStruct)) {
							j++;
						}

						if (!ignore && prev && after[prev.name] && !after[prev.name][dirName]) {
							return dir.error(`directive "${dirName}" can't be used after the "${prev.name}"`);
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

		Snakeskin.Directions[`${name}End`] = opt_destr;
		var baseEnd = Snakeskin.Directions[`${name}BaseEnd`] = function () {
			var params = this.structure.params;

			if (params._scope) {
				this.scope.pop();
			}

			forIn(params._consts, (el, key) => {
				constCache[this.tplName][key] = el;
			});

			var res = params._res ?
				params._res : this.res;

			var from = params._from,
				to = res.length;

			if (from == null) {
				return;
			}

			var parent = this.structure.parent;

			if ((!parent || parent.name === 'root') && !this.getGroup('define')[name] && from !== to) {
				try {
					this.evalStr(res.substring(from, to));

				} catch (err) {
					return this.error(err.message);
				}

				if (fsStack.length) {
					this.source = this.source.substring(0, this.i + 1) +
					this.replaceCData(fsStack.join('')) +
					this.source.substring(this.i + 1);

					fsStack.splice(0, fsStack.length);
				}
			}
		};
	};

	//#include ./directives/*.js
})();
