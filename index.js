//#!/usr/bin/env node

global.Snakeskin = require('./snakeskin');
var program = require('commander');

program
	['version'](Snakeskin.VERSION.join('.'))

	.option('-s, --source [src]', 'path to the template file')
	.option('-o, --output [src]', 'path to the file to save')
	.option('-n, --common-js', 'common.js export (for node.js)')

	.option('-d, --data [src]', 'path to the data file (JSON) or data JSON')
	.option('-t, --tpl [name]', 'name of the main template')

	.option('--disable-localization', 'disable support for localization')
	.option('--language [src]', 'path to the localization file (JSON) or localization JSON')
	.option('--words [src]', 'path to the localization file to save')

	.option('--disable-xml', 'disable default xml validation')
	.option('--interface', 'render all templates as interface')
	.option('--string-buffer', 'use StringBuffer for concatenate strings')
	.option('--inline-iterators', 'inline forEach and forIn')
	.option('--disable-escape-output', 'disable default "html" filter')
	.option('--pretty-print', 'formatting output')

	.parse(process.argv);

var fs = require('fs');
var params = {
	xml: !program['disableXml'],
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

var lang = params.language,
	prettyPrint = params.prettyPrint;

if (lang) {
	try {
		params.language = JSON.parse(lang);

	} catch (ignore) {
		params.language = JSON.parse(fs.readFileSync(lang).toString());
	}
}

var dataSrc = program['data'],
	mainTpl = program['tpl'];

var beautify = require('js-beautify');
var words = params.words;

if (words) {
	params.words = {};
}

var input;

if (!program['source'] && process.argv.length > 2) {
	input = process.argv[process.argv.length - 1];
}

var file = program['source'],
	newFile = program['output'];

function action(data) {
	if (!data && !file) {
		program['help']();
	}

	var tpls = {};

	if (dataSrc || mainTpl) {
		params.commonJS = true;
		params.context = tpls;
		params.prettyPrint = false;
	}

	var str = String(data),
		res = Snakeskin.compile(str, params, {file: file});

	var toConsole = input && !program['output'] ||
		!newFile;

	if (res !== false) {
		if (dataSrc || mainTpl) {
			var tpl;

			if (mainTpl) {
				tpl = tpls[mainTpl];

			} else {
				if (file) {
					tpl = tpls[file.split('.').slice(0, -1).join('.')] || tpls.main || tpls[Object.keys(tpls)[0]];

				} else {
					tpl = tpls.main || tpls[Object.keys(tpls)[0]];
				}
			}

			if (!tpl) {
				console.error('Template is not defined');
				process.exit(1);
			}

			var dtd = void 0;
			if (dtd && dtd !== true) {
				try {
					dtd = JSON.parse(dataSrc);

				} catch (ignore) {
					dtd = JSON.parse(fs.readFileSync(dataSrc).toString());
				}
			}

			res = tpl(dtd);
			if (prettyPrint) {
				if (toConsole) {
					res = beautify['html'](res);

				} else {
					res = beautify[newFile.split('.').slice(-1)](res);
				}
			}
		}

		if (toConsole) {
			console.log(res);

		} else {
			fs.writeFileSync(newFile, res);
			console.log((("File \"" + file) + ("\" has been successfully compiled \"" + newFile) + "\"."));
		}

	} else {
		process.exit(1);
	}

	if (words) {
		fs.writeFileSync(words, JSON.stringify(params.words, null, '\t'));
	}

	process.exit(0);
}

action(file ? fs.readFileSync(file).toString() : input);