(function()  {
	var $COverloadRgxp = /=>>/g;

	Snakeskin.addDirective(
		'forEach',

		{
			block: true,
			notEmpty: true,
			group: [
				'cycle',
				'callback',
				'inlineIterator'
			]
		},

		function (command) {var this$0 = this;
			command = command.replace($COverloadRgxp, '=>=>');
			var parts = command.split('=>'),
				obj = parts[0];

			if (!parts.length || parts.length > (this.inlineIterators ? 2 : 3)) {
				return this.error((("invalid \"" + (this.name)) + "\" declaration"));
			}

			this.startDir(parts.length === 3 ? '$forEach' : null, {
				params: parts[2] ? parts[1] : null
			});

			if (this.isReady()) {
				if (!this.inlineIterators) {
					if (parts.length === 3) {
						this.append(/* cbws */(("\
\n							$C(" + (this.prepareOutput(parts[0], true))) + (").forEach(function (" + (this.declCallbackArgs(parts))) + (") {\
\n								" + (this.declArguments())) + "\
\n						"));

					} else {
						this.append(/* cbws */(("\
\n							Snakeskin.forEach(\
\n								" + (this.prepareOutput(parts[0], true))) + (",\
\n								function (" + (this.declCallbackArgs(parts[1]))) + (") {\
\n									" + (this.declArguments())) + "\
\n						"));
					}

					return;
				}

				var tmpObj = this.multiDeclVar(("__I_OBJ__ = " + obj)),
					cacheObj = this.prepareOutput('__I_OBJ__', true);

				var objLength = this.multiDeclVar('__KEYS__ = Object.keys ? Object.keys(__I_OBJ__) : null'),
					keys = this.prepareOutput('__KEYS__', true);

				var args = parts[1] ?
					parts[1].trim().split(',') : [];

				if (args.length >= 6) {
					objLength += /* cbws */(("\
\n						" + (this.multiDeclVar(("__LENGTH__ = __KEYS__ ? __KEYS__.length : 0")))) + ("\
\n\
\n						if (!" + keys) + (") {\
\n							" + (this.multiDeclVar('__LENGTH__ = 0'))) + ("\
\n\
\n							for (" + (this.multiDeclVar('__KEY__', false))) + (" in " + cacheObj) + (") {\
\n								if (!" + cacheObj) + (".hasOwnProperty(" + (this.prepareOutput('__KEY__', true))) + (")) {\
\n									continue;\
\n								}\
\n\
\n								" + (this.prepareOutput('__LENGTH__++;', true))) + "\
\n							}\
\n						}\
\n					");
				}

				var resStr = /* cbws */(("\
\n					" + tmpObj) + ("\
\n\
\n					if (" + cacheObj) + (") {\
\n						if (Array.isArray(" + cacheObj) + (")) {\
\n							" + (this.multiDeclVar('__LENGTH__ =  __I_OBJ__.length'))) + ("\
\n							for (" + (this.multiDeclVar('__I__ = -1') + this.prepareOutput('++__I__ < __LENGTH__;', true))) + ") {\
\n				");

				resStr += (function()  {
					var str = '';

					for (var i = -1; ++i < args.length;) {
						var tmp = args[i];

						switch (i) {
							case 0: {
								tmp += ' = __I_OBJ__[__I__]';
							} break;

							case 1: {
								tmp += ' = __I__';
							} break;

							case 2: {
								tmp += ' = __I_OBJ__';
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

				var end = /* cbws */(("\
\n					} else {\
\n						" + objLength) + ("\
\n\
\n						if (" + keys) + (") {\
\n							" + (this.multiDeclVar(("__LENGTH__ = __KEYS__.length")))) + ("\
\n							for (" + (this.multiDeclVar('__I__ = -1') + this.prepareOutput('++__I__ < __LENGTH__;', true))) + ") {\
\n				");

				end += (function()  {
					var str = '';

					for (var i = -1; ++i < args.length;) {
						var tmp = args[i];

						switch (i) {
							case 0: {
								tmp += ' = __I_OBJ__[__KEYS__[__I__]]';
							} break;

							case 1: {
								tmp += ' = __KEYS__[__I__]';
							} break;

							case 2: {
								tmp += ' = __I_OBJ__';
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

				var oldEnd = /* cbws */(("\
\n					} else {\
\n						" + (this.multiDeclVar('__I__ = -1'))) + ("\
\n\
\n						for (" + (this.multiDeclVar('__KEY__', false))) + (" in " + cacheObj) + (") {\
\n							if (!" + cacheObj) + (".hasOwnProperty(" + (this.prepareOutput('__KEY__', true))) + (")) {\
\n								continue;\
\n							}\
\n\
\n							" + (this.prepareOutput('__I__++;', true))) + "\
\n				");

				oldEnd += (function()  {
					var str = '';

					for (var i = -1; ++i < args.length;) {
						var tmp = args[i];

						switch (i) {
							case 0: {
								tmp += ' = __I_OBJ__[__KEY__]';
							} break;

							case 1: {
								tmp += ' = __KEY__';
							} break;

							case 2: {
								tmp += ' = __I_OBJ__';
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

				this.append(resStr);
				this.structure.params = {
					from: this.res.length,
					end: end,
					oldEnd: oldEnd
				};
			}
		},

		function () {
			if (this.isReady()) {
				var params = this.structure.params;

				if (this.inlineIterators) {
					var part = this.res
						.substring(params.from);

					this.append((("} " + (params.end + part)) + (" } " + (params.oldEnd + part)) + " }}}}"));

				} else {
					if (params.params) {
						this.append((("}, " + (this.prepareOutput(params.params, true))) + ");"));

					} else {
						this.append('});');
					}
				}
			}
		}
	);

	Snakeskin.addDirective(
		'$forEach',

		{
			block: true,
			notEmpty: true,
			group: [
				'cycle',
				'callback',
				'selfThis'
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

			if (this.isReady()) {
				this.append(/* cbws */(("\
\n					$C(" + (this.prepareOutput(parts[0], true))) + (").forEach(function (" + (this.declCallbackArgs(parts))) + (") {\
\n						" + (this.declArguments())) + "\
\n				"));
			}
		},

		function () {
			if (this.isReady()) {
				var params = this.structure.params.params;

				if (params) {
					this.append((("}, " + (this.prepareOutput(params, true))) + ");"));

				} else {
					this.append('});');
				}
			}
		}
	);

	Snakeskin.addDirective(
		'forIn',

		{
			block: true,
			notEmpty: true,
			group: [
				'cycle',
				'callback',
				'inlineIterator'
			]
		},

		function (command) {var this$0 = this;
			var parts = command.split('=>'),
				obj = parts[0];

			if (!parts.length || parts.length > 2) {
				return this.error((("invalid \"" + (this.name)) + "\" declaration"));
			}

			this.startDir();
			if (this.isReady()) {
				if (!this.inlineIterators) {
					this.append(/* cbws */(("\
\n						Snakeskin.forIn(\
\n							" + (this.prepareOutput(parts[0], true))) + (",\
\n							function (" + (this.declCallbackArgs(parts[1]))) + (") {\
\n								" + (this.declArguments())) + "\
\n					"));

					return;
				}

				var objLength = '';
				var args = parts[1] ?
					parts[1].trim().split(',') : [];

				var tmpObj = this.multiDeclVar(("__I_OBJ__ = " + obj)),
					cacheObj = this.prepareOutput('__I_OBJ__', true);

				if (args.length >= 6) {
					objLength += /* cbws */(("\
\n						" + (this.multiDeclVar('__LENGTH__ = 0'))) + ("\
\n\
\n						for (" + (this.multiDeclVar('key', false))) + (" in " + cacheObj) + (") {\
\n							" + (this.prepareOutput('__LENGTH__++;', true))) + "\
\n						}\
\n					");
				}

				var resStr = /* cbws */(("\
\n					" + tmpObj) + ("\
\n\
\n					if (" + cacheObj) + (") {\
\n\
\n						" + objLength) + ("\
\n						" + (this.multiDeclVar('__I__ = -1'))) + ("\
\n\
\n						for (" + (this.multiDeclVar('__KEY__', false))) + (" in " + cacheObj) + (") {\
\n							" + (this.prepareOutput('__I__++;', true))) + "\
\n				");

				resStr += (function()  {
					var str = '';

					for (var i = -1; ++i < args.length;) {
						var tmp = args[i];

						switch (i) {
							case 0: {
								tmp += ' = __I_OBJ__[__KEY__]';
							} break;

							case 1: {
								tmp += ' = __KEY__';
							} break;

							case 2: {
								tmp += ' = __I_OBJ__';
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

				this.append(resStr);
			}
		},

		function () {
			if (this.isReady()) {
				this.append(this.inlineIterators ? '}}' : '});');
			}
		}
	);
})();
