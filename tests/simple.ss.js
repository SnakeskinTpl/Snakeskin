/* Snakeskin v3.4.0, generated at <1404375954932> Thu Jul 03 2014 12:25:54 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() { /* Snakeskin template: simple_output;  */
        this.simple_output = function() {
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'simple_output',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            var e = {
                foo: {
                    my: function() {
                        return 1;
                    }
                }
            };
            __RESULT__ += ' ';
            var a = {
                foo: 'my',
                n: 'foo'
            };
            __RESULT__ += ' ';
            __RESULT__ += e[a['n']][a['foo']](1, 2, 3);
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(new String([1, 2, 3]).indexOf()));
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(($_ = Snakeskin.Filters['replace']('{foo}', /^{/gim, '')));
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(2 / 2);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['simple_output'] = this.simple_output;
        } /* Snakeskin template. */ /* Snakeskin template: simple_index; name  lname */
        /**
         * @return string
         * {template bar}
         */
        this.simple_index = function(name, lname) {
            name = name != null ? name : 'world';
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'simple_index',
                PARENT_TPL_NAME;
            __RESULT__ += ' <h1>Hello ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(name));
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(lname) ? ' ' + lname : '');
            __RESULT__ += '!</h1> Foo';
            __RESULT__ += 'bar///1 ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['simple_index'] = this.simple_index;
        } /* Snakeskin template. */ /* Snakeskin template: simple_tpl.index; name  lname */
        if (this.simple_tpl === void 0) {
            this.simple_tpl = {};
        }
        this.simple_tpl.index = function index(name, lname) {
            name = name != null ? name : 'world';
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'simple_tpl.index',
                PARENT_TPL_NAME;
            __RESULT__ += ' <h1>Hello ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(name));
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(lname) ? ' ' + lname : '');
            __RESULT__ += '!</h1>  ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['simple_tpl.index'] = this.simple_tpl.index;
        } /* Snakeskin template. */ /* Snakeskin template: simple_tpl.foo['index']; name  lname */
        if (this.simple_tpl === void 0) {
            this.simple_tpl = {};
        }
        if (this.simple_tpl.foo === void 0) {
            this.simple_tpl.foo = {};
        }
        this.simple_tpl.foo['index'] = function(name, lname) {
            name = name != null ? name : 'world';
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'simple_tpl.foo[\'index\']',
                PARENT_TPL_NAME;
            __RESULT__ += ' <h1>Hello ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(name));
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(lname) ? ' ' + lname : '');
            __RESULT__ += '!</h1> ';
            var a = 1;
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(a) === 1 ? 1 : 2);
            __RESULT__ += '  ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['simple_tpl.foo[\'index\']'] = this.simple_tpl.foo['index'];
        } /* Snakeskin template. */
    }
}).call(this);