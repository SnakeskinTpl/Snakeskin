var $freeze$0 = Object.freeze;var $defProps$0 = Object.defineProperties;var $TS$0 = $freeze$0($defProps$0(["\n							$C(", ").forEach(function (", ") {\n								", "\n						"], {"raw": {"value": $freeze$0(["\n							\\$C(", ").forEach(function (", ") {\n								", "\n						"])}}));var $TS$1 = ["\n							Snakeskin.forEach(\n								", ",\n								function (", ") {\n									", "\n						"];$TS$1 = $freeze$0($defProps$0($TS$1, {"raw": {"value": $TS$1}}));var $TS$2 = ["\n						", "\n\n						if (!", ") {\n							", "\n\n							for (", " in ", ") {\n								if (!", ".hasOwnProperty(", ")) {\n									continue;\n								}\n\n								", "\n							}\n						}\n					"];$TS$2 = $freeze$0($defProps$0($TS$2, {"raw": {"value": $TS$2}}));var $TS$3 = ["\n					", "\n\n					if (", ") {\n						if (Array.isArray(", ")) {\n							", "\n							for (", ") {\n				"];$TS$3 = $freeze$0($defProps$0($TS$3, {"raw": {"value": $TS$3}}));var $TS$4 = ["\n					} else {\n						", "\n\n						if (", ") {\n							", "\n							for (", ") {\n				"];$TS$4 = $freeze$0($defProps$0($TS$4, {"raw": {"value": $TS$4}}));var $TS$5 = ["\n					} else {\n						", "\n\n						for (", " in ", ") {\n							if (!", ".hasOwnProperty(", ")) {\n								continue;\n							}\n\n							", "\n				"];$TS$5 = $freeze$0($defProps$0($TS$5, {"raw": {"value": $TS$5}}));var $TS$6 = $freeze$0($defProps$0(["\n					$C(", ").forEach(function (", ") {\n						", "\n				"], {"raw": {"value": $freeze$0(["\n					\\$C(", ").forEach(function (", ") {\n						", "\n				"])}}));var $TS$7 = ["\n						Snakeskin.forIn(\n							", ",\n							function (", ") {\n								", "\n					"];$TS$7 = $freeze$0($defProps$0($TS$7, {"raw": {"value": $TS$7}}));var $TS$8 = ["\n						", "\n\n						for (", " in ", ") {\n							", "\n						}\n					"];$TS$8 = $freeze$0($defProps$0($TS$8, {"raw": {"value": $TS$8}}));var $TS$9 = ["\n					", "\n\n					if (", ") {\n\n						", "\n						", "\n\n						for (", " in ", ") {\n							", "\n				"];$TS$9 = $freeze$0($defProps$0($TS$9, {"raw": {"value": $TS$9}}));(function()  {
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
						this.append(cbws($TS$0
, this.prepareOutput(parts[0], true), this.declCallbackArgs(parts)
, this.declArguments()
));

					} else {
						this.append(cbws($TS$1

, this.prepareOutput(parts[0], true)
, this.declCallbackArgs(parts[1])
, this.declArguments()
));
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
					objLength += cbws($TS$2
, this.multiDeclVar(("__LENGTH__ = __KEYS__ ? __KEYS__.length : 0"))

, keys
, this.multiDeclVar('__LENGTH__ = 0')

, this.multiDeclVar('__KEY__', false), cacheObj
, cacheObj, this.prepareOutput('__KEY__', true)



, this.prepareOutput('__LENGTH__++;', true)


);
				}

				var resStr = cbws($TS$3
, tmpObj

, cacheObj
, cacheObj
, this.multiDeclVar('__LENGTH__ =  __I_OBJ__.length')
, this.multiDeclVar('__I__ = -1') + this.prepareOutput('++__I__ < __LENGTH__;', true)
);

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

				var end = cbws($TS$4

, objLength

, keys
, this.multiDeclVar(("__LENGTH__ = __KEYS__.length"))
, this.multiDeclVar('__I__ = -1') + this.prepareOutput('++__I__ < __LENGTH__;', true)
);

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

				var oldEnd = cbws($TS$5

, this.multiDeclVar('__I__ = -1')

, this.multiDeclVar('__KEY__', false), cacheObj
, cacheObj, this.prepareOutput('__KEY__', true)



, this.prepareOutput('__I__++;', true)
);

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
				this.append(cbws($TS$6
, this.prepareOutput(parts[0], true), this.declCallbackArgs(parts)
, this.declArguments()
));
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
					this.append(cbws($TS$7

, this.prepareOutput(parts[0], true)
, this.declCallbackArgs(parts[1])
, this.declArguments()
));

					return;
				}

				var objLength = '';
				var args = parts[1] ?
					parts[1].trim().split(',') : [];

				var tmpObj = this.multiDeclVar(("__I_OBJ__ = " + obj)),
					cacheObj = this.prepareOutput('__I_OBJ__', true);

				if (args.length >= 6) {
					objLength += cbws($TS$8
, this.multiDeclVar('__LENGTH__ = 0')

, this.multiDeclVar('key', false), cacheObj
, this.prepareOutput('__LENGTH__++;', true)

);
				}

				var resStr = cbws($TS$9
, tmpObj

, cacheObj

, objLength
, this.multiDeclVar('__I__ = -1')

, this.multiDeclVar('__KEY__', false), cacheObj
, this.prepareOutput('__I__++;', true)
);

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
