/**
 * Если true, то значит идёт декларация прототипа
 * @type {boolean}
 */
DirObj.prototype.protoStart = false;

/**
 * Кеш внешних прототипов
 * @type {!Object}
 */
DirObj.prototype.preProtos = {};

/**
 * Название активного внешнего прототипа
 * @type {?string}
 */
DirObj.prototype.protoLink = null;

/**
 * Вернуть строку декларации заданных аргументов прототипа
 *
 * @param {!Array.<!Array>} protoArgs - массив аргументов прототипа [название, значение по умолчанию]
 * @param {!Array} args - массив заданных аргументов
 * @return {string}
 */
DirObj.prototype.returnProtoArgs = function (protoArgs, args) {
	var str = '';

	for (let i = 0; i < protoArgs.length; i++) {
		let val = this.prepareOutput(args[i] || 'void 0', true);

		let arg = protoArgs[i][0],
			def = protoArgs[i][1];

		if (def !== void 0) {
			def = this.prepareOutput(def, true);
		}

		arg = arg.replace(scopeModRgxp, '');

		str += `
			var ${arg} = ${def !== void 0 ?
				val ? `${val} != null ? ${val} : ${this.prepareOutput(def, true)}` : def : val || 'void 0'
			};
		`;
	}

	return str;
};

