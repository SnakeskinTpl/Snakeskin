var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.sysDirs['proto'] = true;

/**
 * Если true, то значит объявляется прототип
 * @type {boolean}
 */
DirObj.prototype.protoStart = false;

/**
 * Директива proto
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['proto'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	var name = command.match(/[^(]+/)[0];

	dir.startDir('proto', {
		name: name,
		startI: dir.i + 1
	});

	var params = command.match(/\((.*?)\)/);
	if (params) {
		params = params[1].split(',');
		for (var i = 0; i < params.length; i++) {
			dir.declVar(params[i]);
		}
	}

	if (dir.isAdvTest(adv.dryRun)) {
		// Попытка декларировать прототип блока несколько раз
		if (protoCache[dir.tplName][name]) {
			throw dir.error(
				'Proto "' + name + '" is already defined ' +
				'(command: {proto' + command + '}, template: "' + dir.tplName + ', ' +
					dir.genErrorAdvInfo(adv.info) +
				'")!'
			);
		}

		protoCache[dir.tplName][name] = {from: dir.i - dir.startI + 1};
	}

	if (!dir.parentTplName) {
		dir.protoStart = true;
	}
};

/**
 * Окончание proto
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 */
Snakeskin.Directions['protoEnd'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	var tplName = dir.tplName;
	var backHash = dir.backHash,
		lastProto = dir.structure.params;

	if (dir.isAdvTest(adv.dryRun)) {
		protoCache[tplName][lastProto.name].to = dir.i - dir.startI - commandLength - 1;
		fromProtoCache[tplName] = dir.i - dir.startI + 1;
	}

	// Рекурсивно анализируем прототипы блоков
	if (!dir.parentTplName) {
		protoCache[tplName][lastProto.name].body = Snakeskin.compile('{template ' + tplName + '()}' +
			dir.source.substring(lastProto.startI, dir.i - commandLength - 1) +
			'{end}', null, null, true, {scope: dir.scope, vars: dir.structure.vars});
	}

	if (backHash[lastProto.name] && !backHash[lastProto.name].protoStart) {
		Snakeskin.forEach(backHash[lastProto.name], function (el) {
			var __NEJS_THIS__ = this;
			dir.replace(dir.res.substring(0, el) +
				protoCache[tplName][lastProto.name].body +
				dir.res.substring(el));
		});

		delete backHash[lastProto.name];
		dir.backHashI--;
	}

	if (!dir.hasParent('proto')) {
		dir.protoStart = false;
	}
};

/**
 * Кеш обратных вызовов прототипов
 */
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

/**
 * Директива apply
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['apply'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "apply" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	var name = command.match(/[^(]+/)[0];
	dir.startInlineDir('apply');

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

			dir.backHash[name].push(dir.res.length);

		} else {
			dir.save(protoCache[dir.tplName][name].body);
		}
	}
};