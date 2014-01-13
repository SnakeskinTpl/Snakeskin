var snakeskin = require('../snakeskin');

snakeskin.compile(require('fs').readFileSync('helloworld.ss'), {
	context: exports
});

exports.init(snakeskin);
console.log(exports.helloWorld());