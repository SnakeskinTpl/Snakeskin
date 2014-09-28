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
			.replace(/\bBoolean\((.*?)\)/gm, '!!($1)')
			.replace(/\bString\((.*?)\)/gm, "(($1) + '')")
			.replace(/\bNumber\((.*?)\)/gm, '+($1)')

			// Всякие хаки, чтобы GCC не ругался
			.replace(/(@param {.*?[^=]}) \[(\w+)=.*?[^\]]]/gm, '$1 $2')
			.replace(/{\.\.\.\(?([^}]+)\)?}/gm, '{...($1|Array)}')
			.replace(/\/\*, (\w+) \*\//gm, ', $1')
			.replace(/\/\*= (\w+) \*\//gm, '$1')
			.replace(/\/\/= (.*)/gm, '$1')
			.replace(/^\\n/gm, '');

		var desc = file !== 'snakeskin' ? ((" (" + (file.replace(/snakeskin\./, ''))) + ")") : '';

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
			var min = path.join(__dirname, (("build/" + file) + ".min.js"));
			var content = escaper.replace(fs.readFileSync(min).toString(), {
				'\'': true,
				'/': true
			});

			// Хакерски вырезаем лишнее :)
			var res = escaper.paste(content.replace(/\\t/gm, ''));
			res = (("/*! Snakeskin v" + V) + ("" + desc) + " | https://github.com/kobezzza/Snakeskin/blob/master/LICENSE */") + res;

			fs.writeFileSync(min, res);
			console.log((("" + file) + (" compiled, code " + code) + ""));

			function updateManifest(url) {
				fs.writeFileSync(url, fs.readFileSync(url).toString().replace(/"version": ".*?"/gm, (("\"version\": \"" + V) + "\"")));
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
