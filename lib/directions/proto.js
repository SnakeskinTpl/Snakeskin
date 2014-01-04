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

/**
 * Кеш внещних прототипов
 * @type {!Object}
 */
DirObj.prototype.preProtos = {};

DirObj.prototype.returnArgs = function (protoArgs, args) {
	var __NEJS_THIS__ = this;
	var str = 'var ' + protoArgs[0][0] + ' = ' + protoArgs[0][1] + ';';

	for (var i = 1; i < protoArgs.length; i++) {
		var val = this.prepareOutput(args[i - 1] || null, true);

		var arg = protoArgs[i][0],
			def = protoArgs[i][1];

		str += 'var ' + arg + ' = ' +
			(def !== void 0 ?
				val ?
					'typeof ' + val + ' !== \'undefined\' && ' +
						val + ' !== null ? ' +
						val +
						':' +
						def :
					def :
				val || 'void 0'
			) + ';';
	}

	return str;
};

Snakeskin.addDirective(
	'proto',

	{
		sys: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		var name = command.match(/[^(]+/)[0],
			parts = name.split('->');

		if (parts[1]) {
			name = parts[1].trim();
			this.tplName = parts[0].trim();
		}

		this.startDir(null, {
			name: name,
			startI: this.i + 1
		});

		if (this.isAdvTest()) {
			if (protoCache[this.tplName][name]) {
				throw this.error('Proto "' + name + '" is already defined');
			}

			var args = command.match(/\((.*?)\)/),
				argsMap = [
					[this.declVar('__I_PROTO__'), 1]
				];

			if (args) {
				args = args[1].split(',');
				for (var i = 0; i < args.length; i++) {
					var arg = args[i].split('=');
					arg[0] = this.declVar(arg[0].trim());
					argsMap.push(arg);
				}
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
					'{__protoWhile__ __I_PROTO__--}' +
						this.source.substring(lastProto.startI, this.i - commandLength - 1) +
					'{end}' +
				'{end}',

				null,
				null,

				{
					scope: this.scope,
					vars: this.structure.vars,
					proto: lastProto.name
				}
			);
		}

		var back = this.backTable[lastProto.name];
		if (back && !back.protoStart) {
			var args = proto.args;

			for (var i = 0; i < back.length; i++) {
				var el = back[i];

				if (this.canWrite) {
					this.res = this.res.substring(0, el.pos) +
						this.returnArgs(args, el.args) +
						protoCache[tplName][lastProto.name].body +
						this.res.substring(el.pos);
				}
			}

			delete this.backTable[lastProto.name];
			this.backTableI--;
		}

		if (!this.hasParent('proto')) {
			this.protoStart = false;
		}
	}
);

DirObj.prototype.backTable = {
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
DirObj.prototype.backTableI = 0;

/**
 * Имя последнего обратного прототипа
 * @type {?string}
 */
DirObj.prototype.lastBack = null;

Snakeskin.addDirective(
	'apply',

	{
		placement: 'template'
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			var name = command.match(/[^(]+/)[0],
				args = command.match(/\((.*?)\)/);

			var proto = protoCache[this.tplName][name],
				argsStr;

			if (proto) {
				argsStr = this.returnArgs(proto.args, args ? args[1].split(',') : []);
			}

			if (this.proto === name) {
				this.save(argsStr + this.prepareOutput('__I_PROTO__++', true) + ';');

			// Попытка применить не объявленный прототип
			// (запоминаем место вызова, чтобы вернуться к нему,
			// когда прототип будет объявлен)
			} else if (!proto) {
				if (!this.backTable[name]) {
					this.backTable[name] = [];
					this.backTable[name].protoStart = this.protoStart;

					this.lastBack = name;
					this.backTableI++;
				}

				this.backTable[name].push({
					pos: this.res.length,
					args: args
				});

			} else {
				this.save(argsStr + proto.body);
			}
		}
	}
);