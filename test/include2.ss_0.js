/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,false,,stringConcat,true,true,true,,true,true,i18n>, label <1414065390140>, includes <[["c:\\\\Users\\\\kobez_000\\\\Documents\\\\Dev\\\\snakeskin\\\\tests\\\\test2\\\\base.ss",1414064863856]]>, generated at <1414826996398>.
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
        var $_ = __LOCAL__['$_95e62']; /* Snakeskin template: include2_base;  */
        this.include2_base = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.include2_base,
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
            var TPL_NAME = "include2_base",
                PARENT_TPL_NAME;
            __RESULT__ += '123';
            return __RESULT__;
        };
        Snakeskin.cache["include2_base"] = this.include2_base; /* Snakeskin template. */ /* Snakeskin template: include2_index;  */
        this.include2_index = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.include2_index,
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
            var TPL_NAME = "include2_index",
                PARENT_TPL_NAME = "include2_base";
            __RESULT__ += '123';
            return __RESULT__;
        };
        Snakeskin.cache["include2_index"] = this.include2_index; /* Snakeskin template. */
    }
}).call(this);
