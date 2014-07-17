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
		command = command.replace(/=>>/g, '=>=>');
		var parts = command.split('=>'),
			obj = parts[0];

		if (!parts.length || parts.length > (this.inlineIterators ? 2 : 3)) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startDir(parts.length === 3 ? '$forEach' : null, {
			params: parts[2] ? parts[1] : null
		});

		if (this.isSimpleOutput()) {
			if (!this.inlineIterators) {
				if (parts.length === 3) {
					this.save(`\$C(${this.prepareOutput(`(${parts[0]})`, true)}).forEach(function (${this.declCallbackArgs(parts)}) {`);

				} else {
					this.save(`
						Snakeskin.forEach(
							${this.prepareOutput(`(${parts[0]})`, true)},
							function (${this.declCallbackArgs(parts[1])}) {
					`);
				}

				return;
			}

			let tmpObj = this.multiDeclVar(`__TMP__ = ${obj}`),
				cacheObj = this.prepareOutput('__TMP__', true);

			let objLength = this.multiDeclVar('__KEYS__ = Object.keys ? Object.keys(__TMP__) : null'),
				keys = this.prepareOutput('__KEYS__', true);

			let args = parts[1] ?
				parts[1].trim().split(',') : [];

			if (args.length >= 6) {
				objLength += `
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

			let resStr = `
				${tmpObj}

				if (${cacheObj}) {
					if (Array.isArray(${cacheObj})) {
						${this.multiDeclVar('__LENGTH__ =  __TMP__.length')}
						for (${this.multiDeclVar('__I__ = -1') + this.prepareOutput('++__I__ < __LENGTH__;', true)}) {
			`;

			resStr += (() => {
				var str = '';

				for (let i = 0; i < args.length; i++) {
					let tmp = args[i];

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

					str += this.multiDeclVar(tmp);
				}

				return str;
			})();

			let end = `
				} else {
					${objLength}

					if (${keys}) {
						${this.multiDeclVar(`__LENGTH__ = __KEYS__.length`)}
						for (${this.multiDeclVar('__I__ = -1') + this.prepareOutput('++__I__ < __LENGTH__;', true)}) {
			`;

			end += (() => {
				var str = '';

				for (let i = 0; i < args.length; i++) {
					let tmp = args[i];

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

					str += this.multiDeclVar(tmp);
				}

				return str;
			})();

			let oldEnd = `
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

				for (let i = 0; i < args.length; i++) {
					let tmp = args[i];

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

					str += this.multiDeclVar(tmp);
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
			if (this.inlineIterators) {
				let params = this.structure
					.params;

				let part = this.res
					.substring(params.from);

				this.save(`} ${params.end + part} } ${params.oldEnd + part} }}}}`);

			} else {
				let params = this.structure.params.params;

				if (params) {
					this.save(`}, ${this.prepareOutput(`(${params})`, true)});`);

				} else {
					this.save('});');
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

		if (this.isSimpleOutput()) {
			this.save(`\$C(${this.prepareOutput(`(${parts[0]})`, true)}).forEach(function (${this.declCallbackArgs(parts)}) {`);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			let params = this.structure.params.params;

			if (params) {
				this.save(`}, ${this.prepareOutput(`(${params})`, true)});`);

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
		if (this.isSimpleOutput()) {
			if (!this.inlineIterators) {
				this.save(`
					Snakeskin.forIn(
						${this.prepareOutput(`(${parts[0]})`, true)},
						function (${this.declCallbackArgs(parts[1])}) {
				`);

				return;
			}

			let objLength = '';
			let args = parts[1] ?
				parts[1].trim().split(',') : [];

			let tmpObj = this.multiDeclVar(`__TMP__ = ${obj}`),
				cacheObj = this.prepareOutput('__TMP__', true);

			if (args.length >= 6) {
				objLength += `
					${this.multiDeclVar('__LENGTH__ = 0')}

					for (${this.multiDeclVar('key', false)} in ${cacheObj}) {
						${this.prepareOutput('__LENGTH__++;', true)}
					}
				`;
			}

			let resStr = `
				${tmpObj}

				if (${cacheObj}) {

					${objLength}
					${this.multiDeclVar('__I__ = -1')}

					for (${this.multiDeclVar('__KEY__', false)} in ${cacheObj}) {
						${this.prepareOutput('__I__++;', true)}
			`;

			resStr += (() => {
				var str = '';

				for (let i = 0; i < args.length; i++) {
					let tmp = args[i];

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

					str += this.multiDeclVar(tmp);
				}

				return str;
			})();

			this.save(resStr);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			if (this.inlineIterators) {
				this.save('}}');

			} else {
				this.save('});');
			}
		}
	}
);