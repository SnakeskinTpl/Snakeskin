//#!/usr/bin/env node

global.Snakeskin = require('./snakeskin');

var program = require('commander');
var beautify = require('js-beautify');

var path = require('path');
var fs = require('fs'),
	exists = fs.existsSync || path.existsSync;

program
	.version(Snakeskin.VERSION.join('.'))

	.usage('[options] [dir|file ...]')
	.option('-p, --params [options]', 'path to the options file or JS options object')

	.option('-s, --source [src]', 'path to the template file or directory')
	.option('-f, --file [src]', 'path to the template file (meta-information)')
	.option('-m, --mask [mask]', 'mask for a template files (RegExp)')
	.option('-w, --watch', 'watch files for changes and automatically re-render')

	.option('-o, --output [src]', 'path to the file to save')
	.option('-n, --common-js', 'common.js export (for node.js)')

	.option('-e, --exec', 'execute compiled template')
	.option('-d, --data [src]', 'path to the data file or JS data object')
	.option('-t, --tpl [name]', 'name of the main template')

	.option('--disable-localization', 'disable support for localization')
	.option('--i18n-fn', 'i18n function name')
	.option('--language [src]', 'path to the localization file or localization object')
	.option('--words [src]', 'path to the localization file to save')

	.option('--ignore', 'regular expression to ignore the empty space')
	.option('--auto-replace', 'enable macros support')
	.option('--macros [src]', 'path to the macros file or JS macros object')

	.option('--disable-xml', 'disable default xml validation')
	.option('--inline-iterators', 'inline forEach and forIn')
	.option('--disable-escape-output', 'disable default "html" filter')

	.option('--render-as [mode]', 'render all templates as "interface" or "placeholder"')
	.option('--render-mode [mode]', 'render all templates in "stringConcat", "stringBuffer" or "dom"')

	.option('--pretty-print', 'formatting output')
	.parse(process.argv);

var params = program['params'] ?
	Snakeskin.toObj(params) : {};

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

params.renderAs = 'renderAs' in program ?
	program['renderAs'] : params.renderAs;

params.renderMode = 'renderMode' in program ?
	program['renderMode'] : params.renderMode;

params.inlineIterators = 'inlineIterators' in program ?
	program['inlineIterators'] : params.inlineIterators;

params.escapeOutput = 'disableEscapeOutput' in program ?
	!program['disableEscapeOutput'] : params.escapeOutput;

params.prettyPrint = 'prettyPrint' in program ?
	program['prettyPrint'] : params.prettyPrint;

params.ignore = 'ignore' in program ?
	program['ignore'] : params.ignore;

params.autoReplace = 'autoReplace' in program ?
	program['autoReplace'] : params.autoReplace;

params.macros = 'macros' in program ?
	program['macros'] : params.macros;

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

	if (exists(input)) {
		file = input;
		input = false;
	}
}

function action(data, file) {
	file = file || program['file'];
	var tpls = {},
		fileName = '';

	if (file) {
		fileName = path.basename(file, path.extname(file));
	}

	if (tplData || mainTpl || exec) {
		params.commonJS = true;
		params.context = tpls;
		params.prettyPrint = false;
	}

	function load(val) {
		let tmp = val;
		val = path.resolve(__dirname, val);

		if (exists(val) && fileName && fs.statSync(val).isDirectory()) {
			tmp = path.join(val, fileName) + '.js';

			if (!exists(tmp)) {
				tmp += 'on';
			}
		}

		return Snakeskin.toObj(tmp);
	}

	if (language) {
		params.language = load(language);
	}

	if (macros) {
		params.macros = load(macros);
	}

	var res = Snakeskin.compile(
		String(data),
		params,
		{file}
	);

	var toConsole = input && !program['output'] ||
		!out;

	if (res !== false) {
		if (tplData || mainTpl || exec) {
			let tpl;

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
				console.error('Template is not defined');
				process.exit(1);
			}

			let dataObj;
			if (tplData && tplData !== true) {
				dataObj = load(tplData);
			}

			res = tpl(dataObj);
			if (prettyPrint) {
				if (toConsole) {
					res = beautify['html'](res);

				} else {
					res = beautify[path.extname(out).replace(/^\./, '')](res);
				}
			}
		}

		if (toConsole) {
			console.log(res);

		} else {
			if (exists(out) && fs.statSync(out).isDirectory()) {
				out = path.normalize(path.join(out, path.basename(file) + '.js'));
			}

			fs.writeFileSync(out, res);
			console.log(`File "${file}" has been successfully compiled "${out}".`);
		}

	} else {
		process.exit(1);
	}
}

function end() {
	if (words) {
		fs.writeFileSync(words, JSON.stringify(params.words, null, '\t'));
	}
}

if (!file && input == null) {
	let buf = '';
	let stdin = process.stdin,
		stdout = process.stdout;

	stdin.setEncoding('utf8');
	stdin.on('data', (chunk) => {
		buf += chunk;
	});

	stdin.on('end', () => {
		action(buf);
		end();
	}).resume();

	process.on('SIGINT', () => {
		stdout.write('\n');
		stdin.emit('end');
		stdout.write('\n');
		process.exit();
	});

} else {
	if (file) {
		let mask = program['mask'];
		mask = mask && new RegExp(mask);

		if (fs.statSync(file).isDirectory()) {
			fs.readdirSync(file).forEach((el) => {
				if (mask ? mask.test(el) : path.extname(el) === '.ss') {
					let src = path.join(file, el);
					action(fs.readFileSync(src), src);
				}
			});

		} else if (!mask || mask.test(file)) {
			action(fs.readFileSync(file), file);
		}

	} else {
		action(input);
	}

	end();
}
