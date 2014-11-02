/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,true,,stringConcat,true,true,true,,true,true,i18n>, label <1413886610357>, includes <>, generated at <1414919438066>.
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
        var $_ = __LOCAL__['$_2bcff']; /* Snakeskin template: param_base; a,b  */
        this.param_base = function(a, b) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.param_base,
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
            var TPL_NAME = "param_base",
                PARENT_TPL_NAME;
            b = arguments[1] = b != null ? b : 1 ? Math.round(1) : 0;
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(b), false, false);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache["param_base"] = this.param_base; /* Snakeskin template. */ /* Snakeskin template: param_child;  */
        this.param_child = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.param_child,
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
            var TPL_NAME = "param_child",
                PARENT_TPL_NAME = "param_base";
            var a = void 0;
            var b = 1 ? Math.round(1) : 0;
            b = 2;
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(b), false, false);
            __RESULT__ += ' ';
            var b;
            return __RESULT__;
        };
        Snakeskin.cache["param_child"] = this.param_child; /* Snakeskin template. */ /* Snakeskin template: param_child2;  */
        this.param_child2 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.param_child2,
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
            var TPL_NAME = "param_child2",
                PARENT_TPL_NAME = "param_child";
            var a = void 0;
            var b = 1 ? Math.round(1) : 0;
            b = 3;
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(b), false, false);
            __RESULT__ += ' ';
            var b;
            return __RESULT__;
        };
        Snakeskin.cache["param_child2"] = this.param_child2; /* Snakeskin template. */ /* Snakeskin template: param_base2; @a  */
        this.param_base2 = function(a) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.param_base2,
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
            var TPL_NAME = "param_base2",
                PARENT_TPL_NAME;
            a = arguments[0] = a != null ? a : ({
                a: 1
            });
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(a.a), false, false);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache["param_base2"] = this.param_base2; /* Snakeskin template. */ /* Snakeskin template: param_child22; @a */
        this.param_child22 = function(a) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.param_child22,
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
            var TPL_NAME = "param_child22",
                PARENT_TPL_NAME = "param_base2";
            a = arguments[0] = a != null ? a : ({
                a: 1
            });
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(a.a), false, false);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache["param_child22"] = this.param_child22; /* Snakeskin template. */ /* Snakeskin template: param_base3; @a  */
        this.param_base3 = function(a) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.param_base3,
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
            var TPL_NAME = "param_base3",
                PARENT_TPL_NAME;
            a = arguments[0] = a != null ? a : ({
                a: {
                    c: 1
                }
            });
            b = 2;
            var __a__proto_405 = void 0 != null ? void 0 : 1 ? a.a : Math.round(0);
            var __arguments__proto_405 = [__a__proto_405];
            __arguments__proto_405.callee = __CALLEE__;
            var ____I_PROTO___foo_with_52 = 1;
            ____I_PROTO___foo_with_52: while (____I_PROTO___foo_with_52--) {
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__a__proto_405.c), false, false);
                __RESULT__ += ' ';
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(b), false, false);
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            var b;
            return __RESULT__;
        };
        Snakeskin.cache["param_base3"] = this.param_base3; /* Snakeskin template. */
    }
}).call(this);
