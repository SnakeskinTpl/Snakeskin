(() => {
	var types = {
		'css': {
			'type': 'text/css',
			'rel': 'stylesheet'
		},

		'acss': {
			'type': 'text/css',
			'rel': 'alternate stylesheet'
		}
	};

	var typesStr = {
		dom: {

		},

		string: {

		}
	};

	forIn(types, (el, key) => {
		forIn(el, (el, attr) => {
			typesStr.dom[key] = typesStr.dom[key] || '';
			typesStr.dom[key] += `__NODE__.${attr} = '${el}';`;
			typesStr.string[key] = typesStr.string[key] || '';
			typesStr.string[key] += ` ${attr}="${el}"`;
		});
	});

	Snakeskin.addDirective(
		'link',

		{
			placement: 'template',
			block: true,
			selfInclude: false
		},

		function (command) {
			this.startDir();
			this.skipSpace = true;

			if (this.autoReplace) {
				this.autoReplace = false;
				this.structure.params.autoReplace = true;
			}

			if (this.isReady()) {
				if (command) {
					command = command.replace(emptyCommandParamsRgxp, 'css $1');

				} else {
					command = 'css';
				}

				let parts = splitBySpace(command),
					type = parts[0],
					dom = !this.domComment && this.renderMode === 'dom';

				let str;
				if (dom) {
					str = /* cbws */`
						__NODE__ = document.createElement('link');
						${typesStr.dom[type.toLowerCase()] || ''}
						${this.wrap('__NODE__')}
						__RESULT__.push(__NODE__);
					`;

				} else {
					str = this.wrap(`'<link ${(typesStr.string[type] || this.replaceTplVars(type)).trim()}'`);
				}

				this.append(str);

				if (parts.length > 1) {
					let args = [].slice.call(arguments);

					args[0] = parts.slice(1).join(' ');
					args[1] = args[0].length;

					Snakeskin.Directions['attr'].apply(this, args);
					this.inline = false;
				}

				if (dom) {
					str = '__NODE__.href =';

				} else {
					str = this.wrap('\' href="\'');
				}

				this.append(str);
			}
		},

		function () {
			if (!this.tolerateWhitespace) {
				this.skipSpace = true;
			}

			if (this.structure.params.autoReplace) {
				this.autoReplace = true;
			}

			let str;

			if (!this.domComment && this.renderMode === 'dom') {
				str = /* cbws */`
					__RESULT__.pop();
					__NODE__ = null;
				`;

			} else {
				str = this.wrap(`'"${this.doctype === 'xml' ? '/' : ''}>'`);
			}

			this.append(str);
		}
	);
})();
