var $freeze$0 = Object.freeze;var $defProps$0 = Object.defineProperties;var $TS$0 = ["\n						__NODE__ = document.createElement('style');\n						__NODE__.type = '", "';\n					"];$TS$0 = $freeze$0($defProps$0($TS$0, {"raw": {"value": $TS$0}}));(function()  {
	var types = {
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

				var parts = command.split(' '),
					type = parts[0],
					dom = !this.domComment && this.renderMode === 'dom';

				var str,
					desc = types[type.toLowerCase()] || this.replaceTplVars(type);

				if (dom) {
					str = cbws($TS$0

, desc
);

				} else {
					str = this.wrap((("'<style type=\"" + desc) + "\"'"));
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

			var str;

			if (!this.domComment && this.renderMode === 'dom') {
				str = '__RESULT__.pop();';

			} else {
				str = this.wrap('\'</style>\'');
			}

			this.append(str);
		}
	);
})();
