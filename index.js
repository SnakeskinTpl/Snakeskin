#!/usr/bin/env node

global.Snakeskin = require('./snakeskin');
var program = require('./node_modules/commander');

program
	.version('2.3.4')
	.option('-s, --source [src]', 'Source file')
	.option('-o, --output [src]', 'Output file')
	.option('-cjs, --commonjs', 'Compile templates as commonJS module')
	.parse(process.argv);

var fs = require('fs');
var file = program.source;
var commonJS = program.commonjs;
var newFile = program.output || (file + '.js');

fs.readFile(file, function (err, data) {
	var res;

	if (err) {
		console.log(err);

	} else {
		res = Snakeskin.compile(String(data), commonJS, {file: file});

		fs.writeFile(newFile, res, function (err) {
			if (err) {
				console.log(err);

			} else {
				console.log('File "' + file + '" has been successfully compiled (' + newFile + ').');
			}
		});
	}
});