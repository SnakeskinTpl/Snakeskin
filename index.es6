//#!/usr/bin/env node

global.Snakeskin = require('./snakeskin');

var program = require('commander');
var beautify = require('js-beautify');

var path = require('path');
var fs = require('fs'),
	exists = fs.existsSync || path.existsSync;

program
	.version(Snakeskin.VERSION.join('.'))

	.usage('[options] [text ...]')
	.option('-p, --params', 'javascript options object')

	.option('-s, --source [src]', 'path to the template file')
	.option('-o, --output [src]', 'path to the file to save')
	.option('-n, --common-js', 'common.js export (for node.js)')

	.option('-d, --data [src]', 'path to the data file (JSON) or data JSON')
	.option('-t, --tpl [name]', 'name of the main template')

	.option('--disable-localization', 'disable support for localization')
	.option('--i18n-fn', 'i18n function name')
	.option('--language [src]', 'path to the localization file (JSON) or localization JSON')
	.option('--words [src]', 'path to the localization file to save')

	.option('--disable-xml', 'disable default xml validation')
	.option('--interface', 'render all templates as interface')
	.option('--string-buffer', 'use StringBuffer for concatenate strings')
	.option('--inline-iterators', 'inline forEach and forIn')
	.option('--disable-escape-output', 'disable default "html" filter')
	.option('--pretty-print', 'formatting output')

	.parse(process.argv);

var params = program['params'];

if (params) {
	params = parse(params);

} else {
	params = {
		xml: !program['disableXml'],
		commonJS: program['commonJs'],
		localization: !program['disableLocalization'],
		i18nFn: program['i18nFn'],
		language: program['language'],
		words: program['words'],
		interface: program['interface'],
		stringBuffer: program['stringBuffer'],
		inlineIterators: program['inlineIterators'],
		escapeOutput: !program['disableEscapeOutput'],
		prettyPrint: program['prettyPrint']
	};
}

var prettyPrint = params.prettyPrint;

if (params.language) {
	params.language = parse(params.language);
}

var tplData = program['data'],
	mainTpl = program['tpl'];

var words = params.words;

if (words) {
	params.words = {};
}

var args = program['args'],
	input;

var file = program['source'],
	newFile = program['output'];

if (!file && args.length) {
	input = args.join(' ');

	if (exists(input)) {
		file = input;
		input = false;
	}
}

function parse(val) {
	if (exists(val)) {
		return JSON.parse(fs.readFileSync(val));
	}

	return eval(`(${val})`);
}

function action(data) {
	if (!data && !file) {
		program['help']();
	}

	var tpls = {};

	if (tplData || mainTpl) {
		params.commonJS = true;
		params.context = tpls;
		params.prettyPrint = false;
	}

	var str = String(data),
		res = Snakeskin.compile(str, params, {file: file});

	var toConsole = input && !program['output'] ||
		!newFile;

	if (res !== false) {
		if (tplData || mainTpl) {
			let tpl;

			if (mainTpl && mainTpl !== true) {
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

			if (tplData && tplData !== true) {
				tplData = parse(tplData);

			} else {
				tplData = void 0;
			}

			res = tpl(tplData);

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
			console.log(`File "${file}" has been successfully compiled "${newFile}".`);
		}

	} else {
		process.exit(1);
	}

	if (words) {
		fs.writeFileSync(words, JSON.stringify(params.words, null, '\t'));
	}

	process.exit(0);
}

if (input == null) {
	let buf = '';
	let stdin = process.stdin,
		stdout = process.stdout;

	stdin.setEncoding('utf8');
	stdin.on('data', (chunk) => {
		buf += chunk;
	});

	stdin.on('end', () => {
		action(buf);
	}).resume();

	process.on('SIGINT', () => {
		stdout.write('\n');
		stdin.emit('end');
		stdout.write('\n');
		process.exit();
	});

} else {
	action(file ? fs.readFileSync(file).toString() : input);
}

