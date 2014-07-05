global.Snakeskin = require('./snakeskin');
var program = require('commander');

program
	['version'](Snakeskin.VERSION.join('.'))

	.option('-s, --source [src]')
	.option('-o, --output [src]')

	.option('-n, --commonJS')
	.option('--localization')
	.option('--interface')
	.option('--stringBuffer')
	.option('--inlineIterators')

	.parse(process.argv);

var params = {
	commonJS: program['commonJS'],
	localization: program['localization'],
	interface: program['interface'],
	stringBuffer: program['stringBuffer'],
	inlineIterators: program['inlineIterators']
};

var input;

if (!program['source'] && process.argv.length > 2) {
	input = process.argv[process.argv.length - 1];
}

var fs = require('fs');
var jossy = require('jossy');

var file = program['source'],
	newFile = program['output'];

function action(data) {
	if (!data) {
		program['help']();
	}

	var str = String(data);

	if (input && !program['output'] || !newFile) {
		params.onError = function(err)  {
			console.error(err);
			process.exit(1);
		};

		console.log(Snakeskin.compile(str, params, {file: file}));
		process.exit(0);

	} else {
		fs.writeFile(newFile, Snakeskin.compile(str, params, {file: file}), function(err)  {
			if (err) {
				console.error(err);
				process.exit(1);

			} else {
				console.log((("File \"" + file) + ("\" has been successfully compiled \"" + newFile) + "\"."));
				process.exit(0);
			}
		});
	}
}

if (file) {
	jossy.compile(file, null, null, function(err, data)  {
		if (err) {
			console.error(err);
			process.exit(1);

		} else {
			action(data);
		}
	});

} else {
	action(input);
}