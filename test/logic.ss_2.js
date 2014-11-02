/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,true,,stringConcat,true,true,true,,true,true,i18n>, label <1413886610352>, includes <>, generated at <1414919438040>.
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
        var $_ = __LOCAL__['$_f7ec4']; /* Snakeskin template: logic_index; i */
        this.logic_index = function(i) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.logic_index,
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
            var TPL_NAME = "logic_index",
                PARENT_TPL_NAME;
            switch (i) {
                case 1:
                    {
                        __RESULT__ += '1 ';
                    }
                    break;
                case 2:
                    {
                        __RESULT__ += '2 ';
                    }
                    break;
                default:
                    {
                        __RESULT__ += '3 ';
                    }
            }
            if (i == 1) {
                __RESULT__ += '1 ';
            } else if (i == 2) {
                __RESULT__ += '2 ';
            } else {
                __RESULT__ += '3 ';
            }
            if (!(i == 1)) {
                __RESULT__ += '1 ';
            } else if (i == 2) {
                __RESULT__ += '2 ';
            } else {
                __RESULT__ += '3 ';
            }
            return __RESULT__;
        };
        Snakeskin.cache["logic_index"] = this.logic_index; /* Snakeskin template. */ /* Snakeskin template: logic_base;  */
        this.logic_base = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.logic_base,
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
            var TPL_NAME = "logic_base",
                PARENT_TPL_NAME;
            __RESULT__ += '<span class=""></span> ';
            return __RESULT__;
        };
        Snakeskin.cache["logic_base"] = this.logic_base; /* Snakeskin template. */ /* Snakeskin template: logic_sub;  */
        this.logic_sub = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.logic_sub,
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
            var TPL_NAME = "logic_sub",
                PARENT_TPL_NAME = "logic_base";
            __RESULT__ += '<span class=""></span> ';
            switch (1) {
                case 1:
                    {
                        __RESULT__ += '1 ';
                    }
                    break;
            }
            return __RESULT__;
        };
        Snakeskin.cache["logic_sub"] = this.logic_sub; /* Snakeskin template. */
    }
}).call(this);
