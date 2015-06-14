/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

{
	let types = {
		'css': 'text/css'
	};

	Snakeskin.addDirective(
		'style',

		{
			placement: 'template',
			block: true,
			selfInclude: false
		},

		function (command) {
			this.startDir();

			if (!this.tolerateWhitespace) {
				this.skipSpace = true;
			}

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

				let str,
					desc = types[type.toLowerCase()] || this.replaceTplVars(type);

				if (dom) {
					str = ws`
						__NODE__ = document.createElement('style');
						__NODE__.type = '${desc}';
					`;

				} else {
					str = this.wrap(`'<style type="${desc}"'`);
				}

				this.append(str);

				if (parts.length > 1) {
					/** @type {!Array} */
					let args = _.any([].slice.call(arguments));

					args[0] = parts.slice(1).join(' ');
					args[1] = args[0].length;

					Snakeskin.Directions['attr'].apply(this, args);
					this.inline = false;
				}

				if (dom) {
					str = this.returnPushNodeDecl();

				} else {
					str = this.wrap('\'>\'');
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
				str = '__RESULT__.pop();';

			} else {
				str = this.wrap('\'</style>\'');
			}

			this.append(str);
		}
	);
}
