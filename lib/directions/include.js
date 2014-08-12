Snakeskin.addDirective(
	'include',

	{
		notEmpty: true
	},

	function (command) {
		if (this.tplName || this.hasParent('head')) {
			return this.error((("directive \"" + (this.name)) + ("\" can't be used within a " + (groupsList['template'].join(', '))) + " or a \"head\""));
		}

		this.startInlineDir(null, {
			from: this.res.length
		});

		var path = this.prepareOutput(command, true);

		if (path !== void 0) {
			path = this.pasteDangerBlocks(String(path));
			this.save((("Snakeskin.include('" + (applyDefEscape(this.info['file'] || ''))) + ("', " + path) + ");"));
		}
	},

	function () {
		if (this.hasParent('eval')) {
			return;
		}

		this.res = this.res.substring(0, this.structure.params.from);
	}
);