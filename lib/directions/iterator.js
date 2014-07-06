Snakeskin.addDirective(
	'forEach',

	{
		block: true,
		placement: 'template',
		notEmpty: true,
		group: [
			'cycle',
			'callback'
		]
	},

	function (command) {var this$0 = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			var parts = command.split('=>'),
				obj = parts[0];

			if (!parts.length || parts.length > 2) {
				return this.error((("invalid \"" + (this.name)) + "\" declaration"));
			}

			if (!this.inlineIterators) {
				this.save((("\
\n					Snakeskin.forEach(\
\n						" + (this.prepareOutput((("(" + (parts[0])) + ")"), true))) + (",\
\n						function (" + (this.declCallbackArgs(parts[1]))) + ") {\
\n				"));

				return;
			}

			var tmpObj = this.multiDeclVar(("__TMP__ = " + obj)),
				cacheObj = this.prepareOutput('__TMP__', true);

			var objLength = this.multiDeclVar('__KEYS__ = Object.keys ? Object.keys(__TMP__) : null'),
				keys = this.prepareOutput('__KEYS__', true);

			var args = parts[1] ?
				parts[1].trim().split(',') : [];

			if (args.length >= 6) {
				objLength += (("\
\n					" + (this.multiDeclVar(("__LENGTH__ = __KEYS__ ? __KEYS__.length : 0")))) + ("\
\n\
\n					if (!" + keys) + (") {\
\n						" + (this.multiDeclVar('__LENGTH__ = 0'))) + ("\
\n\
\n						for (" + (this.multiDeclVar('__KEY__', false))) + (" in " + cacheObj) + (") {\
\n							if (!" + cacheObj) + (".hasOwnProperty(" + (this.prepareOutput('__KEY__', true))) + (")) {\
\n								continue;\
\n							}\
\n\
\n							" + (this.prepareOutput('__LENGTH__++;', true))) + "\
\n						}\
\n					}\
\n				");
			}

			var resStr = (("\
\n				" + tmpObj) + ("\
\n\
\n				if (" + cacheObj) + (") {\
\n					if (Array.isArray(" + cacheObj) + (")) {\
\n						" + (this.multiDeclVar('__LENGTH__ =  __TMP__.length'))) + ("\
\n						for (" + (this.multiDeclVar('__I__ = -1') + this.prepareOutput('++__I__ < __LENGTH__;', true))) + ") {\
\n			");

			resStr += (function()  {
				var str = '';

				for (var i = 0; i < args.length; i++) {
					var tmp = args[i];

					switch (i) {
						case 0: {
							tmp += ' = __TMP__[__I__]';
						} break;

						case 1: {
							tmp += ' = __I__';
						} break;

						case 2: {
							tmp += ' = __TMP__';
						} break;

						case 3: {
							tmp += ' = __I__ === 0';
						} break;

						case 4: {
							tmp += ' = __I__ === __LENGTH__ - 1';
						} break;

						case 5: {
							tmp += ' = __LENGTH__';
						} break;
					}

					str += this$0.multiDeclVar(tmp);
				}

				return str;
			})();

			var end = (("\
\n				} else {\
\n					" + objLength) + ("\
\n\
\n					if (" + keys) + (") {\
\n						" + (this.multiDeclVar(("__LENGTH__ = __KEYS__.length")))) + ("\
\n						for (" + (this.multiDeclVar('__I__ = -1') + this.prepareOutput('++__I__ < __LENGTH__;', true))) + ") {\
\n			");

			end += (function()  {
				var str = '';

				for (var i = 0; i < args.length; i++) {
					var tmp = args[i];

					switch (i) {
						case 0: {
							tmp += ' = __TMP__[__KEYS__[__I__]]';
						} break;

						case 1: {
							tmp += ' = __KEYS__[__I__]';
						} break;

						case 2: {
							tmp += ' = __TMP__';
						} break;

						case 3: {
							tmp += ' = __I__';
						} break;

						case 4: {
							tmp += ' = __I__ === 0';
						} break;

						case 5: {
							tmp += ' = __I__ === __LENGTH__ - 1';
						} break;

						case 6: {
							tmp += ' = __LENGTH__';
						} break;
					}

					str += this$0.multiDeclVar(tmp);
				}

				return str;
			})();

			var oldEnd = (("\
\n				} else {\
\n					" + (this.multiDeclVar('__I__ = -1'))) + ("\
\n\
\n					for (" + (this.multiDeclVar('__KEY__', false))) + (" in " + cacheObj) + (") {\
\n						if (!" + cacheObj) + (".hasOwnProperty(" + (this.prepareOutput('__KEY__', true))) + (")) {\
\n							continue;\
\n						}\
\n\
\n						" + (this.prepareOutput('__I__++;', true))) + "\
\n			");

			oldEnd += (function()  {
				var str = '';

				for (var i = 0; i < args.length; i++) {
					var tmp = args[i];

					switch (i) {
						case 0: {
							tmp += ' = __TMP__[__KEY__]';
						} break;

						case 1: {
							tmp += ' = __KEY__';
						} break;

						case 2: {
							tmp += ' = __TMP__';
						} break;

						case 3: {
							tmp += ' = __I__';
						} break;

						case 4: {
							tmp += ' = __I__ === 0';
						} break;

						case 5: {
							tmp += ' = __I__ === __LENGTH__ - 1';
						} break;

						case 6: {
							tmp += ' = __LENGTH__';
						} break;
					}

					str += this$0.multiDeclVar(tmp);
				}

				return str;
			})();

			this.save(resStr);
			this.structure.params = {
				from: this.res.length,
				end: end,
				oldEnd: oldEnd
			};
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			if (!this.inlineIterators) {
				this.save('});');

			} else {
				var params = this.structure
					.params;

				var part = this.res
					.substring(params.from);

				this.save((("} " + (params.end + part)) + (" } " + (params.oldEnd + part)) + " }}}}"));
			}
		}
	}
);

