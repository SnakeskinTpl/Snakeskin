Snakeskin.addDirective(
	'forEach',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			let parts = command.split('=>'),
				obj = parts[0];

			if (!parts.length || parts.length > 2) {
				throw this.error(`Invalid "${this.name}" declaration (${command})`);
			}

			let args = parts[1] ?
				parts[1].trim().split(',') : [];

			let tmpObj = this.multiDeclVar(`__TMP__ = ${obj}`),
				cacheObj = this.prepareOutput('__TMP__', true);

			let objLength = this.multiDeclVar('__TMP_KEYS__ = Object.keys ? Object.keys(__TMP__) : null'),
				keys = this.prepareOutput('__TMP_KEYS__', true);

			if (args.length >= 6) {
				objLength += `
					${this.multiDeclVar(`__TMP_LENGTH__ = __TMP_KEYS__ ? __TMP_KEYS__.length : 0`)}
					if (!${keys}) {
						${this.multiDeclVar('__TMP_LENGTH__ = 0')}
						for (${this.multiDeclVar('__KEY__', false)} in ${cacheObj}) {
							if (!${cacheObj}.hasOwnProperty(${this.prepareOutput('__KEY__', true)})) {
								continue;
							}

							${this.prepareOutput('__TMP_LENGTH__++;', true)}
						}
					}
				`;
			}

			let resStr = `
				${tmpObj}
				if (${cacheObj}) {
					if (Array.isArray(${cacheObj})) {
						${this.multiDeclVar('__TMP_LENGTH__ =  __TMP__.length')}
						for (${this.multiDeclVar('__I__ = -1') + this.prepareOutput('++__I__ < __TMP_LENGTH__;', true)}) {
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
							tmp += ' = __I__ === __TMP_LENGTH__ - 1';
						} break;

						case 5: {
							tmp += ' = __TMP_LENGTH__';
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
						${this.multiDeclVar(`__TMP_LENGTH__ = __TMP_KEYS__.length`)}
						for (${this.multiDeclVar('__I__ = -1') + this.prepareOutput('++__I__ < __TMP_LENGTH__;', true)}) {
			`;

			end += (() => {
				var str = '';

				for (let i = 0; i < args.length; i++) {
					let tmp = args[i];

					switch (i) {
						case 0: {
							tmp += ' = __TMP__[__TMP_KEYS__[__I__]]';
						} break;

						case 1: {
							tmp += ' = __TMP_KEYS__[__I__]';
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
							tmp += ' = __I__ === __TMP_LENGTH__ - 1';
						} break;

						case 6: {
							tmp += ' = __TMP_LENGTH__';
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
							tmp += ' = __I__ === __TMP_LENGTH__ - 1';
						} break;

						case 6: {
							tmp += ' = __TMP_LENGTH__';
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
			let params = this.structure.params;
			let part = this.res.substring(params.from);
			this.save(`} ${params.end + part} } ${params.oldEnd + part} }}}}`);
		}
	}
);

Snakeskin.addDirective(
	'$forEach',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var parts = command.split('=>');

		if (!parts.length || parts.length > 3) {
			throw this.error(`Invalid "${this.name}" declaration (${command})`);
		}

		this.startDir(null, {
			params: parts[2] ? parts[1] : null
		});

		if (this.isSimpleOutput()) {
			let vars = (parts[2] || parts[1] || '').split(',');

			for (let i = 0; i < vars.length; i++) {
				let el = vars[i].trim();

				if (el) {
					vars[i] = this.declVar(el);
				}
			}

			this.save(`\$C(${this.prepareOutput(parts[0], true)}).forEach(function (${vars.join(',')}) {`);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			let params = this.structure.params.params;

			if (params) {
				this.save(`}, ${this.prepareOutput(params, true)});`);

			} else {
				this.save('});');
			}
		}
	}
);

Snakeskin.addDirective(
	'forIn',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			let parts = command.split('=>'),
				obj = parts[0];

			if (!parts.length || parts.length > 2) {
				throw this.error(`Invalid "${this.name}" declaration (${command})`);
			}

			let args = parts[1] ?
				parts[1].trim().split(',') : [];

			let tmpObj = this.multiDeclVar(`__TMP__ = ${obj}`),
				cacheObj = this.prepareOutput('__TMP__', true);

			let objLength = '';
			if (args.length >= 6) {
				objLength += `
					${this.multiDeclVar('__TMP_LENGTH__ = 0')}
					for (${this.multiDeclVar('key', false)} in ${cacheObj}) {
						${this.prepareOutput('__TMP_LENGTH__++;', true)}
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
							tmp += ' = __I__ === __TMP_LENGTH__ - 1';
						} break;

						case 6: {
							tmp += ' = __TMP_LENGTH__';
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
			this.save('}}');
		}
	}
);