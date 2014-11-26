/**
 * Если true, то значит идёт декларация прототипа
 * @type {boolean}
 */
DirObj.prototype.protoStart = false;

/**
 * Индекс анонимных прототипов
 * @type {number}
 */
DirObj.prototype.anonI = 0;

/**
 * Вернуть строку декларации заданных аргументов прототипа
 *
 * @param {!Array.<!Array>} protoArgs - массив аргументов прототипа [название, значение по умолчанию]
 * @param {!Array} args - массив заданных аргументов
 * @return {string}
 */
DirObj.prototype.returnProtoArgs = function (protoArgs, args) {
	var tmp = [];
	var str = '',
		length = protoArgs.length;

	for (let i = -1; ++i < length;) {
		let val = this.prepareOutput(args[i] || 'void 0', true);

		let arg = protoArgs[i][0],
			def = protoArgs[i][1];

		if (def !== void 0) {
			def = this.prepareOutput(def, true);
		}

		arg = arg.replace(scopeModRgxp, '');

		if (protoArgs['__SNAKESKIN_TMP__needArgs'] && i === length - 1) {
			if (length - 1 < args.length) {
				tmp = tmp.concat(args.slice(length - 1, args.length));
			}

			str += /* cbws */`
				var ${arg} = [${tmp.join()}];
				${arg}.callee = __CALLEE__;
			`;

		} else {
			tmp.push(arg);
			str += /* cbws */`
				var ${arg} = ${def !== void 0 ?
					val ? `${val} != null ? ${val} : ${this.prepareOutput(def, true)}` : def : val || 'void 0'
				};
			`;
		}
	}

	return str;
};

var anonRgxp = /^__ANONYMOUS__/,
	callProtoRgxp = /=>/;

