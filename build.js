var jossy = require('jossy');
var spawn = require('child_process').spawn;

var path = require('path');
var fs = require('fs');

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
			.replace(/\/\*, (\w+) \*\//gm, ', $1')
			.replace(/\/\*= (\w+) \*\//gm, '$1')
			.replace(/^\\n/gm, '');

		fs.writeFileSync(path.join(__dirname, (("build/" + file) + ".js")), res);

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

			fs.writeFileSync(
				min,
				// Хакерски вырезаем лишнее :)
				fs.readFileSync(min).toString().replace(/\\t/gm, '')
			);

			console.log((("" + file) + (" compiled, code " + code) + ""));
		});
	});
}

var builds = Object(require('./builds'));

for (var key in builds)  {
	if (!builds.hasOwnProperty(key)) {
		continue;
	}

	build(key, builds[key]);
}