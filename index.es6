global.Snakeskin = require('./snakeskin');
var Program = require('commander');

Program
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
	commonJS: Program['commonJS'],
	localization: Program['localization'],
	interface: Program['interface'],
	stringBuffer: Program['stringBuffer'],
	inlineIterators: Program['inlineIterators']
};

var input;

if (!Program['source'] && process.argv.length > 2) {
	input = process.argv[process.argv.length - 1];
}

var fs = require('fs');
var jossy = require('jossy');

var file = Program['source'],
	newFile = Program['output'];

function action(data) {
	if (!data) {
		Program['help']();
	}

	var str = String(data);

	if (input && !Program['output'] || !newFile) {
		params.onError = (err) => {
			console.error(err);
			process.exit(1);
		};

		console.log(Snakeskin.compile(str, params, {file: file}));
		process.exit(0);

	} else {
		fs.writeFile(newFile, Snakeskin.compile(str, params, {file: file}), (err) => {
			if (err) {
				console.error(err);
				process.exit(1);

			} else {
				console.log(`File "${file}" has been successfully compiled "${newFile}".`);
				process.exit(0);
			}
		});
	}
}

if (file) {
	jossy.compile(file, null, null, (err, data) => {
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