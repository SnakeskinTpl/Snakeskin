Snakeskin.addDirective(
	'link',

	{
		placement: 'template',
		block: true,
		selfInclude: false
	},

	function (command) {
		this.startDir();
		this.space = true;

		if (this.autoReplace) {
			this.autoReplace = false;
			this.structure.params.autoReplace = true;
		}

		if (this.isReady()) {
			if (command) {
				command = command.replace(tagRgxp, 'css $1');

			} else {
				command = 'css';
			}

			var parts = command.split(' '),
				type = parts[0],
				dom = this.renderMode === 'dom';

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

			var typesStr = {};
			for (var key in types) {
				if (!types.hasOwnProperty(key)) {
					continue;
				}

				var el = types[key];
				for (var attr = void 0 in el) {
					if (!el.hasOwnProperty(attr)) {
						continue;
					}

					typesStr[key] = typesStr[key] || '';

					if (dom) {
						typesStr[key] += (("__NODE__." + attr) + (" = '" + (el[attr])) + "';");

					} else {
						typesStr[key] += ((" " + attr) + ("=\"" + (el[attr])) + "\"");
					}
				}
			}

			var str;

			if (dom) {
				str = (("\
\n					__NODE__ = document.createElement('link');\
\n					" + (typesStr[type] || '')) + ("\
\n					" + (this.wrap('__NODE__'))) + "\
\n					__RESULT__.push(__NODE__);\
\n				");

			} else {
				str = this.wrap((("'<link " + ((typesStr[type] || this.replaceTplVars(type)).trim())) + "'"));
			}

			this.append(str);

			if (parts.length > 1) {
				var args = [].slice.call(arguments);

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
		this.space = true;
		if (this.structure.params.autoReplace) {
			this.autoReplace = true;
		}

		var str;

		if (this.renderMode === 'dom') {
			str = ("\
\n				__RESULT__.pop();\
\n				__NODE__ = null;\
\n			");

		} else {
			str = this.wrap('\'"/>\'');
		}

		this.append(str);
	}
);