/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,false,,stringConcat,true,true,true,,true,true,i18n>, label <1413886610355>, includes <>, generated at <1414826996829>.
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
        var $_ = __LOCAL__['$_394be'];
        __VARS__['mod_global'] = 1;
        __VARS__.MG = 2; /* Snakeskin template: mod_index;  */
        this.mod_index = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.mod_index,
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
            var TPL_NAME = "mod_index",
                PARENT_TPL_NAME;
            b = ({
                c: {
                    e: 1,
                    22: 3
                },
                1: 2
            });
            __VARS__['mod_global'] = 10;
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__VARS__['mod_global']), false, false);
            __VARS__['M' + 'G'] = 4;
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__VARS__['M' + 'G']), false, false);
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(b[b.c.e]), false, false);
            var __tmp__with_236 = void 0;
            b.c[2 == 2 && (__tmp__with_236 = ($_ = __FILTERS__['repeat'](1 + 1)))] = 5;
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__tmp__with_236), false, false);
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(b.c[($_ = __FILTERS__['repeat'](1 + 1))]), false, false);
            var b;
            return __RESULT__;
        };
        Snakeskin.cache["mod_index"] = this.mod_index; /* Snakeskin template. */
    }
}).call(this);