Snakeskin.addDirective(
	'$forEach',

	{
		block: true,
		placement: 'template',
		notEmpty: true,
		group: [
			'cycle',
			'callback'
		]
	},

	function (command) {
		var parts = command.split('=>');

		if (!parts.length || parts.length > 3) {
			return this.error((("invalid \"" + (this.name)) + "\" declaration"));
		}

		this.startDir(null, {
			params: parts[2] ? parts[1] : null
		});

		if (this.isSimpleOutput()) {
			this.save((("$C(" + (this.prepareOutput((("(" + (parts[0])) + ")"), true))) + (").forEach(function (" + (this.declCallbackArgs(parts))) + ") {"));
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			var params = this.structure.params.params;

			if (params) {
				this.save((("}, " + (this.prepareOutput(params, true))) + ");"));

			} else {
				this.save('});');
			}
		}
	}
);

Snakeskin.addDirective(
	'forIn',

	{
		block: true,
		placement: 'template',
		notEmpty: true,
		group: [
			'cycle',
			'callback'
		]
	},

	function (command) {var this$0 = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			var parts = command.split('=>'),
				obj = parts[0];

			if (!parts.length || parts.length > 2) {
				return this.error((("invalid \"" + (this.name)) + "\" declaration"));
			}

			if (!this.inlineIterators) {
				this.save((("\
\n					Snakeskin.forIn(\
\n						" + (this.prepareOutput((("(" + (parts[0])) + ")"), true))) + (",\
\n						function (" + (this.declCallbackArgs(parts[1]))) + ") {\
\n				"));

				return;
			}

			var objLength = '';
			var args = parts[1] ?
				parts[1].trim().split(',') : [];

			var tmpObj = this.multiDeclVar(("__TMP__ = " + obj)),
				cacheObj = this.prepareOutput('__TMP__', true);

			if (args.length >= 6) {
				objLength += (("\
\n					" + (this.multiDeclVar('__LENGTH__ = 0'))) + ("\
\n\
\n					for (" + (this.multiDeclVar('key', false))) + (" in " + cacheObj) + (") {\
\n						" + (this.prepareOutput('__LENGTH__++;', true))) + "\
\n					}\
\n				");
			}

			var resStr = (("\
\n				" + tmpObj) + ("\
\n\
\n				if (" + cacheObj) + (") {\
\n\
\n					" + objLength) + ("\
\n					" + (this.multiDeclVar('__I__ = -1'))) + ("\
\n\
\n					for (" + (this.multiDeclVar('__KEY__', false))) + (" in " + cacheObj) + (") {\
\n						" + (this.prepareOutput('__I__++;', true))) + "\
\n			");

			resStr += (function()  {
				var str = '';

				for (var i = 0; i < args.length; i++) {
					var tmp = args[i];

					switch (i) {
						case 0: {
							tmp += ' = __TMP__[__KEY__]';
						} break;

						case 1: {
							tmp += ' = __KEY__';
						} break;

						case 2: {
							tmp += ' = __TMP__';
						} break;

						case 3: {
							tmp += ' = __I__';
						} break;

						case 4: {
							tmp += ' = __I__ === 0';
						} break;

						case 5: {
							tmp += ' = __I__ === __LENGTH__ - 1';
						} break;

						case 6: {
							tmp += ' = __LENGTH__';
						} break;
					}

					str += this$0.multiDeclVar(tmp);
				}

				return str;
			})();

			this.save(resStr);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			if (!this.inlineIterators) {
				this.save('});');

			} else {
				this.save('}}');
			}
		}
	}
);