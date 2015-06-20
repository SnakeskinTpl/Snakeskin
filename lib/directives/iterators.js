/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

{
	let $COverloadRgxp = /=>>/g;

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

		function (command) {
			command = command.replace($COverloadRgxp, '=>=>');
			var parts = command.split('=>'),
				obj = parts[0];

			if (!parts.length || parts.length > (this.inlineIterators ? 2 : 3)) {
				return this.error(`invalid "${this.name}" declaration`);
			}

			this.startDir(parts.length === 3 ? '$forEach' : null, {
				params: parts[2] ? parts[1] : null
			});

			if (this.isReady()) {
				if (!this.inlineIterators) {
					if (parts.length === 3) {
						this.append(ws`
							${this.out(`$C(${parts[0]})`, {sys: true})}.forEach(function (${this.declCallbackArgs(parts)}) {
								${this.declArguments()}
						`);

					} else {
						this.append(ws`
							Snakeskin.forEach(
								${this.out(parts[0], {sys: true})},
								function (${this.declCallbackArgs(parts[1])}) {
									${this.declArguments()}
						`);
					}

					return;
				}

				let tmpObj = this.declVars(`__I_OBJ__ = ${obj}`),
					cacheObj = this.out('__I_OBJ__', {sys: true});

				let objLength = this.declVars('__KEYS__ = Object.keys ? Object.keys(__I_OBJ__) : null'),
					keys = this.out('__KEYS__', {sys: true});

				let args = parts[1] ?
					parts[1].trim().split(',') : [];

				if (args.length >= 6) {
					objLength += ws`
						${this.declVars(`__LENGTH__ = __KEYS__ ? __KEYS__.length : 0`)}

						if (!${keys}) {
							${this.declVars('__LENGTH__ = 0')}

							for (${this.declVars('__KEY__', false)} in ${cacheObj}) {
								if (!${cacheObj}.hasOwnProperty(${this.out('__KEY__', {sys: true})})) {
									continue;
								}

								${this.out('__LENGTH__++;', {sys: true})}
							}
						}
					`;
				}

				let resStr = ws`
					${tmpObj}

					if (${cacheObj}) {
						if (Array.isArray(${cacheObj})) {
							${this.declVars('__LENGTH__ =  __I_OBJ__.length')}
							for (${this.declVars('__I__ = -1') + this.out('++__I__ < __LENGTH__;', {sys: true})}) {
				`;

				resStr += (() => {
					var str = '';

					for (let i = -1; ++i < args.length;) {
						let tmp = args[i];

						switch (i) {
							case 0:
								tmp += ' = __I_OBJ__[__I__]';
								break;

							case 1:
								tmp += ' = __I__';
								break;

							case 2:
								tmp += ' = __I_OBJ__';
								break;

							case 3:
								tmp += ' = __I__ === 0';
								break;

							case 4:
								tmp += ' = __I__ === __LENGTH__ - 1';
								break;

							case 5:
								tmp += ' = __LENGTH__';
								break;
						}

						str += this.declVars(tmp);
					}

					return str;
				})();

				let end = ws`
					} else {
						${objLength}

						if (${keys}) {
							${this.declVars(`__LENGTH__ = __KEYS__.length`)}
							for (${this.declVars('__I__ = -1') + this.out('++__I__ < __LENGTH__;', {sys: true})}) {
				`;

				end += (() => {
					var str = '';

					for (let i = -1; ++i < args.length;) {
						let tmp = args[i];

						switch (i) {
							case 0:
								tmp += ' = __I_OBJ__[__KEYS__[__I__]]';
								break;

							case 1:
								tmp += ' = __KEYS__[__I__]';
								break;

							case 2:
								tmp += ' = __I_OBJ__';
								break;

							case 3:
								tmp += ' = __I__';
								break;

							case 4:
								tmp += ' = __I__ === 0';
								break;

							case 5:
								tmp += ' = __I__ === __LENGTH__ - 1';
								break;

							case 6:
								tmp += ' = __LENGTH__';
								break;
						}

						str += this.declVars(tmp);
					}

					return str;
				})();

				let oldEnd = ws`
					} else {
						${this.declVars('__I__ = -1')}

						for (${this.declVars('__KEY__', false)} in ${cacheObj}) {
							if (!${cacheObj}.hasOwnProperty(${this.out('__KEY__', {sys: true})})) {
								continue;
							}

							${this.out('__I__++;', {sys: true})}
				`;

				oldEnd += (() => {
					var str = '';

					for (let i = -1; ++i < args.length;) {
						let tmp = args[i];

						switch (i) {
							case 0:
								tmp += ' = __I_OBJ__[__KEY__]';
								break;

							case 1:
								tmp += ' = __KEY__';
								break;

							case 2:
								tmp += ' = __I_OBJ__';
								break;

							case 3:
								tmp += ' = __I__';
								break;

							case 4:
								tmp += ' = __I__ === 0';
								break;

							case 5:
								tmp += ' = __I__ === __LENGTH__ - 1';
								break;

							case 6:
								tmp += ' = __LENGTH__';
								break;
						}

						str += this.declVars(tmp);
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
				let params = this.structure.params;

				if (this.inlineIterators) {
					let part = this.res
						.substring(params.from);

					this.append(`} ${params.end + part} } ${params.oldEnd + part} }}}}`);

				} else {
					if (params.params) {
						this.append(`}, ${this.out(params.params, {sys: true})});`);

					} else {
						this.append('});');
					}
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

		function (command) {
			var parts = command.split('=>'),
				obj = parts[0];

			if (!parts.length || parts.length > 2) {
				return this.error(`invalid "${this.name}" declaration`);
			}

			this.startDir();
			if (this.isReady()) {
				if (!this.inlineIterators) {
					this.append(ws`
						Snakeskin.forIn(
							${this.out(parts[0], {sys: true})},
							function (${this.declCallbackArgs(parts[1])}) {
								${this.declArguments()}
					`);

					return;
				}

				let objLength = '';
				let args = parts[1] ?
					parts[1].trim().split(',') : [];

				let tmpObj = this.declVars(`__I_OBJ__ = ${obj}`),
					cacheObj = this.out('__I_OBJ__', {sys: true});

				if (args.length >= 6) {
					objLength += ws`
						${this.declVars('__LENGTH__ = 0')}

						for (${this.declVars('key', false)} in ${cacheObj}) {
							${this.out('__LENGTH__++;', {sys: true})}
						}
					`;
				}

				let resStr = ws`
					${tmpObj}

					if (${cacheObj}) {

						${objLength}
						${this.declVars('__I__ = -1')}

						for (${this.declVars('__KEY__', false)} in ${cacheObj}) {
							${this.out('__I__++;', {sys: true})}
				`;

				resStr += (() => {
					var str = '';

					for (let i = -1; ++i < args.length;) {
						let tmp = args[i];

						switch (i) {
							case 0:
								tmp += ' = __I_OBJ__[__KEY__]';
								break;

							case 1:
								tmp += ' = __KEY__';
								break;

							case 2:
								tmp += ' = __I_OBJ__';
								break;

							case 3:
								tmp += ' = __I__';
								break;

							case 4:
								tmp += ' = __I__ === 0';
								break;

							case 5:
								tmp += ' = __I__ === __LENGTH__ - 1';
								break;

							case 6:
								tmp += ' = __LENGTH__';
								break;
						}

						str += this.declVars(tmp);
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
}
