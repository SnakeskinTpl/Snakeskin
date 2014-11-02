var importMap = {
	'root': true,
	'head': true
};

Snakeskin.addDirective(
	'import',

	{
		notEmpty: true
	},

	function (command) {
		if (!importMap[this.structure.name]) {
			return this.error(`directive "${this.name}" can be used only within the global space or a "head"`);
		}

		var parts = command.split('='),
			obj = parts[0].trim();

		if (parts.length < 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startInlineDir();
		if (this.module.id === 0) {
			let key = `${obj}_00_${uid}`;

			this.save(/* cbws */`
				var ${key} = __LOCAL__.${key} = ${this.prepareOutput(parts.slice(1).join('='), true)};
			`);

			let root = this.structure;

			while (root.name !== 'root') {
				root = root.parent;
			}

			root.vars[`${obj}_00`] = {
				value: `__LOCAL__.${key}`,
				scope: 0
			};
		}
	}
);
