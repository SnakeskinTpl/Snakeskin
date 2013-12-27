var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'if',

	null,

	function (command, commandLength, dir, params) {
		
		if (!dir.structure.parent) {
			throw dir.error('Directive "' + params.name + '" can only be used within a "template" or "proto", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		dir.startDir(params.name);
		if (dir.isSimpleOutput(params.info)) {
			dir.save('if (' + dir.prepareOutput(command, true) + ') {');
		}
	}
);

Snakeskin.addDirective(
	'elseIf',

	null,

	function (command, commandLength, dir, params) {
		
		if (!dir.structure.parent) {
			throw dir.error('Directive "' + params.name + '" can only be used within a "template" or "proto", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		if (dir.structure.name !== 'if') {
			throw dir.error('Directive "' + params.name + '" can only be used with a "if", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		if (dir.isSimpleOutput(params.info)) {
			dir.save('} else if (' + dir.prepareOutput(command, true) + ') {');
		}
	}
);

Snakeskin.addDirective(
	'else',

	null,

	function (command, commandLength, dir, params) {
		
		if (!dir.structure.parent) {
			throw dir.error('Directive "' + params.name + '" can only be used within a "template" or "proto", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		if (dir.structure.name !== 'if') {
			throw dir.error('Directive "' + params.name + '" can only be used with a "if", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		if (dir.isSimpleOutput(params.info)) {
			dir.save('} else {');
		}
	}
);

Snakeskin.addDirective(
	'switch',

	{
		strongDirs: {
			'case': true,
			'default': true
		}
	},

	function (command, commandLength, dir, params) {
		
		if (!dir.structure.parent) {
			throw dir.error('Directive "' + params.name + '" can only be used within a "template" or "proto", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		dir.startDir(params.name);
		if (dir.isSimpleOutput(params.info)) {
			dir.save('switch (' + dir.prepareOutput(command, true) + ') {');
		}
	}
);

Snakeskin.addDirective(
	'case',

	{
		replacers: {
			'>': function (cmd) {
				return cmd.replace(/^>/, 'case ');},
			'/>': function (cmd) {
				return cmd.replace(/^\/>/, 'end case');}
		}
	},

	function (command, commandLength, dir, params) {
		
		if (!dir.structure.parent) {
			throw dir.error('Directive "' + params.name + '" can only be used within a "template" or "proto", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		if (!dir.has('switch')) {
			throw dir.error('Directive "' + params.name + '" can only be used within a "switch", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		dir.startDir(params.name);
		if (dir.isSimpleOutput(params.info)) {
			dir.save('case ' + dir.prepareOutput(command, true) + ': {');
		}
	},

	function (command, commandLength, dir) {
		
		if (dir.isSimpleOutput()) {
			dir.save('} break;');
		}
	}
);

Snakeskin.addDirective(
	'default',

	null,

	function (command, commandLength, dir, params) {
		
		if (!dir.structure.parent) {
			throw dir.error('Directive "' + params.name + '" can only be used within a "template" or "proto", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		if (!dir.has('switch')) {
			throw dir.error('Directive "' + params.name + '" can only be used within a "switch", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		dir.startDir(params.name);
		if (dir.isSimpleOutput(params.info)) {
			dir.save('default: {');
		}
	}
);