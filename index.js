#!/usr/bin/env node

var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.1.0
 */

global.Snakeskin = require('./snakeskin');
var Program = require('commander');

Program
	.version(Snakeskin.VERSION.join('.'))
	.option('-s, --source [src]', 'source file')
	.option('-o, --output [src]', 'output file')
	.option('-n, --commonjs', 'compile templates as commonJS module')
	.parse(process.argv);

var input;

if (!Program.source) {
	input = process.argv[2];
}

var fs = require('fs');
var jossy = require('jossy');

var file = Program.source,
	newFile = Program.output || (file + '.js');

function action(data) {
	var __NEJS_THIS__ = this;
	if (!data) {
		Program.help();
	}

	var str = String(data);

	if (input && !Program.output) {
		console.log(Snakeskin.compile(str, Program.commonjs, {file: file}));

	} else {
		fs.writeFile(newFile, Snakeskin.compile(str, Program.commonjs, {file: file}), function (err) {
			
			if (err) {
				console.log(err);

			} else {
				console.log('File "' + file + '" has been successfully compiled (' + newFile + ').');
			}
		});
	}
}

if (file) {
	jossy.compile(file, null, null, function (err, data) {
		
		if (err) {
			console.log(err);

		} else {
			action(data);
		}
	});

} else {
	action(input);
}

