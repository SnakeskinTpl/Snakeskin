#!/usr/bin/env node
global.Snakeskin = require('../snakeskin');

var program = require('commander'),
	beautify = require('js-beautify'),
	monocle = require('monocle')();

var path = require('path'),
	fs = require('fs');

program
	.version(Snakeskin.VERSION.join('.'))

	.usage('[options] [dir|file ...]')
	.option('-p, --params [src]', 'path to the options file or JS options object')

	.option('-s, --source [src]', 'path to the template file or directory')
	.option('-f, --file [src]', 'path to the template file (meta-information)')
	.option('-m, --mask [mask]', 'mask for a template files (RegExp)')
	.option('-w, --watch', 'watch files for changes and automatically re-render')

	.option('-o, --output [src]', 'path to the file to save')
	.option('--extname [ext]', 'file extension for saving (if "output" is a directory)')
	.option('--exports [type]', 'export type')

	.option('-e, --exec', 'execute compiled template')
	.option('-d, --data [src]', 'path to the data file or JS data object')
	.option('-t, --tpl [name]', 'name of the main template')

	.option('--disable-localization', 'disable support for localization')
	.option('--i18n-fn [name]', 'i18n function name')
	.option('--language [src]', 'path to the localization file or localization object')
	.option('--words [src]', 'path to the localization file to save')

	.option('--disable-use-strict', 'disable \'use strict\'; mode')
	.option('--bem-filter [name]', 'bem filter name')
	.option('--line-separator [char]', 'newline character (eol)')
	.option('--tolerate-whitespace', 'tolerate whitespace characters in the template')
	.option('--ignore', 'regular expression to ignore the empty space')
	.option('--auto-replace', 'enable macros support')
	.option('--macros [src]', 'path to the macros file or JS macros object')

	.option('--doctype [type]', 'xml doctype (html or xml)')
	.option('--inline-iterators', 'inline forEach and forIn')
	.option('--disable-escape-output', 'disable default "html" filter')
	.option('--disable-replace-undef', 'disable default "undef" filter')

	.option('--render-as [mode]', 'render all templates as "interface" or "placeholder"')
	.option('--render-mode [mode]', 'render all templates in "stringConcat", "stringBuffer" or "dom"')

	.option('--pretty-print', 'formatting output')
	.parse(process.argv);

var params = Snakeskin.toObj(program['params']) || {};

if (params instanceof Object === false) {
	params = {};
}

params.doctype = 'doctype' in program ?
	program['doctype'] : params.doctype;

params.exports = 'exports' in program ?
	program['exports'] : params.exports;

params.localization = 'disableLocalization' in program ?
	!program['disableLocalization'] : params.localization;

params.i18nFn = 'i18nFn' in program ?
	program['i18nFn'] : params.i18nFn;

params.language = 'language' in program ?
	program['language'] : params.language;

params.words = 'words' in program ?
	program['words'] : params.words;

params.renderAs = 'renderAs' in program ?
	program['renderAs'] : params.renderAs;

params.renderMode = 'renderMode' in program ?
	program['renderMode'] : params.renderMode;

params.inlineIterators = 'inlineIterators' in program ?
	program['inlineIterators'] : params.inlineIterators;

params.replaceUndef = 'disableReplaceUndef' in program ?
	!program['disableReplaceUndef'] : params.replaceUndef;

params.escapeOutput = 'disableEscapeOutput' in program ?
	!program['disableEscapeOutput'] : params.escapeOutput;

params.prettyPrint = 'prettyPrint' in program ?
	program['prettyPrint'] : params.prettyPrint;

params.useStrict = 'disableUseStrict' in program ?
	!program['disableUseStrict'] : params.useStrict;

params.bemFilter = 'bemFilter' in program ?
	program['bemFilter'] : params.bemFilter;

params.lineSeparator = 'lineSeparator' in program ?
	program['lineSeparator'] : params.lineSeparator;

params.tolerateWhitespace = 'tolerateWhitespace' in program ?
	program['tolerateWhitespace'] : params.tolerateWhitespace;

params.ignore = 'ignore' in program ?
	program['ignore'] : params.ignore;

