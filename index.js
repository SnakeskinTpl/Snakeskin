#!/usr/bin/env node

var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

global.Snakeskin = require('./snakeskin');
var prog = require('commander');

prog
	.version(Snakeskin.VERSION.join('.'))
	.option('-s, --source [src]', 'source file')
	.option('-o, --output [src]', 'output file')
	.option('-cjs, --commonjs', 'compile templates as commonJS module')
	.parse(process.argv);

var fs = require('fs');
var jossy = require('jossy');

var file = prog.source,
	newFile = prog.output || (file + '.js');

jossy.compile(file, null, null, function (err, data) {
	
	if (err) {
		console.log(err);

	} else {
		fs.writeFile(newFile, Snakeskin.compile(String(data), prog.commonjs, {file: file}), function (err) {
			
			if (err) {
				console.log(err);

			} else {
				console.log('File "' + file + '" has been successfully compiled (' + newFile + ').');
			}
		});
	}
});