/* This code is generated automatically, don't alter it. */var Snakeskin = global.Snakeskin;exports.init = function (obj) { Snakeskin = typeof obj === "object" ? obj : require(obj);exec();return this;};function exec() {/* Snakeskin template: helloWorld; name  */exports.helloWorld= function (name) { name = name !== void 0 && name !== null ? name : 'world';var __SNAKESKIN_RESULT__ = '', $_;var TPL_NAME = 'helloWorld';var PARENT_TPL_NAME;__SNAKESKIN_RESULT__ += ' <h1>Hello ';__SNAKESKIN_RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(name));__SNAKESKIN_RESULT__ += '!</h1> ';return __SNAKESKIN_RESULT__; };if (typeof Snakeskin !== 'undefined') {Snakeskin.cache['helloWorld'] = exports.helloWorld;}/* Snakeskin template. *//* Snakeskin templating system. Generated at: Mon Jan 13 2014 17:51:48 GMT+0400 (Московское время (зима)). */}