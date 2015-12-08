'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const
	path = require('path'),
	fs = require('fs'),
	crypto = require('crypto'),
	glob = require('glob');

const
	$C = require('collection.js').$C;

const
	esprima = require('esprima'),
	escodegen = require('escodegen'),
	escope = require('escope');

const
	val = exports.val = (src) => `module_${uid(src)}`;

function uid(src) {
	const hash = crypto.createHash('md5');
	hash.update(normalize(src));
	return hash.digest('hex');
}

function normalize(src) {
	return path.normalize(src).split(path.sep).join('/');
}

exports.modules = () => {
	const modules = {};
	return (text, file) => {
		const
			moduleId = modules[file] || (modules[file] = val(file)),
			includes = [];

		text =
			'var ' + moduleId + ' = {};\n' +
			'var module = {exports: ' + moduleId + '};\n' +
			'var exports = ' + moduleId + ';\n' +
			text.replace(/(['"])use strict\1;?\s*/, '');

		text = text.replace(/(?:^|[^.])\brequire\((['"])(.*?)\1\)(;?)/g, function (sstr, q, src, end) {
			const base = path.dirname(file);
			src = normalize(path.resolve(base, src));

			let
				i = 1,
				ext = false;

			if (!path.extname(src)) {
				i++;
				ext = true;
			}

			while (i--) {
				let tmpSrc = src;

				if (ext) {
					switch (i) {
						case 1:
							tmpSrc += '.js';
							break;

						case 0:
							tmpSrc = normalize(path.join(tmpSrc, 'index.js'));
							break;
					}
				}

				try {
					const
						globPattern = glob.hasMagic(tmpSrc);

					if (globPattern || fs.statSync(tmpSrc).isFile()) {
						includes.push('//#include ' + path.relative(base, tmpSrc));

						const
							moduleIds = [];

						if (globPattern) {
							$C(glob.sync(tmpSrc)).forEach(function (file) {
								file = normalize(file);
								moduleIds.push(modules[file] || (modules[file] = val(file)));
							});

						} else {
							moduleIds.push(modules[tmpSrc] || (modules[tmpSrc] = val(tmpSrc)));
						}

						return moduleIds.join(end) + end;
					}

				} catch (ignore) {}
			}

			return sstr;
		});

		let ast = esprima.parse(text, {
			comment: true,
			range: true,
			loc: false,
			tokens: true,
			raw: false
		});

		ast = escodegen.attachComments(ast, ast.comments, ast.tokens);
		const
			vars = escope.analyze(ast, {optimistic: true}).scopes[0].variables;

		$C(vars).forEach(function (el) {
			if (!/module_/.test(el.name)) {
				const
					newName = `${moduleId}_${el.name}`;

				el.references.forEach((ref) => {
					ref.identifier.name = newName;
				});

				el.identifiers.forEach((ident) => {
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
