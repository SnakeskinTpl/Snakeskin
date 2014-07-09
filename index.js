global.Snakeskin = require('./snakeskin');
var program = require('commander');

program
	['version'](Snakeskin.VERSION.join('.'))

	.option('-s, --source [src]', 'path to the template file')
	.option('-o, --output [src]', 'path to the file to save')
	.option('-n, --common-js', 'common.js export (for node.js)')

	.option('--disable-localization', 'disable support for localization')
	.option('--language [src]', 'path to the localization file (JSON)')
	.option('--words [src]', 'path to the localization file to save')

	.option('--interface', 'render all templates as interface')
	.option('--string-buffer', 'use StringBuffer for concatenate strings')
	.option('--inline-iterators', 'inline forEach and forIn')
	.option('--disable-escape-output', 'disable default "html" filter')
	.option('--pretty-print', 'formatting output')

	.parse(process.argv);

var fs = require('fs');
var jossy = require('jossy');

var params = {
	commonJS: program['commonJs'],
	localization: !program['disableLocalization'],
	language: program['language'],
	words: program['words'],
	interface: program['interface'],
	stringBuffer: program['stringBuffer'],
	inlineIterators: program['inlineIterators'],
	escapeOutput: !program['disableEscapeOutput'],
	prettyPrint: program['prettyPrint']
};

if (params.language) {
	params.language = JSON.parse(fs.readFileSync(params.language).toString());
}

var words = params.words;

if (words) {
	params.words = [];
}

var input;

if (!program['source'] && process.argv.length > 2) {
	input = process.argv[process.argv.length - 1];
}

var file = program['source'],
	newFile = program['output'];

function action(data) {
	if (!data) {
		program['help']();
	}

	var str = String(data),
		res = Snakeskin.compile(str, params, {file: file});

	if (res !== false) {
		if (input && !program['output'] || !newFile) {
			console.log(res);

		} else {
			fs.writeFileSync(newFile, res);
			console.log((("File \"" + file) + ("\" has been successfully compiled \"" + newFile) + "\"."));
		}

	} else {
		process.exit(1);
	}

	if (words) {
		fs.writeFileSync(words, JSON.stringify(params.words));
	}

	process.exit(0);
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