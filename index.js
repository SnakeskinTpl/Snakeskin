#!/usr/bin/env node

global.Snakeskin = require('./snakeskin');

var program = require('commander');
var beautify = require('js-beautify');

var path = require('path');
var fs = require('fs'),
	exists = fs.existsSync || path.existsSync;

program
	.version(Snakeskin.VERSION.join('.'))

	.usage('[options] [dir|file ...]')
	.option('-p, --params [options]', 'path to the options file or options object')

	.option('-s, --source [src]', 'path to the template file')
	.option('-f, --file [src]', 'path to the template file (meta-information)')
	.option('-o, --output [src]', 'path to the file to save')
	.option('-n, --common-js', 'common.js export (for node.js)')

	.option('-e, --exec', 'execute compiled template')
	.option('-d, --data [src]', 'path to the data file or data object')
	.option('-t, --tpl [name]', 'name of the main template')

	.option('--disable-localization', 'disable support for localization')
	.option('--i18n-fn', 'i18n function name')
	.option('--language [src]', 'path to the localization file or localization object')
	.option('--words [src]', 'path to the localization file to save')

	.option('--auto-replace', 'enable macros support')
	.option('--macros [src]', 'path to the macros file or macros object')

	.option('--disable-xml', 'disable default xml validation')
	.option('--interface', 'render all templates as interface')
	.option('--string-buffer', 'use StringBuffer for concatenate strings')
	.option('--inline-iterators', 'inline forEach and forIn')
	.option('--disable-escape-output', 'disable default "html" filter')
	.option('--pretty-print', 'formatting output')

	.parse(process.argv);

var params = program['params'] ?
	parse(params) : {};

params.xml = 'disableXml' in program ?
	!program['disableXml'] : params.xml;

params.commonJS = 'commonJs' in program ?
	program['commonJs'] : params.commonJS;

params.localization = 'disableLocalization' in program ?
	!program['disableLocalization'] : params.localization;

params.i18nFn = 'i18nFn' in program ?
	program['i18nFn'] : params.i18nFn;

params.language = 'language' in program ?
	program['language'] : params.language;

params.words = 'words' in program ?
	program['words'] : params.words;

params.interface = 'interface' in program ?
	program['interface'] : params.interface;

params.stringBuffer = 'stringBuffer' in program ?
	program['stringBuffer'] : params.stringBuffer;

params.inlineIterators = 'inlineIterators' in program ?
	program['inlineIterators'] : params.inlineIterators;

params.escapeOutput = 'disableEscapeOutput' in program ?
	!program['disableEscapeOutput'] : params.escapeOutput;

params.prettyPrint = 'prettyPrint' in program ?
	program['prettyPrint'] : params.prettyPrint;

params.autoReplace = 'autoReplace' in program ?
	program['autoReplace'] : params.autoReplace;

params.macros = 'macros' in program ?
	program['macros'] : params.macros;

var prettyPrint = params.prettyPrint;

if (params.language) {
	params.language = parse(params.language);
}

if (params.macros) {
	params.macros = parse(params.macros);
}

var exec = program['exec'];
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
	if (typeof val !== 'string') {
		return val;
	}

	if (exists(val)) {
		val = fs.readFileSync(val).toString();
	}

	var res;

	try {
		res = JSON.parse(val);

	} catch (ignore) {
		try {
			res = eval((("(" + val) + ")"));

		} catch (ignore) {
			res = {};
		}
	}

	return res || {};
}

function action(data) {
	var tpls = {};

	if (tplData || mainTpl || exec) {
		params.commonJS = true;
		params.context = tpls;
		params.prettyPrint = false;
	}

	var res = Snakeskin.compile(
		String(data),
		params,

		{
			file: program['file'] || file
		}
	);

	var toConsole = input && !program['output'] ||
		!newFile;

	if (res !== false) {
		if (tplData || mainTpl || exec) {
			var tpl;

			if (mainTpl && mainTpl !== true) {
				tpl = tpls[mainTpl];

			} else {
				if (file) {
					tpl = tpls[path.basename(file, path.extname(file))] || tpls.main || tpls[Object.keys(tpls)[0]];

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
					res = beautify[path.extname(newFile).replace(/^\./, '')](res);
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

if (!file && input == null) {
	var buf = '';
	var stdin = process.stdin,
		stdout = process.stdout;

	stdin.setEncoding('utf8');
	stdin.on('data', function(chunk)  {
		buf += chunk;
	});

	stdin.on('end', function()  {
		action(buf);
	}).resume();

	process.on('SIGINT', function()  {
		stdout.write('\n');
		stdin.emit('end');
		stdout.write('\n');
		process.exit();
	});

} else {
	action(file ? fs.readFileSync(file) : input);
}