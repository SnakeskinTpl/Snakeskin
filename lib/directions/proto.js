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

	for (var i = -1; ++i < protoArgs.length;) {
		var val = this.prepareOutput(args[i] || 'void 0', true);

		var arg = protoArgs[i][0],
			def = protoArgs[i][1];

		if (def !== void 0) {
			def = this.prepareOutput(def, true);
		}

		arg = arg.replace(scopeModRgxp, '');

		str += (("\
\n			var " + arg) + (" = " + (def !== void 0 ?
				val ? (("" + val) + (" != null ? " + val) + (" : " + (this.prepareOutput(def, true))) + "") : def : val || 'void 0')) + ";\
\n		");
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
			'define',
			'inherit',
			'blockInherit'
		]
	},

	function (command, commandLength) {
		var name = this.getFnName(command),
			tplName = this.tplName;

		if (!name) {
			return this.error((("invalid \"" + (this.name)) + "\" name"));
		}

		var parts = name.split('->');

		if (parts[1]) {
			name = parts[1].trim();

			// Идёт декларация внешнего прототипа
			if (!tplName) {
				tplName =
					this.tplName = this.prepareNameDecl(parts[0]);

				this.preProtos[tplName] = this.preProtos[tplName] || {
					text: ''
				};

				this.preProtos[tplName].startLine = this.info['line'];
				this.protoLink = name;
			}
		}

		if (!name || !tplName) {
			return this.error((("invalid \"" + (this.name)) + "\" declaration"));
		}

		var start = this.i - this.startTemplateI,
			output = command.split('=>')[1];

		var ouptupCache = this.getBlockOutput(String(this.name));

		if (output != null) {
			ouptupCache[name] = output;
		}

		this.startDir(null, {
			name: name,
			startTemplateI: this.i + 1,
			from: this.i - this.getDiff(commandLength),
			fromBody: start + 1,
			line: this.info['line']
		});

		if (this.isAdvTest()) {
			if (protoCache[tplName][name]) {
				return this.error((("proto \"" + name) + "\" is already defined"));
			}

			var args = this.prepareArgs(
				command,
				String(this.name),
				String(tplName),
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
			params = struct.params;

		var proto = protoCache[tplName][params.name];
		var s = (this.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK,
			e = RIGHT_BLOCK;

		// Закрылся "внешний" прототип
		if (this.protoLink === params.name) {
			var obj = this.preProtos[tplName];

			obj.text += (("\
\n				" + s) + ("__switchLine__ " + (obj.startLine)) + ("" + e) + ("\
\n					" + (this.source.substring(params.from, this.i + 1))) + ("\
\n				" + s) + ("end" + e) + "\
\n			");

			this.protoLink = null;
			this.tplName = null;

			if (!this.hasParentBlock('proto')) {
				this.protoStart = false;
			}

		} else if (!this.protoLink) {
			var start = this.i - this.startTemplateI;

			if (this.isAdvTest()) {
				var diff = this.getDiff(commandLength),
					scope = proto.scope;

				proto.to = start + 1;
				proto.content = this.source
					.substring(this.startTemplateI)
					.substring(params.fromBody, start - diff);

				fromProtoCache[tplName] = this.i - this.startTemplateI + 1;

				// Рекурсивно анализируем прототипы блоков
				proto.body = Snakeskin.compile(
					(("\
\n						" + s) + ("template " + tplName) + ("()" + e) + ("\
\n							" + (scope ? (("" + s) + ("with " + scope) + ("" + e) + "") : '')) + ("\
\n\
\n								" + s) + ("var __I_PROTO__ = 1" + e) + ("\
\n								" + s) + ("__protoWhile__ __I_PROTO__--" + e) + ("\
\n									" + s) + ("__setLine__ " + (params.line)) + ("" + e) + ("\
\n									" + (this.source.substring(params.startTemplateI, this.i - diff))) + ("\
\n								" + s) + ("end" + e) + ("\
\n\
\n							" + (scope ? (("" + s) + ("end" + e) + "") : '')) + ("\
\n						" + s) + ("end" + e) + "\
\n					").trim(),

					{
						inlineIterators: this.inlineIterators,
						stringBuffer: this.stringBuffer,
						escapeOutput: this.escapeOutput,
						xml: this.xml
					},

					null,

					{
						parent: this,
						lines: this.lines.slice(),

						needPrfx: this.needPrfx,
						prfxI: this.prfxI,

						scope: this.scope.slice(),
						vars: struct.vars,
						consts: this.consts,

						proto: {
							name: params.name,
							recursive: params.recursive,
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
			var back = this.backTable[params.name];
			if (back && !back.protoStart) {
				var args = proto.args,
					fin = true;

				for (var i = -1; ++i < back.length;) {
					var el = back[i];

					if (this.canWrite) {
						if (!el.outer) {
							this.res = this.res.substring(0, el.pos) +
								this.returnProtoArgs(args, el.args) +
								protoCache[tplName][params.name].body +
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
					delete this.backTable[params.name];
					this.backTableI--;
				}
			}
		}

		if (!this.protoLink && !this.hasParentBlock('proto')) {
			this.protoStart = false;
		}

		var ouptupCache = this.getBlockOutput('proto');
		if (ouptupCache[params.name] != null && this.isSimpleOutput()) {
			struct.vars = struct.parent.vars;
			this.save(this.returnProtoArgs(proto.args, this.getFnArgs((("(" + (ouptupCache[params.name])) + ")"))) + proto.body);
			struct.vars = vars;
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
			var tplName = this.tplName;
			var name = this.getFnName(command),
				args = this.getFnArgs(command);

			var cache = protoCache[tplName];
			var proto = cache[name],
				argsStr = '';

			if (proto) {
				argsStr = this.returnProtoArgs(proto.args, args);
			}

			var selfProto = this.proto;
			if (selfProto && proto && proto.calls[selfProto.name]) {
				return this.error((("invalid form of recursion for the proto (apply \"" + name) + ("\" inside \"" + (selfProto.name)) + "\")"));
			}

			// Рекурсивный вызов прототипа
			if (selfProto && selfProto.name === name) {
				this.save(argsStr + this.prepareOutput('__I_PROTO__++', true) + ';');

			// Попытка применить не объявленный прототип
			// (запоминаем место вызова, чтобы вернуться к нему,
			// когда прототип будет объявлен)
			} else if (!proto || !proto.body) {
				var back = this.backTable;

				if (!back[name]) {
					back[name] = [];
					back[name].protoStart = this.protoStart;
					this.backTableI++;
				}

				var rand = Math.random().toString(),
					key = (("" + (tplName.replace(/([.\[])/g, '\\$1'))) + ("_" + name) + ("_" + (rand.replace('.', '\\.'))) + "");

				back[name].push({
					proto: selfProto ?
						cache[selfProto.name] : null,

					pos: this.res.length,
					label: new RegExp((("\\/\\* __APPLY__" + key) + " \\*\\/")),

					args: args,
					recursive: Boolean(proto)
				});

				this.save((("/* __APPLY__" + tplName) + ("_" + name) + ("_" + rand) + " */"));

				if (selfProto && !proto) {
					cache[selfProto.name].calls[name] = true;
				}

			} else {
				this.save(argsStr + proto.body);
			}
		}
	}
);