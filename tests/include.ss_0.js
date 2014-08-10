/* Snakeskin v4.0.0, label <1407660751509>, generated at <1407667213646> Sun Aug 10 2014 14:40:13 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_0c659'];
        __LOCAL__.foo_0_0c659 = 1;
        __LOCAL__.foo_1_0c659 = 2;
        __LOCAL__.foo_2_0c659 = 3; /* Snakeskin template: include.bar; name  */
        if (this.include == null) {
            this.include = {};
        }
        this.include.bar = function bar(name) {
            var __THIS__ = this,
                callee = __ROOT__.include.bar;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'include.bar',
                PARENT_TPL_NAME;
            name = arguments[0] = name != null ? name : 'world';
            __RESULT__ += '<h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name), false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__LOCAL__.foo_2_0c659), false);
            __RESULT__ += '!</h1> ';
            return __RESULT__;
        };
        Snakeskin.cache['include.bar'] = this.include.bar; /* Snakeskin template. */ /* Snakeskin template: include['foo' + '--']; name */
        if (this.include == null) {
            this.include = {};
        }
        this.include['foo--'] = function(name) {
            var __THIS__ = this,
                callee = __ROOT__.include['foo--'];
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'include[\'foo--\']',
                PARENT_TPL_NAME = 'include.bar';
            name = arguments[0] = name != null ? name : 'world';
            __RESULT__ += '<h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name), false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__LOCAL__.foo_1_0c659), false);
            __RESULT__ += '!</h1> ';
            return __RESULT__;
        };
        Snakeskin.cache['include[\'foo--\']'] = this.include['foo--']; /* Snakeskin template. */ /* Snakeskin template: include_index; name */
        this.include_index = function(name) {
            var __THIS__ = this,
                callee = __ROOT__.include_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'include_index',
                PARENT_TPL_NAME = 'include[\'foo--\']';
            name = arguments[0] = name != null ? name : 'world';
            __RESULT__ += '<h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name), false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__LOCAL__.foo_0_0c659), false);
            __RESULT__ += '!</h1> ';
            return __RESULT__;
        };
        Snakeskin.cache['include_index'] = this.include_index; /* Snakeskin template. */
    }
}).call(this);