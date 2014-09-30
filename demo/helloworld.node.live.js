var snakeskin = require('../snakeskin');

snakeskin.compile(require('fs').readFileSync(require('path').join(__dirname, 'helloworld.ss')), {
	context: exports
});

console.log(exports.helloWorld());
