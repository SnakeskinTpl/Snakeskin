Snakeskin.addDirective(
	'script',

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
				command = command.replace(tagRgxp, 'js $1');

			} else {
				command = 'js';
			}

			var parts = command.split(' '),
				type = parts[0],
				dom = this.renderMode === 'dom';

			var types = {
				'js': 'text/javascript',
				'dart': 'application/dart',
				'coffee': 'application/coffeescript',
				'ts': 'application/typescript',
				'json': 'application/json',
				'html': 'text/html'
			};

			var str,
				desc = types[type] || this.replaceTplVars(type);

			if (dom) {
				str = (("\
\n					__NODE__ = document.createElement('script');\
\n					__NODE__.type = '" + desc) + "';\
\n				");

			} else {
				str = this.wrap((("'<script type=\"" + desc) + "\"'"));
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
		this.space = true;
		if (this.structure.params.autoReplace) {
			this.autoReplace = true;
		}

		var str;

		if (this.renderMode === 'dom') {
			str = '__RESULT__.pop();';

		} else {
			str = this.wrap('\'</style>\'');
		}

		this.append(str);
	}
);