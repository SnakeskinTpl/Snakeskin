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

	function (command, commandLength, dir, params) {
		
		var name = command.match(/[^(]+/)[0];

		dir.startDir(params.name, {
			name: name,
			startI: dir.i + 1
		});

		var args = command.match(/\((.*?)\)/),
			argsMap = [];

		if (args) {
			args = args[1].split(',');
			for (var i = 0; i < args.length; i++) {
				argsMap.push(dir.declVar(args[i]));
			}
		}

		if (dir.isAdvTest(adv.dryRun)) {
			// Попытка декларировать прототип блока несколько раз
			if (protoCache[dir.tplName][name]) {
				throw dir.error('Proto "' + name + '" is already defined, ' +
					dir.genErrorAdvInfo(params.info)
				);
			}

			protoCache[dir.tplName][name] = {
				from: dir.i - dir.startI + 1,
				args: argsMap
			};
		}

		if (!dir.parentTplName) {
			dir.protoStart = true;
		}
	},

	function (command, commandLength, dir) {
		
		var tplName = dir.tplName,
			lastProto = dir.structure.params;

		var proto = protoCache[tplName][lastProto.name];

		if (dir.isAdvTest(adv.dryRun)) {
			proto.to = dir.i - dir.startI - commandLength - 1;
			fromProtoCache[tplName] = dir.i - dir.startI + 1;
		}

		// Рекурсивно анализируем прототипы блоков
		if (!dir.parentTplName) {
			proto.body = Snakeskin.compile(
				'{template ' + tplName + '()}' +
					dir.source.substring(lastProto.startI, dir.i - commandLength - 1) +
				'{end}',

				null,
				null,
				true,

				{
					scope: dir.scope,
					vars: dir.structure.vars
				}
			);
		}

		var bacs = dir.backHash[lastProto.name];
		if (bacs && !bacs.protoStart) {
			var args = proto.args;

			for (var i = 0; i < bacs.length; i++) {
				var el = bacs[i];

				var params = el.args,
					paramsStr = '';

				for (var j = 0; i < args.length; j++) {
					paramsStr += 'var ' + args[i] + ' = ' + params[i] + ';';
				}

				dir.replace(
					dir.res.substring(0, el.pos) +
					paramsStr +
					protoCache[tplName][lastProto.name].body +
					dir.res.substring(el.pos)
				);
			}

			delete dir.backHash[lastProto.name];
			dir.backHashI--;
		}

		if (!dir.hasParent('proto')) {
			dir.protoStart = false;
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

	null,

	function (command, commandLength, dir, params) {
		
		if (!dir.structure.parent) {
			throw dir.error('Directive "' + params.name + '" can only be used within a "template" or "proto", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		var name = command.match(/[^(]+/)[0];
		dir.startInlineDir(params.name);

		var args = command.match(/\((.*?)\)/);
		if (args) {
			args = args[1].split(',');

		} else {
			args = [];
		}

		if (!dir.parentTplName && !dir.hasParent('proto')) {
			// Попытка применить не объявленный прототип
			// (запоминаем место вызова, чтобы вернуться к нему,
			// когда прототип будет объявлен)
			if (!protoCache[dir.tplName][name]) {
				if (!dir.backHash[name]) {
					dir.backHash[name] = [];
					dir.backHash[name].protoStart = dir.protoStart;

					dir.lastBack = name;
					dir.backHashI++;
				}

				dir.backHash[name].push({
					pos: dir.res.length,
					args: args
				});

			} else {
				var proto = protoCache[dir.tplName][name];
				var protoArgs = proto.args;

				for (var i = 0; i < protoArgs.length; i++) {
					dir.save('var ' + protoArgs[i] + ' = ' + params[i] + ';');
				}

				dir.save(proto.body);
			}
		}
	}
);