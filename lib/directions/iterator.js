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

			var args = part[1] ? part[1].trim().split(',') : [];

			var tmp = this.multiDeclVar('__TMP__ = ' + val),
				cache = this.prepareOutput('__TMP__', true);

			var oLength = '';
			if (args.length >= 5) {
				oLength +=
					this.multiDeclVar('__TMP_LENGTH__ = 0') +
					'for (' + this.multiDeclVar('key', false) + 'in ' + cache + ') {' +
						'if (!' + cache + '.hasOwnProperty(' + this.prepareOutput('key', true) + ')) { continue; }' +
						this.prepareOutput('__TMP_LENGTH__++;', true) +
					'}';
			}

			var resStr =
				tmp +
				'if (' + cache + ') {' +
					'if (Array.isArray(' + cache + ')) {' +
						this.multiDeclVar('__TMP_LENGTH__ = __TMP__.length') +
						'for (' + this.multiDeclVar('__I__ = 0') + this.prepareOutput('__I__ < __TMP_LENGTH__; __I__++', true) + ') {' +
							(function () {
								
								var str = '';

								for (var i = 0; i < args.length; i++) {
									switch (i) {
										case 0: {
											str += __NEJS_THIS__.multiDeclVar(args[i] + ' = ' + cache + '[__I__]');
										} break;

										case 1: {
											str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__');
										} break;

										case 2: {
											str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__ === 0');
										} break;

										case 3: {
											str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__ === __TMP_LENGTH__ - 1');
										} break;

										case 4: {
											str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __TMP_LENGTH__');
										} break;
									}
								}

								return str;
							})()
				;

			var end =
				'} else {' +
					oLength +
					this.multiDeclVar('__I__ = -1') +
					'for (' + this.multiDeclVar('__KEY__', false) + 'in ' + cache + ') {' +
						'if (!' + cache + '.hasOwnProperty(' + this.prepareOutput('__KEY__', true) + ')) { continue; }' +
						this.prepareOutput('__I__++;', true) +

						(function () {
							
							var str = '';

							for (var i = 0; i < args.length; i++) {
								switch (i) {
									case 0: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = ' + cache + '[__KEY__]');
									} break;

									case 1: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __KEY__');
									} break;

									case 2: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__');
									} break;

									case 3: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__ === 0');
									} break;

									case 4: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__ === __TMP_LENGTH__ - 1');
									} break;

									case 5: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __TMP_LENGTH__');
									} break;
								}
							}

							return str;
						})()
				;

			this.save(resStr);
			this.structure.params = {
				from: this.res.length,
				end: end
			};
		}
	},

	function () {
		var __NEJS_THIS__ = this;
		if (this.isSimpleOutput()) {
			var params = this.structure.params;
			this.save('}' + params.end + this.res.substring(params.from) + '}}}');
		}
	}
);

Snakeskin.addDirective(
	'forIn',

	{
		placement: 'template'
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			var part = command.split('=>'),
				val = this.prepareOutput(part[0], true);

			var args = part[1] ? part[1].trim().split(',') : [];

			var tmp = this.multiDeclVar('__TMP__ = ' + val),
				cache = this.prepareOutput('__TMP__', true);

			var oLength = '';
			if (args.length >= 5) {
				oLength +=
					this.multiDeclVar('__TMP_LENGTH__ = 0') +
					'for (' + this.multiDeclVar('key', false) + 'in ' + cache + ') {' +
						this.prepareOutput('__TMP_LENGTH__++;', true) +
					'}';
			}

			var resStr =
				tmp +
				'if (' + cache + ') {' +
					oLength +
					this.multiDeclVar('__I__ = -1') +
					'for (' + this.multiDeclVar('__KEY__', false) + 'in ' + cache + ') {' +
						this.prepareOutput('__I__++;', true) +

						(function () {
							
							var str = '';

							for (var i = 0; i < args.length; i++) {
								switch (i) {
									case 0: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = ' + cache + '[__KEY__]');
									} break;

									case 1: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __KEY__');
									} break;

									case 2: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__');
									} break;

									case 3: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__ === 0');
									} break;

									case 4: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__ === __TMP_LENGTH__ - 1');
									} break;

									case 5: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __TMP_LENGTH__');
									} break;
								}
							}

							return str;
						})()
			;

			this.save(resStr);
		}
	},

	function () {
		var __NEJS_THIS__ = this;
		if (this.isSimpleOutput()) {
			this.save('}}');
		}
	}
);

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
