var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'forEach',

	{
		placement: 'template'
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			var part = command.split('=>'),
				val = this.prepareOutput(part[0], true);

			var varsStr = '';

			if (part[1]) {
				var vars = part[1].split(',');

				for (var i = 0; i < vars.length; i++) {
					var el = this.declVar(vars[i].trim());
					varsStr += 'var ' + el + ' = ';
				}
			}

			this.save(varsStr + 'if (' + this.prepareOutput(command, true) + ') {');
		}
	}
);

/**
 * Директива forIn
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['forIn'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "forIn" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('forIn');
	if (dir.isSimpleOutput()) {
		var part = command.split('=>'),
			val = dir.prepareOutput(part[0], true);

		dir.save(val + ' && Snakeskin.forIn(' + val +
			', function (' + (part[1] || '') + ') {');
	}
};

/**
 * Окончание forIn
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['forInEnd'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		dir.save('}, this);');
	}
};

Snakeskin.addDirective(
	'for',

	{
		placement: 'template'
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!command) {
			throw this.error('Invalid syntax');
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			var parts = command.split(';');

			if (parts.length !== 3) {
				throw this.error('Invalid syntax');
			}

			var rgxp = /var /;
			this.save('for (' +
				(rgxp.test(parts[0]) ?
					this.multiDeclVar(parts[0].replace(rgxp, '')) :
					this.prepareOutput(parts[0], true)
				) +
				this.prepareOutput(parts.slice(1).join(';'), true) +
			') {');
		}
	}
);


Snakeskin.addDirective(
	'while',

	{
		placement: 'template'
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!command) {
			throw this.error('Invalid syntax');
		}

		if (this.structure.name == 'do') {
			if (this.isSimpleOutput()) {
				this.save('} while (' + this.prepareOutput(command, true) + ');');
			}

			Snakeskin.Directions['end'](this);

		} else {
			this.startDir();
			if (this.isSimpleOutput()) {
				this.save('while (' + this.prepareOutput(command, true) + ') {');
			}
		}


	}
);

Snakeskin.addDirective(
	'repeat',

	{
		placement: 'template',
		sys: true
	},

	function () {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('do {');
		}
	}
);

Snakeskin.addDirective(
	'do',

	{
		placement: 'template',
		sys: true
	},

	function () {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('do {');
		}
	}
);

Snakeskin.addDirective(
	'until',

	{
		placement: 'template'
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!command) {
			throw this.error('Invalid syntax');
		}

		if (this.structure.name !== 'repeat') {
			throw this.error('Directive "' + this.name + '" can only be used with a "repeat"');
		}

		if (this.isSimpleOutput()) {
			this.save('} while (' + this.prepareOutput(command, true) + ');');
		}

		Snakeskin.Directions['end'](this);
	}
);

Snakeskin.addDirective(
	'break',

	{
		placement: 'template'
	},

	function () {
		var __NEJS_THIS__ = this;
		this.startInlineDir();

		if (!this.hasParent({
			'repeat': true,
			'while': true,
			'do': true,
			'forEach': true,
			'forIn': true
		})) {
			throw this.error('Directive "' + this.name + '" can only be used with a cycles');
		}

		if (this.isSimpleOutput()) {
			this.save('break;');
		}
	}
);

Snakeskin.addDirective(
	'continue',

	{
		placement: 'template'
	},

	function () {
		var __NEJS_THIS__ = this;
		this.startInlineDir();

		if (!this.hasParent({
			'repeat': true,
			'while': true,
			'do': true,
			'forEach': true,
			'forIn': true
		})) {
			throw this.error('Directive "' + this.name + '" can only be used with a cycles');
		}

		if (this.isSimpleOutput()) {
			this.save('continue;');
		}
	}
);
