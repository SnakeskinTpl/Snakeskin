/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,false,,stringBuffer,true,true,true,,true,true,i18n>, label <1413886610347>, includes <>, generated at <1414827000610>.
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
        var $_ = __LOCAL__['$_01d9a']; /* Snakeskin template: inherit_base; val val2  */
        this.inherit_base = function(val, val2) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.inherit_base,
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
            var TPL_NAME = "inherit_base",
                PARENT_TPL_NAME;
            val = arguments[0] = val != null ? val : 1;
            val2 = arguments[1] = val2 != null ? val2 : 3;
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(val2), false, false));
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(val), false, false));
            __RESULT__.push(' ');
            var __arguments__proto_97 = [];
            __arguments__proto_97.callee = __CALLEE__;
            var ____I_PROTO___bar_template_45 = 1;
            ____I_PROTO___bar_template_45: while (____I_PROTO___bar_template_45--) {}
            __RESULT__.push(' ');
            return __RESULT__.join('');
        };
        Snakeskin.cache["inherit_base"] = this.inherit_base; /* Snakeskin template. */ /* Snakeskin template: inherit_sub; val  */
        this.inherit_sub = function(val) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.inherit_sub,
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
            var TPL_NAME = "inherit_sub",
                PARENT_TPL_NAME = "inherit_base";
            var val2 = 3;
            val = arguments[0] = val != null ? val : 2;
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(val2), false, false));
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(val), false, false));
            __RESULT__.push(' ');
            var __i__proto_350 = void 0 != null ? void 0 : 11;
            var __arguments__proto_350 = [__i__proto_350];
            __arguments__proto_350.callee = __CALLEE__;
            var ____I_PROTO___bar_template_44 = 1;
            ____I_PROTO___bar_template_44: while (____I_PROTO___bar_template_44--) {
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__i__proto_350), false, false));
                __RESULT__.push(' ');
            }
            __RESULT__.push(' ');
            __RESULT__.push('my');
            return __RESULT__.join('');
        };
        Snakeskin.cache["inherit_sub"] = this.inherit_sub; /* Snakeskin template. */ /* Snakeskin template: inherit_superTestConst;  */
        this.inherit_superTestConst = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.inherit_superTestConst,
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
            var TPL_NAME = "inherit_superTestConst",
                PARENT_TPL_NAME;
            var __arguments__proto_541 = [];
            __arguments__proto_541.callee = __CALLEE__;
            var ____I_PROTO___a_template_55 = 1;
            ____I_PROTO___a_template_55: while (____I_PROTO___a_template_55--) {
                foo = 1;
            }
            __RESULT__.push(' ');
            var foo;
            return __RESULT__.join('');
        };
        Snakeskin.cache["inherit_superTestConst"] = this.inherit_superTestConst; /* Snakeskin template. */ /* Snakeskin template: inherit_childTestConst;  */
        this.inherit_childTestConst = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.inherit_childTestConst,
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
            var TPL_NAME = "inherit_childTestConst",
                PARENT_TPL_NAME = "inherit_superTestConst";
            var __arguments__proto_659 = [];
            __arguments__proto_659.callee = __CALLEE__;
            var ____I_PROTO___a_template_55 = 1;
            ____I_PROTO___a_template_55: while (____I_PROTO___a_template_55--) {
                foo = 2;
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(foo), false, false));
                __RESULT__.push(' ');
            }
            __RESULT__.push(' ');
            var foo;
            return __RESULT__.join('');
        };
        Snakeskin.cache["inherit_childTestConst"] = this.inherit_childTestConst; /* Snakeskin template. */ /* Snakeskin template: inherit_superTestConst2;  */
        this.inherit_superTestConst2 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.inherit_superTestConst2,
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
            var TPL_NAME = "inherit_superTestConst2",
                PARENT_TPL_NAME;
            var __arguments__proto_756 = [];
            __arguments__proto_756.callee = __CALLEE__;
            var ____I_PROTO___a_template_56 = 1;
            ____I_PROTO___a_template_56: while (____I_PROTO___a_template_56--) {
                a = 1;
            }
            __RESULT__.push(' ');
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache["inherit_superTestConst2"] = this.inherit_superTestConst2; /* Snakeskin template. */ /* Snakeskin template: inherit_childTestConst2;  */
        this.inherit_childTestConst2 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.inherit_childTestConst2,
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
            var TPL_NAME = "inherit_childTestConst2",
                PARENT_TPL_NAME = "inherit_superTestConst2";
            var __arguments__proto_874 = [];
            __arguments__proto_874.callee = __CALLEE__;
            var ____I_PROTO___a_template_56 = 1;
            ____I_PROTO___a_template_56: while (____I_PROTO___a_template_56--) {
                a = 2;
                var __arguments__proto_898 = [];
                __arguments__proto_898.callee = __CALLEE__;
                var ____I_PROTO___e_template_56 = 1;
                ____I_PROTO___e_template_56: while (____I_PROTO___e_template_56--) {
                    j = 1;
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(j), false, false));
                    __RESULT__.push(' ');
                }
                __RESULT__.push(' ');
            }
            __RESULT__.push(' ');
            var j;
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache["inherit_childTestConst2"] = this.inherit_childTestConst2; /* Snakeskin template. */ /* Snakeskin template: inherit_superTestConst3;  */
        this.inherit_superTestConst3 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.inherit_superTestConst3,
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
            var TPL_NAME = "inherit_superTestConst3",
                PARENT_TPL_NAME;
            a = ({});
            a.a = 1;
            a['b'] = 2;
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(a.a), false, false));
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(a.b), false, false));
            __RESULT__.push(' ');
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache["inherit_superTestConst3"] = this.inherit_superTestConst3; /* Snakeskin template. */ /* Snakeskin template: inherit_childTestConst3;  */
        this.inherit_childTestConst3 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.inherit_childTestConst3,
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
            var TPL_NAME = "inherit_childTestConst3",
                PARENT_TPL_NAME = "inherit_superTestConst3";
            a = ({});
            a.a = 2;
            a.b = 3;
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(a.a), false, false));
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(a.b), false, false));
            __RESULT__.push(' ');
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache["inherit_childTestConst3"] = this.inherit_childTestConst3; /* Snakeskin template. */
    }
}).call(this);
