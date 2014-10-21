var $freeze$0 = Object.freeze;var $defProps$0 = Object.defineProperties;var $TS$0 = ["\n					yield ", ";\n					__RESULT__ = ", ";\n				"];$TS$0 = $freeze$0($defProps$0($TS$0, {"raw": {"value": $TS$0}}));Snakeskin.addDirective(
	'yield',

	{
		placement: 'template'
	},

	function (command) {
		var cb = this.has(this.getGroup('callback'));

		if (cb) {
			return this.error((("directive \"" + (this.name)) + ("\" can't be used within the \"" + cb) + "\""));
		}

		if (!this.parentTplName && !this.generator && !this.proto && !this.outerLink) {
			return this.error((("directive \"" + (this.name)) + "\" can be used only with a generator"));
		}

		this.startInlineDir();

		if (this.isReady()) {
			if (command) {
				this.append((("yield " + (this.prepareOutput(command, true))) + ";"));

			} else {
				this.append(cbws($TS$0
, this.returnResult()
, this.declResult()
));
			}
		}
	}
);
