/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,false,,stringConcat,true,true,true,,true,true,i18n>, label <1414071186510>, includes <[["c:\\\\Users\\\\kobez_000\\\\Documents\\\\Dev\\\\Snakeskin\\\\test\\\\test\\\\foo.ss",1413886610377],["c:\\\\Users\\\\kobez_000\\\\Documents\\\\Dev\\\\Snakeskin\\\\test\\\\test\\\\foo\\\\bar.ss",1413886610378]]>, generated at <1414919437017>.
   This code is generated automatically, don't alter it. */
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
        var __APPEND__ = Snakeskin.appendChild,
            __FILTERS__ = Snakeskin.Filters,
            __VARS__ = Snakeskin.Vars,
            __LOCAL__ = Snakeskin.LocalVars,
            __STR__, __TMP__, __J__;
        var $_ = __LOCAL__['$_749a9'];
        __LOCAL__.foo_0_749a9 = 1;
        var bar_00_749a9 = __LOCAL__.bar_00_749a9 = 1;
        __LOCAL__.foo_1_749a9 = 2;
        __LOCAL__.foo_2_749a9 = 3; /* Snakeskin template: include.bar; name  */
        if (this.include == null) {
            this.include = {};
        }
        this.include.bar = function bar(name) {}; /* Snakeskin template. */ /* Snakeskin template: include['foo' + '--']; name */
        if (this.include == null) {
            this.include = {};
        }
        this.include['foo--'] = function(name) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.include['foo--'],
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "include['foo--']",
                PARENT_TPL_NAME = "include.bar";
            name = arguments[0] = name != null ? name : 'world';
            __RESULT__ += '<h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name), false, false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__LOCAL__.foo_1_749a9), false, false);
            __RESULT__ += '!</h1> ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__LOCAL__.bar_00_749a9), false, false);
            __RESULT__ += ' ';
        }; /* Snakeskin template. */ /* Snakeskin template: include_index; name */
        this.include_index = function(name) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.include_index,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "include_index",
                PARENT_TPL_NAME = "include['foo--']";
            name = arguments[0] = name != null ? name : 'world';
            __RESULT__ += '<h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name), false, false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__LOCAL__.foo_0_749a9), false, false);
            __RESULT__ += '!</h1> ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__LOCAL__.bar_00_749a9), false, false);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache["include_index"] = this.include_index; /* Snakeskin template. */
    }
}).call(this);
