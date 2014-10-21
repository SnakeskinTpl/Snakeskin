var jossy = require('jossy');
var escaper = require('escaper');

var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');

var V = require('./lib/core')['VERSION'].join('.');
var program = require('commander');

program
	.option('-d, --dev')
	.parse(process.argv);

function build(file, flags) {
	jossy.compile(path.join(__dirname, 'lib/core.js'), null, flags, function(err, res)  {
		if (err) {
			throw err;
		}

		res = res
			// https://github.com/termi/es6-transpiler/issues/61
			.replace(/(for\s*\(\s*var\s+[^=]+)= void 0 in/g, '$1 in')

			// Фикс @param {foo} [bar=1] -> @param {foo} [bar]
			.replace(/(@param {.*?[^=]}) \[(\w+)=.*?[^\]]]/g, '$1 $2')

			// {...string} -> {...(string|Array)}
			.replace(/{\.\.\.\(?([^}]+)\)?}/g, '{...($1|Array)}')

			// /*, foo */ -> , foo
			.replace(/\/\*, (\w+) \*\//g, ', $1')

			// /*= foo */ -> foo
			.replace(/\/\*= (\w+) \*\//g, '$1')

			// //= foo -> foo
			.replace(/\/\/= (.*)/g, '$1')

			// Пробельные символы в строках-шаблонах
			.replace(/\/\* cbws \*\/.*?[(]+"[\s\S]*?[^\\"]"[)]+;?(?:$|[}]+$)/gm, function(sstr)  {return sstr.replace(/\\n|\t/g, '')});

		var desc = file !== 'snakeskin' ?
			((" (" + (file.replace(/snakeskin\./, ''))) + ")") : '';

		res =
(("/*!\
\n * Snakeskin v" + V) + ("" + desc) + ("\
\n * https://github.com/kobezzza/Snakeskin\
\n *\
\n * Released under the MIT license\
\n * https://github.com/kobezzza/Snakeskin/blob/master/LICENSE\
\n *\
\n * Date: " + (new Date().toUTCString())) + "\
\n */\
\n\
\n") + res;

		fs.writeFileSync(path.join(__dirname, (("build/" + file) + ".js")), res);

		if (program['dev']) {
			return;
		}

		var gcc = spawn('java', [
			'-jar',
			'compiler.jar',

			'--js',
			(("build/" + file) + ".js"),

			'--compilation_level',
			'ADVANCED_OPTIMIZATIONS',

			'--use_types_for_optimization',
			'--externs',
			'predefs.js',

			'--language_in',
			'ECMASCRIPT5',

			'--jscomp_warning',
			'invalidCasts',

			'--js_output_file',
			(("build/" + file) + ".min.js")
		]);

		gcc.stderr.on('data', function(data)  {
			fs.writeFileSync(path.join(__dirname, 'build/log.txt'), data);
			console.log(String(data));
		});

		gcc.on('close', function(code)  {
			var min = path.join(__dirname, (("build/" + file) + ".min.js")),
				res = (("/*! Snakeskin v" + V) + ("" + desc) + " | https://github.com/kobezzza/Snakeskin/blob/master/LICENSE */") +
					fs.readFileSync(min);

			fs.writeFileSync(min, res);
			console.log((("" + file) + (" compiled, code " + code) + ""));

			function updateManifest(url) {
				fs.writeFileSync(url, fs.readFileSync(url).toString().replace(/"version": ".*?"/, (("\"version\": \"" + V) + "\"")));
			}

			updateManifest(path.join(__dirname, 'package.json'));
			updateManifest(path.join(__dirname, 'bower.json'));

			var index = path.join(__dirname, '/bin/snakeskin.js');
			fs.writeFileSync(index, fs.readFileSync(index).toString().replace(/^\/\//, ''));
		});
	});
}

var builds = Object(require('./builds'));

for (var key in builds) {
	if (!builds.hasOwnProperty(key)) {
		continue;
	}

	build(key, builds[key]);
}
