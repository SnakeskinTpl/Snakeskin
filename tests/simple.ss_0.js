/* Snakeskin v4.0.0, label <1405794071621>, generated at <1407325059926> Wed Aug 06 2014 15:37:39 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports['init'] = function(obj) {
        Snakeskin = Snakeskin || obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() {
        var __ROOT__ = this,
            self = this;
        var $C = this.$C != null ? this.$C : Snakeskin.Vars.$C,
            async = this.async != null ? this.async : Snakeskin.Vars.async;
        var __$C__ = $C,
            __async__ = async;
        var __FILTERS__ = Snakeskin.Filters,
            __VARS__ = Snakeskin.Vars,
            __LOCAL__ = Snakeskin.LocalVars,
            __STR__, __TMP__, __J__;
        var $_ = __LOCAL__['$_45a8c']; /* Snakeskin template: simple_output;  */
        this.simple_output = function() {
            var __THIS__ = this,
                callee = __ROOT__.simple_output;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'simple_output',
                PARENT_TPL_NAME;
            e = ({
                foo: {
                    my: function() {
                        return 1;
                    }
                }
            });
            __RESULT__ += ' ';
            a = ({
                foo: 'my',
                n: 'foo'
            });
            __RESULT__ += ' ';
            __RESULT__ += e[a['n']][a['foo']](1, 2, 3);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(new String([1, 2, 3]).indexOf()));
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(($_ = __FILTERS__['replace'].call(this, '{foo}', /^{/gim, '')));
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(2 / 2);
            __RESULT__ += ' ';
            var e;
            var a;
            return __RESULT__;
        };
        Snakeskin.cache['simple_output'] = this.simple_output; /* Snakeskin template. */ /* Snakeskin template: simple_index; name lname */
        /**
         * @return string
         * {template bar}
         */
        this.simple_index = function(name, lname) {
            var __THIS__ = this,
                callee = __ROOT__.simple_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'simple_index',
                PARENT_TPL_NAME;
            name = arguments[0] = name != null ? name : 'world';
            __RESULT__ += '<h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name));
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(lname) ? ' ' + lname : '');
            __RESULT__ += '!</h1> Foo';
            __RESULT__ += 'bar///1 ';
            return __RESULT__;
        };
        Snakeskin.cache['simple_index'] = this.simple_index; /* Snakeskin template. */ /* Snakeskin template: simple_tpl.index; name lname */
        if (this.simple_tpl == null) {
            this.simple_tpl = {};
        }
        this.simple_tpl.index = function index(name, lname) {
            var __THIS__ = this,
                callee = __ROOT__.simple_tpl.index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'simple_tpl.index',
                PARENT_TPL_NAME;
            name = arguments[0] = name != null ? name : 'world';
            __RESULT__ += '<h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name));
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(lname) ? ' ' + lname : '');
            __RESULT__ += '!</h1> ';
            return __RESULT__;
        };
        Snakeskin.cache['simple_tpl.index'] = this.simple_tpl.index; /* Snakeskin template. */ /* Snakeskin template: simple_tpl.foo['index']; name lname */
        if (this.simple_tpl == null) {
            this.simple_tpl = {};
        }
        if (this.simple_tpl.foo == null) {
            this.simple_tpl.foo = {};
        }
        this.simple_tpl.foo['index'] = function(name, lname) {
            var __THIS__ = this,
                callee = __ROOT__.simple_tpl.foo['index'];
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'simple_tpl.foo[\'index\']',
                PARENT_TPL_NAME;
            name = arguments[0] = name != null ? name : 'world';
            __RESULT__ += '<h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name));
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(lname) ? ' ' + lname : '');
            __RESULT__ += '!</h1> ';
            a = 1;
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(a) === 1 ? 1 : 2);
            __RESULT__ += ' '; /**<h1>Hello {name}{lname ? \' \' + lname : \'\'}!</h1>*/
            var a;
            return __RESULT__;
        };
        Snakeskin.cache['simple_tpl.foo[\'index\']'] = this.simple_tpl.foo['index']; /* Snakeskin template. */
    }
}).call(this);