params.autoReplace = 'autoReplace' in program ?
	program['autoReplace'] : params.autoReplace;

params.macros = 'macros' in program ?
	program['macros'] : params.macros;

for (var key in params) {
	if (!params.hasOwnProperty(key)) {
		continue;
	}

	var el = params[key];
	switch (el) {
		case 'true':
			el = true;
			break;

		case 'false':
			el = false;
			break;

		case 'null':
			el = null;
			break;

		default:
			if (typeof el === 'string') {
				var nm = Number(el);
				el = isNaN(nm) ?
					el : nm;
			}
	}

	params[key] = el;
}

params.debug = {};
params.cache = false;

var include = {},
	fMap = {},
	watch = program['watch'];

var prettyPrint = params.prettyPrint,
	language = params.language,
	macros = params.macros;

var exec = program['exec'],
	tplData = program['data'],
	mainTpl = program['tpl'];

var words = params.words;

if (words) {
	params.words = {};
}

var args = program['args'],
	input;

var file = program['source'],
	out = program['output'];

if (!file && args.length) {
	input = args.join(' ');

	if (fs.existsSync(input)) {
		file = input;
		input = false;
	}
}

var calls = {};

function testDir(src) {
	src = path.normalize(path.resolve(src));
	(path.extname(src) ? path.dirname(src) : src).split(path.sep).forEach(function (el, i, data) {
		var src = data.slice(0, i + 1).join(path.sep);

		if (!fs.existsSync(src)) {
			fs.mkdirSync(src);
		}
	});
}

function action(data, file) {
	console.time('Time');

	file = file || program['file'] || '';
	var tpls = {},
		fileName = '';

	if (file) {
		fileName = path.basename(file, path.extname(file));
	}

	if (tplData || mainTpl || exec) {
		params.context = tpls;
		params.prettyPrint = false;
	}

	function pathTpl(src) {
		return src
			.replace(/%fileDir%/g, path.dirname(file))
			.replace(/%fileName%/g, fileName)
			.replace(/%file%/g, path.basename(file))
			.replace(/%filePath%/g, file);
	}

	function load(val) {
		val = pathTpl(val);
		var tmp = val;

		val = path.normalize(
			path.resolve(val)
		);

		if (fs.existsSync(val) && fileName && fs.statSync(val).isDirectory()) {
			tmp = path.join(val, fileName) + '.js';

			if (!fs.existsSync(tmp)) {
				tmp += 'on';
			}
		}

		return Snakeskin.toObj(tmp, null, function (src) {
			if (file) {
				include[src] = include[src] || {};
				include[src][file] = true;
			}
		});
	}

	if (language) {
		params.language = load(language);
	}

	if (macros) {
		params.macros = load(macros);
	}

	function line() {
		console.log(new Array(80).join('~'));
	}

	function success() {
		line();
		console.log('File "' + file + '" has been successfully compiled "' + outFile + '".');
		console.timeEnd('Time');
		line();
	}

	var outFile = out,
		execTpl = tplData || mainTpl || exec;

	if (outFile) {
		outFile = path.normalize(path.resolve(pathTpl(outFile)));
		testDir(outFile);

		if (fs.existsSync(outFile) && fs.statSync(outFile).isDirectory()) {
			outFile = path.join(outFile, path.basename(file)) + (program['extname'] || (execTpl ? '.html' : '.js'));
		}

		if (file && (!words || fs.existsSync(words)) && params.cache !== false) {
			var includes = Snakeskin.check(file, outFile, Snakeskin.compile(null, params, null, {cacheKey: true}), true);

			if (includes) {
				success();

				include[file] = include[file] || {};
				include[file][file] = true;

				includes.forEach(function (key) {
					include[key] = include[key] || {};
					include[key][file] = true;
				});

				return;
			}
		}
	}

	var res = Snakeskin.compile(
		String(data),
		params,
		{file: file}
	);

	var toConsole = input && !program['output'] ||
		!outFile;

	if (res !== false) {
		if (execTpl) {
			var tpl;

			if (mainTpl && mainTpl !== true) {
				tpl = tpls[mainTpl];

			} else {
				if (file) {
					tpl = tpls[fileName] || tpls.main || tpls[Object.keys(tpls)[0]];

				} else {
					tpl = tpls.main || tpls[Object.keys(tpls)[0]];
				}
			}

			if (!tpl) {
				console.error('Template to run is not defined');
				res = '';

				if (!watch) {
					process.exit(1);
				}

			} else {
				var dataObj,
					cache;

				if (tplData && tplData !== true) {
					dataObj = load(tplData);
				}

				cache =
					res = tpl(dataObj);

				if (prettyPrint) {
					if (toConsole) {
						res = beautify['html'](res);

					} else {
						res = (beautify[path.extname(outFile).replace(/^\./, '')] || beautify['html'])(res);
					}

					if (!res || !res.trim()) {
						res = cache;
					}
				}
			}
		}

		if (toConsole) {
			console.log(res);

		} else {
			fs.writeFileSync(outFile, res);
			success();

			var tmp = params.debug.files;

			include[file] = include[file] || {};
			include[file][file] = true;

			if (tmp) {
				for (var key in tmp) {
					if (!tmp.hasOwnProperty(key)) {
						continue;
					}

					include[key] = include[key] || {};
					include[key][file] = true;
				}
			}
		}

	} else {
		if (!watch) {
			process.exit(1);
		}
	}
}

