/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * Delcares callback function arguments
 * and returns a string of declaration
 *
 * @param {(!Array|string)} parts - a string of arguments or an array
 * @return {string}
 */
DirObj.prototype.declCallbackArgs = function (parts) {
	var args = ((Array.isArray(parts) ? parts[2] || parts[1] : parts) || '').split(','),
		scope;

	for (let i = -1; ++i < args.length;) {
		let el = args[i].trim(),
			mod = scopeModRgxp.test(el);

		if (mod) {
			if (scope) {
				this.error(`invalid "${this.name}" declaration`);

			} else {
				el = el.replace(scopeModRgxp, '');
			}
		}

		if (el) {
			args[i] = this.declVar(el, true);

			if (mod) {
				scope = args[i];
			}
		}
	}

	if (scope) {
		this.scope.push(scope);
		this.structure.params._scope = true;
	}

	return args.join(',');
};

Snakeskin.addDirective(
	'callback',

	{
		block: true,
		group: 'callback',
		replacers: {
			'()': (cmd) => cmd.replace('()', 'callback ')
		}
	},

	function (command) {
		var parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startDir();
		if (this.isReady()) {
			let async = this.getGroup('async'),
				parent = this.structure.parent;

			this.structure.params.insideAsync = async[parent.name];
			let children = parent.children,
				length = 0;

			for (let i = -1; ++i < children.length;) {
				if (children[i].name === 'callback') {
					length++;
				}

				if (length > 1) {
					break;
				}
			}

			this.append(/* cbws */`
				${async[parent.name] && length > 1 ? ', ' : ''}(function (${this.declCallbackArgs(parts)}) {
					${this.declArguments()}
			`);
		}
	},

	function () {
		this.append('})' + (this.structure.params.insideAsync ? '' : ';'));
	}
);

Snakeskin.addDirective(
	'final',

	{
		block: true,
		group: [
			'callback',
			'basicAsync'
		],

		chain: [
			'parallel',
			'series',
			'waterfall'
		]
	},

	function (command) {
		var async = this.getGroup('series');

		if (!async[this.structure.name]) {
			return this.error(`directive "${this.name}" can be used only with a "${groupsList['series'].join(', ')}"`);
		}

		var parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startDir();
		if (this.isReady()) {
			this.append(/* cbws */`
				], function (${this.declCallbackArgs(parts)}) {
					${this.declArguments()}
			`);
		}
	},

	function () {
		this.append('});');
		this.endDir();
	}
);
