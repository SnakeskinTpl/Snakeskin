/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

var
	escaper = require('escaper'),
	esprima = require('esprima'),
	escodegen = require('escodegen'),
	escope = require('escope');

exports.modules = function () {
	var modules = {};
	return function (text, file) {
		var includes = [];
		var moduleId = modules[file] ||
			(modules[file] = 'module_' + uid());

		text = 'var ' + moduleId + ' = {};\n' + text.replace(/(['"])use strict\1;?\s*/, '');
		text = text.replace(/(?:^|[^.])\bexports\b/g, moduleId);
		text = text.replace(/(?:^|[^.])\brequire\((['"])(.*?\.js)\1\)(;?)/g, function (sstr, q, src, end) {
			includes.push('//#include ' + src);
			src = path
				.normalize(path.resolve(path.dirname(file), src))
				.split(path.sep).join('/');

			var moduleId = modules[src] ||
				(modules[src] = 'module_' + uid());

			return moduleId + end;
		});

		text = escaper.replace(text, {'@comments': true});

		var
			ast = esprima.parse(text),
			vars = escope.analyze(ast, {optimistic: true}).scopes[0].variables;

		vars.forEach(function (el) {
			if (!/module_/.test(el.name)) {
				var newName = moduleId + '_' + el.name;

				el.references.forEach(function (ref) {
					ref.identifier.name = newName;
				});

				el.identifiers.forEach(function (ident) {
					ident.name = newName;
				});
			}
		});

		return includes.join('\n') + '\n' + escaper.paste(escodegen.generate(ast)).replace(/\*\/;/, '*/');
	};
};
