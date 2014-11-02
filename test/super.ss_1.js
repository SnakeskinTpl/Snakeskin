/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,false,,stringConcat,true,true,true,,true,true,i18n>, label <1413886610371>, includes <>, generated at <1414919437449>.
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
        var $_ = __LOCAL__['$_37639']; /* Snakeskin template: super_base;  */
        this.super_base = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.super_base,
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
            var TPL_NAME = "super_base",
                PARENT_TPL_NAME;
            a = 1;
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(a), false, false);
            var __arguments__proto_88 = [];
            __arguments__proto_88.callee = __CALLEE__;
            var ____I_PROTO___bar_template_45 = 1;
            ____I_PROTO___bar_template_45: while (____I_PROTO___bar_template_45--) {
                __RESULT__ += '2';
            }
            var a;
            return __RESULT__;
        };
        Snakeskin.cache["super_base"] = this.super_base; /* Snakeskin template. */ /* Snakeskin template: super_child;  */
        this.super_child = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.super_child,
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
            var TPL_NAME = "super_child",
                PARENT_TPL_NAME = "super_base";
            a = 2;
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(a), false, false);
            var __arguments__proto_227 = [];
            __arguments__proto_227.callee = __CALLEE__;
            var ____I_PROTO___bar_template_44 = 1;
            ____I_PROTO___bar_template_44: while (____I_PROTO___bar_template_44--) {
                __RESULT__ += '2';
                __RESULT__ += '1';
            }
            var a;
            return __RESULT__;
        };
        Snakeskin.cache["super_child"] = this.super_child; /* Snakeskin template. */
    }
}).call(this);
