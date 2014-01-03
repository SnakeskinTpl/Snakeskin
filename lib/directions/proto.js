var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

/**
 * Если true, то значит объявляется прототип
 * @type {boolean}
 */
DirObj.prototype.protoStart = false;

Snakeskin.addDirective(
	'proto',

	{
		isSys: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		var name = command.match(/[^(]+/)[0];

		this.startDir(null, {
			name: name,
			startI: this.i + 1
		});

		var args = command.match(/\((.*?)\)/),
			argsMap = [[this.declVar('__I_PROTO__'), 1]];

		if (args) {
			args = args[1].split(',');
			for (var i = 0; i < args.length; i++) {
				var arg = args[i].split('=');
				arg[0] = this.declVar(arg[0].trim());
				argsMap.push(arg);
			}
		}

		if (this.isAdvTest()) {
			// Попытка декларировать прототип блока несколько раз
			if (protoCache[this.tplName][name]) {
				throw this.error('Proto "' + name + '" is already defined');
			}

			protoCache[this.tplName][name] = {
				from: this.i - this.startI + 1,
				args: argsMap
			};
		}

		if (!this.parentTplName) {
			this.protoStart = true;
		}
	},

	function (command, commandLength) {
		var __NEJS_THIS__ = this;
		var tplName = this.tplName,
			lastProto = this.structure.params;

		var proto = protoCache[tplName][lastProto.name];

		if (this.isAdvTest()) {
			proto.to = this.i - this.startI - commandLength - 1;
			fromProtoCache[tplName] = this.i - this.startI + 1;
		}

		// Рекурсивно анализируем прототипы блоков
		if (!this.parentTplName) {
			proto.body = Snakeskin.compile(
				'{template ' + tplName + '()}' +
					'{while __I_PROTO__--}' +
						this.source.substring(lastProto.startI, this.i - commandLength - 1) +
					'{end}' +
				'{end}',

				null,
				null,
				true,

				{
					scope: this.scope,
					vars: this.structure.vars,
					firstProto: lastProto.name
				}
			);
		}

		var bacs = this.backHash[lastProto.name];
		if (bacs && !bacs.protoStart) {
			var args = proto.args;

			for (var i = 0; i < bacs.length; i++) {
				var el = bacs[i];

				var params = el.args,
					paramsStr = '';

				for (var j = 0; i < args.length; j++) {
					paramsStr += 'var ' + args[i] + ' = ' + params[i] + ';';
				}

				this.replace(
					this.res.substring(0, el.pos) +
					paramsStr +
					protoCache[tplName][lastProto.name].body +
					this.res.substring(el.pos)
				);
			}

			delete this.backHash[lastProto.name];
			this.backHashI--;
		}

		if (!this.hasParent('proto')) {
			this.protoStart = false;
		}
	}
);

DirObj.prototype.backHash = {
	init: function () {
		var __NEJS_THIS__ = this;
		return {};
	}
};

/**
 * Количество обратных вызовов прототипа
 * (когда apply до декларации вызываемого прототипа)
 * @type {number}
 */
DirObj.prototype.backHashI = 0;

/**
 * Имя последнего обратного прототипа
 * @type {?string}
 */
DirObj.prototype.lastBack = null;

Snakeskin.addDirective(
	'apply',

	{
		inBlock: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		var name = command.match(/[^(]+/)[0];
		this.startInlineDir();

		var args = command.match(/\((.*?)\)/);
		if (args) {
			args = args[1].split(',');

		} else {
			args = [];
		}

		if (!this.parentTplName && !this.hasParent('proto')) {
			if (this.firstProto === name) {
				this.save(this.prepareOutput('__I_PROTO__++', true) + ';');
				return;
			}

			// Попытка применить не объявленный прототип
			// (запоминаем место вызова, чтобы вернуться к нему,
			// когда прототип будет объявлен)
			if (!protoCache[this.tplName][name]) {
				if (!this.backHash[name]) {
					this.backHash[name] = [];
					this.backHash[name].protoStart = this.protoStart;

					this.lastBack = name;
					this.backHashI++;
				}

				this.backHash[name].push({
					pos: this.res.length,
					args: args
				});

			} else {
				var proto = protoCache[this.tplName][name];
				var protoArgs = proto.args,
					argStr = '';

				for (var i = 0; i < protoArgs.length; i++) {
					args[i] = args[i] || null;

					var arg = protoArgs[i][0],
						def = protoArgs[i][1];

					argStr += 'var ' + arg + ' = ' +
						(def !== void 0 ?
							args[i] ?
								'typeof ' + args[i] + ' !== \'undefined\' && ' +
									args[i] + ' !== null ? ' +
									args[i] +
									':' +
									def :
								def :
							args[i] || 'void 0'
						) + ';';
				}

				this.save(argStr + proto.body);
			}
		}
	}
);