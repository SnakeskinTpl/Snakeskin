/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,true,,stringConcat,true,true,true,,true,true,i18n>, label <1413886610344>, includes <>, generated at <1414826998689>.
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
        var $_ = __LOCAL__['$_04c62']; /* Snakeskin template: i18n_index;  */
        this.i18n_index = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.i18n_index,
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
            var TPL_NAME = "i18n_index",
                PARENT_TPL_NAME;
            __RESULT__ += __FILTERS__.undef(i18n("hel`lo"));
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(i18n("world")), false, false);
            __RESULT__ += ' `bar ';
            return __RESULT__;
        };
        Snakeskin.cache["i18n_index"] = this.i18n_index; /* Snakeskin template. */ /* Snakeskin template: i18n_index2;  */
        this.i18n_index2 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.i18n_index2,
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
            var TPL_NAME = "i18n_index2",
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.undef(i18n("hel`lo"));
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(i18n("world")), false, false);
            __RESULT__ += ' `bar ';
            return __RESULT__;
        };
        Snakeskin.cache["i18n_index2"] = this.i18n_index2; /* Snakeskin template. */
    }
}).call(this);
