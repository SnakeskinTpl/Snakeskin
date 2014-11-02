/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,true,,stringConcat,true,true,true,,true,true,i18n>, label <1413886610452>, includes <>, generated at <1414919438318>.
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
        var $_ = __LOCAL__['$_67950']; /* Snakeskin template: try_index;  */
        this.try_index = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.try_index,
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
            var TPL_NAME = "try_index",
                PARENT_TPL_NAME;
            try {
                foo();
            } catch (ignore) {}
            try {
                foo();
            } catch (__err__try_100) {
                __RESULT__ += 'bar';
            } finally {
                __RESULT__ += '2';
            }
            try {
                foo();
            } catch (__err__try_174) {
                __RESULT__ += 'bar';
            }
            try {
                2;
            } finally {
                __RESULT__ += '1';
            }
            return __RESULT__;
        };
        Snakeskin.cache["try_index"] = this.try_index; /* Snakeskin template. */
    }
}).call(this);
