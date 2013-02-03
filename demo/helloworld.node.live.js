global.Snakeskin = require('../snakeskin.min.js');
Snakeskin.compile(require('fs').readFileSync('helloworld.ss'));
console.log(helloWorld());