Snakeskin.addDirective(
	'proto',

	{
		sys: true,
		block: true,
		notEmpty: true,
		group: [
			'template',
			'inherit',
			'blockInherit'
		]
	},

	function (command, commandLength) {
		var name = this.getFnName(command);

		if (!name) {
			return this.error(`invalid "${this.name}" name`);
		}

		var parts = name.split('->');

		if (parts[1]) {
			name = parts[1].trim();

			// Идёт декларация внешнего прототипа
			if (!this.tplName) {
				this.tplName = this.pasteDangerBlocks(parts[0]).trim();

				this.preProtos[this.tplName] = this.preProtos[this.tplName] || {
					text: ''
				};

				this.preProtos[this.tplName].startLine = this.info['line'];
				this.protoLink = name;
			}
		}

		if (!name || !this.tplName) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		var start = this.i - this.startTemplateI;

		this.startDir(null, {
			name: name,
			startTemplateI: this.i + 1,
			from: this.i - this.getDiff(commandLength),
			fromBody: start + 1,
			line: this.info['line']
		});

		if (this.isAdvTest()) {
			if (protoCache[this.tplName][name]) {
				return this.error(`proto "${name}" is already defined`);
			}

			let scope;
			let argsList = this.getFnArgs(command),
				argsMap = [];

			for (let i = 0; i < argsList.length; i++) {
				let arg = argsList[i].split('='),
					mod = scopeModRgxp.test(arg[0]);

				if (mod) {
					if (scope) {
						return this.error(`invalid "${this.name}" declaration`);

					} else {
						arg[0] = arg[0].replace(scopeModRgxp, '');
					}
				}

				if (arg.length > 1) {
					arg[1] = arg.slice(1).join('=').trim();
					arg[1] = arg[1] && this.prepareOutput(arg[1], true);
				}

				arg[0] = this.declVar(arg[0].trim(), true) || '';

				if (mod) {
					scope = arg[0];
				}

				argsMap.push(arg);
			}

			protoCache[this.tplName][name] = {
				length: commandLength,
				from: start - this.getDiff(commandLength),

				argsDecl: argsList.params ?
					`(${argsList.join(',')})` : '',

				args: argsMap,
				scope: scope,

				calls: {},
				needPrfx: this.needPrfx
			};
		}

		if (!this.parentTplName) {
			this.protoStart = true;
		}
	},

	function (command, commandLength) {
		var tplName = this.tplName,
			lastProto = this.structure.params;

		// Закрылся "внешний" прототип
		if (this.protoLink === lastProto.name) {
			let obj = this.preProtos[this.tplName];

			obj.text += `
				{__switchLine__ ${obj.startLine}}
					${this.source.substring(lastProto.from, this.i + 1)}
				{end}
			`;

			this.protoLink = null;
			this.tplName = null;

			if (!this.hasParentBlock('proto')) {
				this.protoStart = false;
			}

		} else if (!this.protoLink) {
			let proto = protoCache[tplName][lastProto.name],
				start = this.i - this.startTemplateI;

			if (this.isAdvTest()) {
				let diff = this.getDiff(commandLength),
					scope = proto.scope;

				let _ = this.needPrfx ?
					ALB : '';

				proto.to = start + 1;
				proto.content = this.source
					.substring(this.startTemplateI)
					.substring(lastProto.fromBody, start - diff);

				fromProtoCache[tplName] = this.i - this.startTemplateI + 1;

				// Рекурсивно анализируем прототипы блоков
				proto.body = Snakeskin.compile(
					`
						${_}{template ${tplName}()}
							${scope ? `${_}{with ${scope}}` : ''}

								${_}{var __I_PROTO__ = 1}
								${_}{__protoWhile__ __I_PROTO__--}
									{__setLine__ ${lastProto.line}}${this.source.substring(lastProto.startTemplateI, this.i - diff)}
								${_}{end}

							${scope ? `${_}{end}` : ''}
						${_}{end}
					`,

					{
						inlineIterators: this.inlineIterators,
						stringBuffer: this.stringBuffer,
						escapeOutput: this.escapeOutput
					},

					null,

					{
						parent: this,
						lines: this.lines.slice(),

						needPrfx: this.needPrfx,
						prfxI: this.prfxI,

						scope: this.scope.slice(),
						vars: this.structure.vars,

						proto: {
							name: lastProto.name,
							recursive: lastProto.recursive,
							parentTplName: this.parentTplName,

							pos: this.res.length,
							ctx: this,

							superStrongSpace: this.superStrongSpace,
							strongSpace: this.strongSpace,
							space: this.space
						}
					}
				);
			}

			// Применение обратных прототипов
			let back = this.backTable[lastProto.name];
			if (back && !back.protoStart) {
				let args = proto.args,
					fin = true;

				for (let i = 0; i < back.length; i++) {
					let el = back[i];

					if (this.canWrite) {
						if (!el.outer) {
							this.res = this.res.substring(0, el.pos) +
								this.returnProtoArgs(args, el.args) +
								protoCache[tplName][lastProto.name].body +
								this.res.substring(el.pos);

						} else {
							let tmp = this.structure.vars;

							this.structure.vars = el.vars;
							el.argsStr = this.returnProtoArgs(args, el.args);
							this.structure.vars = tmp;

							fin = false;
						}
					}
				}

				if (fin) {
					delete this.backTable[lastProto.name];
					this.backTableI--;
				}
			}
		}

		if ((!this.protoLink || this.protoLink === lastProto.name) && !this.hasParentBlock('proto')) {
			this.protoStart = false;
		}
	}
);

/**
 * Таблица обратных вызовов прототипа
 */
DirObj.prototype.backTable = {
	init: function () {
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
		text: true
	},

	function (command) {
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			let name = this.getFnName(command),
				args = this.getFnArgs(command);

			let cache = protoCache[this.tplName];
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
				if (!this.backTable[name]) {
					this.backTable[name] = [];
					this.backTable[name].protoStart = this.protoStart;
					this.backTableI++;
				}

				let rand = Math.random().toString(),
					key = `${this.tplName.replace(/([.\[])/g, '\\$1')}_${name}_${rand.replace('.', '\\.')}`;

				this.backTable[name].push({
					proto: selfProto ?
						cache[selfProto.name] : null,

					pos: this.res.length,
					label: new RegExp(`\\/\\* __APPLY__${key} \\*\\/`),

					args: args,
					recursive: Boolean(proto)
				});

				this.save(`/* __APPLY__${this.tplName}_${name}_${rand} */`);

				if (selfProto && !proto) {
					cache[selfProto.name].calls[name] = true;
				}

			} else {
				this.save(argsStr + proto.body);
			}
		}
	}
);