/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

var
	path = require('path'),
	fs = require('fs');

var
	$C = require('collection.js').$C,
	uid = require('uid');

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
		text = escaper.paste(
			escaper
				.replace(text, true)
				.replace(/(?:^|[^.])\bexports\b/g, moduleId)
		);

		text = text.replace(/(?:^|[^.])\brequire\((['"])(.*?)\1\)(;?)/g, function (sstr, q, src, end) {
			var base = path.dirname(file);
			src = path
				.normalize(path.resolve(base, src))
				.split(path.sep)
				.join('/');

			var
				i = 1,
				ext = false;

			if (!path.extname(src)) {
				i++;
				ext = true;
			}

			while (i--) {
				var tmpSrc = src;

				if (ext) {
					switch (i) {
						case 1:
							tmpSrc += '.js';
							break;

						case 0:
							tmpSrc = path
								.join(tmpSrc, 'index.js')
								.split(path.sep)
								.join('/');

							break;
					}
				}

				try {
					if (fs.statSync(tmpSrc).isFile()) {
						includes.push('//#include ' + path.relative(base, tmpSrc));
						var moduleId = modules[tmpSrc] ||
							(modules[tmpSrc] = 'module_' + uid());

						return moduleId + end;
					}

				} catch (ignore) {}
			}

			return sstr;
		});

		var ast = esprima.parse(text, {
			comment: true,
			range: true,
			loc: false,
			tokens: true,
			raw: false
		});

		ast = escodegen.attachComments(ast, ast.comments, ast.tokens);
		var
			vars = escope.analyze(ast, {optimistic: true}).scopes[0].variables;

		$C(vars).forEach(function (el) {
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

		return includes.join('\n') +
			'\n' +
			escodegen.generate(ast, {
				comment: true,
				format: {
					indent: {
						adjustMultilineComment: true
					}
				}
			});
	};
};
