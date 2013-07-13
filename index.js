#!/usr/bin/env node

global.Snakeskin = require('./snakeskin');
var Program = require('commander');

Program
	.version('2.3.16')
	.option('-s, --source [src]', 'source file')
	.option('-o, --output [src]', 'output file')
	.option('-cjs, --commonjs', 'compile templates as commonJS module')
	.parse(process.argv);

var fs = require('fs');
var file = Program.source;
var commonJS = Program.commonjs;
var newFile = Program.output || (file + '.js');

var Jossy = require('jossy');
Jossy.compile(file, null, null, function (err, data) {
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