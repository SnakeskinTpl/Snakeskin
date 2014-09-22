Snakeskin.addDirective(
	'include',

	{
		notEmpty: true
	},

	function (command) {
		if (this.tplName || this.hasParent('head')) {
			return this.error(`directive "${this.name}" can't be used within a ${groupsList['template'].join(', ')} or a "head"`);
		}

		this.startInlineDir(null, {
			from: this.res.length
		});

		var parts = command.split('->');

		if (!parts[0]) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		var path = this.prepareOutput(parts[0], true),
			type = parts[1] ?
				this.prepareOutput(parts[1], true) : '';

		if (path !== void 0 && type !== void 0) {
			this.save(`
				Snakeskin.include(
					'${applyDefEscape(this.info['file'] || '')}',
					${this.pasteDangerBlocks(path)},
					${this.pasteDangerBlocks(type)}
				);
			`);
		}
	},

	function () {
		if (this.hasParent('eval')) {
			return;
		}

		this.res = this.res.substring(0, this.structure.params.from);
	}
);