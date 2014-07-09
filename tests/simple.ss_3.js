/* Snakeskin v3.4.0, generated at <1404916624773> Wed Jul 09 2014 18:37:04 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() {
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.Vars.__INCLUDE__ = {};
        } /* Snakeskin template: simple_output;  */
        this.simple_output = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'simple_output',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
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
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(new String([1, 2, 3]).indexOf()));
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(($_ = __FILTERS__['replace']('{foo}', /^{/gim, '')));
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(2 / 2);
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
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'simple_index',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' <h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name));
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(lname) ? ' ' + lname : '');
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
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'simple_tpl.index',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' <h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name));
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(lname) ? ' ' + lname : '');
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
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'simple_tpl.foo[\'index\']',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' <h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name));
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(lname) ? ' ' + lname : '');
            __RESULT__ += '!</h1> ';
            var a = 1;
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(a) === 1 ? 1 : 2);
            __RESULT__ += ' '; /**<h1>Hello {name}{lname ? \' \' + lname : \'\'}!</h1>*/
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['simple_tpl.foo[\'index\']'] = this.simple_tpl.foo['index'];
        } /* Snakeskin template. */
    }
}).call(this);