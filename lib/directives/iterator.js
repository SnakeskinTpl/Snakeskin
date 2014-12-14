(() => {
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
						this.append(/* cbws */`
							${this.prepareOutput(`$C(${parts[0]})`, true)}.forEach(function (${this.declCallbackArgs(parts)}) {
								${this.declArguments()}
						`);

					} else {
						this.append(/* cbws */`
							Snakeskin.forEach(
								${this.prepareOutput(parts[0], true)},
								function (${this.declCallbackArgs(parts[1])}) {
									${this.declArguments()}
						`);
					}

					return;
				}

				let tmpObj = this.multiDeclVar(`__I_OBJ__ = ${obj}`),
					cacheObj = this.prepareOutput('__I_OBJ__', true);

				let objLength = this.multiDeclVar('__KEYS__ = Object.keys ? Object.keys(__I_OBJ__) : null'),
					keys = this.prepareOutput('__KEYS__', true);

				let args = parts[1] ?
					parts[1].trim().split(',') : [];

				if (args.length >= 6) {
					objLength += /* cbws */`
						${this.multiDeclVar(`__LENGTH__ = __KEYS__ ? __KEYS__.length : 0`)}

						if (!${keys}) {
							${this.multiDeclVar('__LENGTH__ = 0')}

							for (${this.multiDeclVar('__KEY__', false)} in ${cacheObj}) {
								if (!${cacheObj}.hasOwnProperty(${this.prepareOutput('__KEY__', true)})) {
									continue;
								}

								${this.prepareOutput('__LENGTH__++;', true)}
							}
						}
					`;
				}

				let resStr = /* cbws */`
					${tmpObj}

					if (${cacheObj}) {
						if (Array.isArray(${cacheObj})) {
							${this.multiDeclVar('__LENGTH__ =  __I_OBJ__.length')}
							for (${this.multiDeclVar('__I__ = -1') + this.prepareOutput('++__I__ < __LENGTH__;', true)}) {
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

						str += this.multiDeclVar(tmp);
					}

					return str;
				})();

				let end = /* cbws */`
					} else {
						${objLength}

						if (${keys}) {
							${this.multiDeclVar(`__LENGTH__ = __KEYS__.length`)}
							for (${this.multiDeclVar('__I__ = -1') + this.prepareOutput('++__I__ < __LENGTH__;', true)}) {
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

						str += this.multiDeclVar(tmp);
					}

					return str;
				})();

				let oldEnd = /* cbws */`
					} else {
						${this.multiDeclVar('__I__ = -1')}

						for (${this.multiDeclVar('__KEY__', false)} in ${cacheObj}) {
							if (!${cacheObj}.hasOwnProperty(${this.prepareOutput('__KEY__', true)})) {
								continue;
							}

							${this.prepareOutput('__I__++;', true)}
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

						str += this.multiDeclVar(tmp);
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
						this.append(`}, ${this.prepareOutput(params.params, true)});`);

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
				return this.error(`invalid "${this.name}" declaration`);
			}

			this.startDir(null, {
				params: parts[2] ? parts[1] : null
			});

			if (this.isReady()) {
				this.append(/* cbws */`
					${this.prepareOutput(`$C(${parts[0]})`, true)}.forEach(function (${this.declCallbackArgs(parts)}) {
						${this.declArguments()}
				`);
			}
		},

		function () {
			if (this.isReady()) {
				let params = this.structure.params.params;

				if (params) {
					this.append(`}, ${this.prepareOutput(params, true)});`);

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

		function (command) {
			var parts = command.split('=>'),
				obj = parts[0];

			if (!parts.length || parts.length > 2) {
				return this.error(`invalid "${this.name}" declaration`);
			}

			this.startDir();
			if (this.isReady()) {
				if (!this.inlineIterators) {
					this.append(/* cbws */`
						Snakeskin.forIn(
							${this.prepareOutput(parts[0], true)},
							function (${this.declCallbackArgs(parts[1])}) {
								${this.declArguments()}
					`);

					return;
				}

				let objLength = '';
				let args = parts[1] ?
					parts[1].trim().split(',') : [];

				let tmpObj = this.multiDeclVar(`__I_OBJ__ = ${obj}`),
					cacheObj = this.prepareOutput('__I_OBJ__', true);

				if (args.length >= 6) {
					objLength += /* cbws */`
						${this.multiDeclVar('__LENGTH__ = 0')}

						for (${this.multiDeclVar('key', false)} in ${cacheObj}) {
							${this.prepareOutput('__LENGTH__++;', true)}
						}
					`;
				}

				let resStr = /* cbws */`
					${tmpObj}

					if (${cacheObj}) {

						${objLength}
						${this.multiDeclVar('__I__ = -1')}

						for (${this.multiDeclVar('__KEY__', false)} in ${cacheObj}) {
							${this.prepareOutput('__I__++;', true)}
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

						str += this.multiDeclVar(tmp);
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
