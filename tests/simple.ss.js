/* This code is generated automatically, don't alter it. */var Snakeskin = global.Snakeskin;exports.init = function (obj) { Snakeskin = typeof obj === "object" ? obj : require(obj);delete exports.init;exec();return this;};function exec() {/* Snakeskin template: simple_output;  */exports.simple_output= function () { var __SNAKESKIN_RESULT__ = '', $_;var TPL_NAME = 'simple_output';var PARENT_TPL_NAME;__SNAKESKIN_RESULT__ += ' ';var e = {foo: {my: function () { return 1; }}};__SNAKESKIN_RESULT__ += ' ';var a = {foo: 'my', n: 'foo'};__SNAKESKIN_RESULT__ += ' ';__SNAKESKIN_RESULT__ += e[a['n']][a['foo']](1, 2, 3);__SNAKESKIN_RESULT__ += ' ';__SNAKESKIN_RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(new String([1, 2, 3]).indexOf()));__SNAKESKIN_RESULT__ += ' ';__SNAKESKIN_RESULT__ += Snakeskin.Filters.html(($_ = Snakeskin.Filters['replace']('{foo}',/^{/gim,'')));__SNAKESKIN_RESULT__ += ' ';__SNAKESKIN_RESULT__ += Snakeskin.Filters.html(2 / 2);__SNAKESKIN_RESULT__ += ' ';return __SNAKESKIN_RESULT__; };if (typeof Snakeskin !== 'undefined') {Snakeskin.cache['simple_output'] = exports.simple_output;}/* Snakeskin template. *//**
 * @return string
 * {template bar}
 *//* Snakeskin template: simple_index; name  lname */exports.simple_index= function (name,lname) { name = name !== void 0 && name !== null ? name : 'world';var __SNAKESKIN_RESULT__ = '', $_;var TPL_NAME = 'simple_index';var PARENT_TPL_NAME;__SNAKESKIN_RESULT__ += ' <h1>Hello ';__SNAKESKIN_RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(name));__SNAKESKIN_RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(lname) ? ' ' + lname : '');__SNAKESKIN_RESULT__ += '!</h1> Foo';__SNAKESKIN_RESULT__ += 'bar///1 ';return __SNAKESKIN_RESULT__; };if (typeof Snakeskin !== 'undefined') {Snakeskin.cache['simple_index'] = exports.simple_index;}/* Snakeskin template. *//* Snakeskin template: simple_tpl.index; name  lname */if (typeof exports.simple_tpl === 'undefined') { exports.simple_tpl = {};}exports.simple_tpl.index= function index(name,lname) { name = name !== void 0 && name !== null ? name : 'world';var __SNAKESKIN_RESULT__ = '', $_;var TPL_NAME = 'simple_tpl.index';var PARENT_TPL_NAME;__SNAKESKIN_RESULT__ += ' <h1>Hello ';__SNAKESKIN_RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(name));__SNAKESKIN_RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(lname) ? ' ' + lname : '');__SNAKESKIN_RESULT__ += '!</h1>  ';return __SNAKESKIN_RESULT__; };if (typeof Snakeskin !== 'undefined') {Snakeskin.cache['simple_tpl.index'] = exports.simple_tpl.index;}/* Snakeskin template. *//* Snakeskin template: simple_tpl.foo['index']; name  lname */if (typeof exports.simple_tpl === 'undefined') { exports.simple_tpl = {};}if (typeof exports.simple_tpl.foo === 'undefined') { exports.simple_tpl.foo = {};}exports.simple_tpl.foo['index']= function (name,lname) { name = name !== void 0 && name !== null ? name : 'world';var __SNAKESKIN_RESULT__ = '', $_;var TPL_NAME = 'simple_tpl.foo[\'index\']';var PARENT_TPL_NAME;__SNAKESKIN_RESULT__ += ' <h1>Hello ';__SNAKESKIN_RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(name));__SNAKESKIN_RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(lname) ? ' ' + lname : '');__SNAKESKIN_RESULT__ += '!</h1> ';var a = 1;__SNAKESKIN_RESULT__ += ' ';__SNAKESKIN_RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(a) === 1 ? 1 : 2);__SNAKESKIN_RESULT__ += '  ';return __SNAKESKIN_RESULT__; };if (typeof Snakeskin !== 'undefined') {Snakeskin.cache['simple_tpl.foo[\'index\']'] = exports.simple_tpl.foo['index'];}/* Snakeskin template. *//* Snakeskin templating system. Generated at: Fri Mar 14 2014 15:54:00 GMT+0400 (Московское время (зима)). */}