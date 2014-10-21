var $freeze$0 = Object.freeze;var $defProps$0 = Object.defineProperties;var $TS$0 = ["\n					__NODE__ = document.createElement('", "');\n					__NODE__.className = 'i-block';\n					__NODE__.setAttribute('data-params', '", "');\n					", "\n				"];$TS$0 = $freeze$0($defProps$0($TS$0, {"raw": {"value": $TS$0}}));var $TS$1 = ["\n					'<", "\n						class=\"i-block\"\n						data-params=\"", "\"\n					>'\n				"];$TS$1 = $freeze$0($defProps$0($TS$1, {"raw": {"value": $TS$1}}));Snakeskin.addDirective(
	'setBEM',

	{
		placement: 'global',
		notEmpty: true
	},

	function (command) {
		this.startInlineDir();
		var parts = command.match(/([^,]+),\s+(.*)/);

		try {
			bem[parts[1]] = this.evalStr((("{" + (this.prepareOutput(parts[2], true, null, null, false))) + "}"));

		} catch (ignore) {
			return this.error((("invalid \"" + (this.name)) + "\" declaration"));
		}
	}
);

Snakeskin.addDirective(
	'bem',

	{
		block: true,
		placement: 'template',
		notEmpty: true,
		text: true
	},

	function (command) {
		this.startDir(null, {
			tag: /^\(/.test(command) ?
				/\((.*?)\)/.exec(command)[1] : null
		});

		var params = this.structure.params;

		command = params.tag ?
			command.replace(/^[^)]+\)(.*)/, '$1') : command;

		var parts = command.trim().split(','),
			bemName = parts[0];

		parts[0] += '\'';
		command = parts.join(',');

		params.original = bem[bemName] &&
			bem[bemName].tag;

		if (this.isReady()) {
			var str,
				tag = params.tag || params.original || 'div',
				desc = (("{name: \\'" + (this.replaceTplVars(command.replace(/\s+/g, ' ')))) + "}");

			if (this.renderMode === 'dom') {
				str = cbws($TS$0
, tag

, desc
, this.returnPushNodeDecl()
);

			} else {
				str = this.wrap(cbws($TS$1
, tag

, desc

));
			}

			this.append(str);
		}
	},

	function () {
		var params = this.structure.params,
			str;

		if (this.renderMode == 'dom') {
			str = '__RESULT__.pop();';

		} else {
			str = this.wrap((("'</" + (params.tag || params.original || 'div')) + ">'"));
		}

		this.append(str);
	}
);
