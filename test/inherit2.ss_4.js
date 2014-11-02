/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,true,,stringBuffer,true,true,true,,true,true,i18n>, label <1413886610348>, includes <>, generated at <1414919439302>.
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
        var $_ = __LOCAL__['$_77028']; /* Snakeskin template: inherit2_base;  */
        this.inherit2_base = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.inherit2_base,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__.join('');
                if (opt_clear) {
                    __RESULT__ = new Snakeskin.StringBuffer();
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = new Snakeskin.StringBuffer();
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "inherit2_base",
                PARENT_TPL_NAME;
            a1 = 1;
            var a1;
            var a;
            var b;
            return __RESULT__.join('');
        };
        Snakeskin.cache["inherit2_base"] = this.inherit2_base; /* Snakeskin template. */ /* Snakeskin template: inherit2_sub;  */
        this.inherit2_sub = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.inherit2_sub,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__.join('');
                if (opt_clear) {
                    __RESULT__ = new Snakeskin.StringBuffer();
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = new Snakeskin.StringBuffer();
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "inherit2_sub",
                PARENT_TPL_NAME = "inherit2_base";
            a1 = 22;
            b33 = 34;
            b13 = 2;
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(a1), false, false));
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(b33), false, false));
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(b13), false, false));
            __RESULT__.push(' ');
            try {
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(a), false, false));
                __RESULT__.push(' ');
            } catch (__err__try_326) {
                __RESULT__.push('% ');
            }
            try {
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(b), false, false));
                __RESULT__.push(' ');
            } catch (__err__try_377) {
                __RESULT__.push('% ');
            }
            var a1;
            var b33;
            var b13;
            var a;
            var b;
            return __RESULT__.join('');
        };
        Snakeskin.cache["inherit2_sub"] = this.inherit2_sub; /* Snakeskin template. */ /* Snakeskin template: inherit2_base2; val  */
        this.inherit2_base2 = function(val) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.inherit2_base2,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__.join('');
                if (opt_clear) {
                    __RESULT__ = new Snakeskin.StringBuffer();
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = new Snakeskin.StringBuffer();
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "inherit2_base2",
                PARENT_TPL_NAME;
            val = arguments[0] = val != null ? val : 1;
            a1 = 1;
            var a1;
            var a;
            var b;
            return __RESULT__.join('');
        };
        Snakeskin.cache["inherit2_base2"] = this.inherit2_base2; /* Snakeskin template. */ /* Snakeskin template: inherit2_sub2;  */
        this.inherit2_sub2 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.inherit2_sub2,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__.join('');
                if (opt_clear) {
                    __RESULT__ = new Snakeskin.StringBuffer();
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = new Snakeskin.StringBuffer();
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "inherit2_sub2",
                PARENT_TPL_NAME = "inherit2_base2";
            var val = 1;
            a1 = 22;
            b33 = 34;
            b13 = 2;
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(a1), false, false));
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(b33), false, false));
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(b13), false, false));
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(val), false, false));
            __RESULT__.push(' ');
            try {
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(a), false, false));
                __RESULT__.push(' ');
            } catch (__err__try_759) {
                __RESULT__.push('% ');
            }
            try {
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(b), false, false));
                __RESULT__.push(' ');
            } catch (__err__try_807) {
                __RESULT__.push('% ');
            }
            var a1;
            var b33;
            var b13;
            var a;
            var b;
            return __RESULT__.join('');
        };
        Snakeskin.cache["inherit2_sub2"] = this.inherit2_sub2; /* Snakeskin template. */
    }
}).call(this);