Snakeskin.addDirective(
	'proto',

	{
		sys: true,
		block: true,
		notEmpty: true,
		group: [
			'template',
			'define',
			'inherit',
			'blockInherit'
		]
	},

	function (command, commandLength) {
		var name = this.getFnName(command, true),
			tplName = this.tplName;

		if (!name) {
			if (!tplName || !callProtoRgxp.test(command)) {
				return this.error(`invalid "${this.name}" name`);
			}

			name = `__ANONYMOUS__${this.anonI}`;
			this.anonI++;

			let tmpLength = command.length;

			command = name + this.source.substring(this.i - tmpLength, this.i);
			commandLength += name.length;

			this.source = this.source.substring(0, this.i - tmpLength) +
				name +
				this.source.substring(this.i - tmpLength);

			this.i += name.length;
		}

		var parts = name.split('->');

		if (parts[1]) {
			name = parts[1].trim();

			if (!tplName) {
				if (this.structure.parent) {
					this.error(`directive "outer proto" can be used only within the global space`);
					return;
				}

				try {
					tplName =
						this.tplName = this.prepareNameDecl(parts[0]);

				} catch (err) {
					return this.error(err.message);
				}

				let desc = this.preDefs[tplName] = this.preDefs[tplName] || {
					text: ''
				};

				desc.startLine = this.info['line'];
				desc.i = this.i + 1;

				this.outerLink = name;
			}

		} else if (!this.outerLink && !this.tplName) {
			return this.error(`directive "${this.name}" can be used only within a ${groupsList['template'].join(', ')}`);
		}

		if (!name || !tplName || callBlockNameRgxp.test(name)) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		var start = this.i - this.startTemplateI;
		this.startDir(null, {
			name: name,
			startTemplateI: this.i + 1,
			from: this.i - this.getDiff(commandLength),
			fromBody: start + 1,
			line: this.info['line'],
			sysSpace: this.sysSpace,
			strongSpace: this.strongSpace,
			chainSpace: this.chainSpace,
			space: this.space
		});

		if (this.isAdvTest()) {
			let dir = String(this.name);

			if (protoCache[tplName][name] && !anonRgxp.test(name)) {
				return this.error(`proto "${name}" is already defined`);
			}

			let output = command.split('=>')[1],
				ouptupCache = this.getBlockOutput(dir);

			if (output != null) {
				ouptupCache[name] = output;
			}

			let args = this.prepareArgs(
				command,
				dir,
				null,
				this.parentTplName,
				name
			);

			protoCache[tplName][name] = {
				length: commandLength,
				from: start - this.getDiff(commandLength),
				args: args.list,
				scope: args.scope,
				calls: {},
				needPrfx: this.needPrfx,
				output: output
			};
		}

		if (!this.parentTplName) {
			this.protoStart = true;
		}
	},

	function (command, commandLength) {
		var tplName = this.tplName,
			struct = this.structure;

		var vars = struct.vars,
			params = struct.params,
			diff = this.getDiff(commandLength);

		var name = params.name,
			isAnon = anonRgxp.test(name);

		var s = (this.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK,
			e = RIGHT_BLOCK;

		var space = this.space,
			nl = this.lineSeparator;

		this.sysSpace = params.sysSpace;
		this.strongSpace = params.strongSpace;
		this.chainSpace = params.chainSpace;
		this.space = params.space;

		if (this.outerLink === name) {
			let obj = this.preDefs[tplName],
				i = Number(obj.i);

			obj.text += /* cbws */`
				${nl}${this.source.substring(params.from, i)}
				${s}__cutLine__${e}

					${s}__switchLine__ ${obj.startLine}${e}
						${this.source.substring(i, this.i - diff)}
					${s}__end__${e}

				${nl}${this.source.substring(this.i - diff, this.i + 1)}
				${s}__cutLine__${e}
			`;

			this.outerLink = null;
			this.tplName = null;

			if (!this.hasParentBlock('proto')) {
				this.protoStart = false;
			}

		} else if (!this.outerLink) {
			let proto = protoCache[tplName][name],
				start = this.i - this.startTemplateI;

			if (this.isAdvTest()) {
				let scope = proto.scope;

				proto.to = start + 1;
				proto.content = this.source
					.substring(this.startTemplateI)
					.substring(params.fromBody, start - diff);

				if (!isAnon) {
					fromProtoCache[tplName] = this.i - this.startTemplateI + 1;
				}

				// Рекурсивно анализируем прототипы блоков
				proto.body = Snakeskin.compile(
					(
						`${s}template ${tplName}()${e}` +
							(scope ? `${s}with ${scope}${e}` : '') +

								`${s}var __I_PROTO__ = 1${e}` +
								`${s}__protoWhile__ __I_PROTO__--${e}` +
									`${s}__setLine__ ${params.line}${e}` +
									this.source.substring(params.startTemplateI, this.i - diff) +
								`${s}__end__${e}` +

							(scope ? `${s}end${e}` : '') +
						`${s}end${e}`
					).trim(),

					{
						inlineIterators: this.inlineIterators,
						renderMode: this.renderMode,
						replaceUndef: this.replaceUndef,
						escapeOutput: this.escapeOutput,
						doctype: this.doctype,
						autoReplace: this.autoReplace,
						macros: this.macros,
						language: this.language,
						localization: this.localization,
						lineSeparator: this.lineSeparator,
						tolerateWhitespace: this.tolerateWhitespace
					},

					null,

					{
						parent: this,
						lines: this.lines.slice(),
						needPrfx: this.needPrfx,
						scope: this.scope.slice(),
						vars: struct.vars,
						consts: this.consts,
						proto: {
							name: name,
							recursive: params.recursive,
							parentTplName: this.parentTplName,
							pos: this.res.length,
							ctx: this,
							sysSpace: this.sysSpace,
							strongSpace: this.strongSpace,
							chainSpace: this.chainSpace,
							space: this.space
						}
					}
				);
			}

			// Применение обратных прототипов
			let back = this.backTable[name];
			if (back && !back.protoStart) {
				let args = proto.args,
					fin = true;

				for (let i = -1; ++i < back.length;) {
					let el = back[i];

					if (this.canWrite) {
						if (!el.outer) {
							this.res = this.res.substring(0, el.pos) +
								this.returnProtoArgs(args, el.args) +
								protoCache[tplName][name].body +
								this.res.substring(el.pos);

						} else {
							struct.vars = el.vars;
							el.argsStr = this.returnProtoArgs(args, el.args);
							struct.vars = vars;
							fin = false;
						}
					}
				}

				if (fin) {
					delete this.backTable[name];
					this.backTableI--;
				}
			}

			if (this.protoStart && !this.outerLink && !this.hasParentBlock('proto')) {
				this.protoStart = false;
			}

			if (proto) {
				let ouptupCache = this.getBlockOutput('proto');
				if (ouptupCache[name] != null && this.isSimpleOutput()) {
					struct.vars = struct.parent.vars;

					this.save(
						this.returnProtoArgs(
							proto.args,
							this.getFnArgs(`(${ouptupCache[name]})`)
						) +

						proto.body
					);

					struct.vars = vars;
				}

				this.text = !space;
			}

			if (isAnon && !proto) {
				this.anonI = 0;
				delete protoCache[tplName][name];
			}
		}
	}
);

/**
 * Таблица обратных вызовов прототипа
 */
DirObj.prototype.backTable = {
	init() {
		return {};
	}
};

/**
 * Количество обратных вызовов прототипа
 * (когда apply до декларации вызываемого прототипа)
 * @type {number}
 */
DirObj.prototype.backTableI = 0;

Snakeskin.addDirective(
	'apply',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'+=': (cmd) => cmd.replace('+=', 'apply ')
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			let tplName = this.tplName;
			let name = this.getFnName(command),
				args = this.getFnArgs(command);

			let cache = protoCache[tplName];
			let proto = cache[name],
				argsStr = '';

			if (proto) {
				argsStr = this.returnProtoArgs(proto.args, args);
			}

			let selfProto = this.proto;
			if (selfProto && proto && proto.calls[selfProto.name]) {
				return this.error(`invalid form of recursion for the proto (apply "${name}" inside "${selfProto.name}")`);
			}

			// Рекурсивный вызов прототипа
			if (selfProto && selfProto.name === name) {
				this.save(argsStr + this.prepareOutput('__I_PROTO__++', true) + ';');

			// Попытка применить не объявленный прототип
			// (запоминаем место вызова, чтобы вернуться к нему,
			// когда прототип будет объявлен)
			} else if (!proto || !proto.body) {
				let back = this.backTable;

				if (!back[name]) {
					back[name] = [];
					back[name].protoStart = this.protoStart;
					this.backTableI++;
				}

				let rand = Math.random().toString(),
					key = `${tplName.replace(/([.\[])/g, '\\$1')}_${name}_${rand.replace('.', '\\.')}`;

				back[name].push({
					proto: selfProto ?
						cache[selfProto.name] : null,

					pos: this.res.length,
					label: new RegExp(`\\/\\* __APPLY__${key} \\*\\/`),

					args: args,
					recursive: Boolean(proto)
				});

				this.save(`/* __APPLY__${tplName}_${name}_${rand} */`);

				if (selfProto && !proto) {
					cache[selfProto.name].calls[name] = true;
				}

			} else {
				this.save(argsStr + proto.body);
			}
		}
	}
);

Snakeskin.addDirective(
	'__protoWhile__',

	{

	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			let i = this.prepareOutput('__I_PROTO__', true);
			protoCache[this.tplName][this.proto.name].i = i;
			this.save(`${i}:while (${this.prepareOutput(command, true)}) {`);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			this.save('}');
		}
	}
);
