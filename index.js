#!/usr/bin/env node

global.Snakeskin = require('./snakeskin');
var program = require('./node_modules/commander');

program
	.version('2.3.7')
	.option('-s, --source [src]', 'source file')
	.option('-o, --output [src]', 'output file')
	.option('-cjs, --commonjs', 'compile templates as commonJS module')
	.parse(process.argv);

var fs = require('fs');
var file = program.source;
var commonJS = program.commonjs;
var newFile = program.output || (file + '.js');

fs.readFile(file, function (err, data) {
	if (err) {
		console.log(err);

	} else {
		fs.writeFile(newFile, Snakeskin.compile(String(data), commonJS, {file: file}), function (err) {
			if (err) {
				console.log(err);

			} else {
				console.log('File "' + file + '" has been successfully compiled (' + newFile + ').');
			}
		});
	}
});