function end() {
	if (words) {
		testDir(words);
		fs.writeFileSync(words, JSON.stringify(params.words, null, '\t'));
	}
}

if (!file && input == null) {
	var buf = '';
	var stdin = process.stdin,
		stdout = process.stdout;

	stdin.setEncoding('utf8');
	stdin.on('data', function (chunk) {
		buf += chunk;
	});

	stdin.on('end', function () {
		action(buf);
		end();
	}).resume();

	var nl = params.lineSeparator || '\n';
	process.on('SIGINT', function () {
		stdout.write(nl);
		stdin.emit('end');
		stdout.write(nl);
		process.exit();
	});

} else {
	if (file) {
		file = path.normalize(path.resolve(file));

		var isDir = fs.statSync(file).isDirectory(),
			mask = program['mask'];

		mask = mask &&
			new RegExp(mask);

		var watchDir = function () {
			monocle.watchDirectory({
				root: file,
				listener: function (f) {
					var src = f.fullPath;
					if (!fMap[src] &&
						fs.existsSync(src) &&
						!f.stat.isDirectory() &&
						(mask ? mask.test(src) : path.extname(src) === '.ss')

					) {
						monocle.unwatchAll();
						action(fs.readFileSync(src), src);
						wacthFiles();
					}
				}
			});
		};

		var wacthFiles = function () {
			var files = [];
			for (var key in include) {
				if (!include.hasOwnProperty(key)) {
					continue;
				}

				fMap[key] = true;
				files.push(key);
			}

			monocle.watchFiles({
				files: files,
				listener: function (f) {
					var src = f.fullPath,
						files = include[src];

					if (files && !calls[src]) {
						calls[src] = setTimeout(function () {
							monocle.unwatchAll();

							for (var key in files) {
								if (!files.hasOwnProperty(key)) {
									continue;
								}

								if ((!mask || mask.test(key))) {
									if (fs.existsSync(key)) {
										action(fs.readFileSync(key), key);

									} else {
										delete include[key];
										delete fMap[key];
									}
								}
							}

							delete calls[src];
							wacthFiles();
						}, 60);
					}

					end();
				}
			});

			if (isDir) {
				watchDir();
			}
		};

		if (fs.statSync(file).isDirectory()) {
			var renderDir = function (dir) {
				fs.readdirSync(dir).forEach(function (el) {
					var src = path.join(dir, el);

					if (fs.statSync(src).isDirectory()) {
						renderDir(src);

					} else if (mask ? mask.test(src) : path.extname(el) === '.ss') {
						action(fs.readFileSync(src), src);
					}
				});
			};

			renderDir(file);

		} else if (!mask || mask.test(file)) {
			action(fs.readFileSync(file), file);
		}

		if (watch) {
			wacthFiles();
		}

	} else {
		action(input);
	}

	end();
}
