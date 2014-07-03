/* Snakeskin v3.4.0, generated at <1404375954798> Thu Jul 03 2014 12:25:54 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() { /* Snakeskin template: inherit_base; val  val2  */
        this.inherit_base = function(val, val2) {
            val = val != null ? val : 1;
            val2 = val2 != null ? val2 : 3;
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_base',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(val2));
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(val));
            __RESULT__ += ' ';
            var ____I_PROTO___bar_template_45 = 1;
            ____I_PROTO___bar_template_45: while (____I_PROTO___bar_template_45--) {}
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['inherit_base'] = this.inherit_base;
        } /* Snakeskin template. */ /* Snakeskin template: inherit_sub; val  */
        this.inherit_sub = function(val) {
            val = val != null ? val : 2;
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_sub',
                PARENT_TPL_NAME = 'inherit_base';
            var val2 = 3;
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(val2));
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(val));
            __RESULT__ += ' ';
            var __i__proto_314 = void 0 != null ? void 0 : 11;
            var ____I_PROTO___bar_template_44 = 1;
            ____I_PROTO___bar_template_44: while (____I_PROTO___bar_template_44--) {
                __RESULT__ += ' ';
                __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(__i__proto_314));
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += 'my';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['inherit_sub'] = this.inherit_sub;
        } /* Snakeskin template. */ /* Snakeskin template: inherit_superTestConst;  */
        this.inherit_superTestConst = function() {
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_superTestConst',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            var ____I_PROTO___a_template_55 = 1;
            ____I_PROTO___a_template_55: while (____I_PROTO___a_template_55--) {
                __RESULT__ += ' ';
                var foo = 1;
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['inherit_superTestConst'] = this.inherit_superTestConst;
        } /* Snakeskin template. */ /* Snakeskin template: inherit_childTestConst;  */
        this.inherit_childTestConst = function() {
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_childTestConst',
                PARENT_TPL_NAME = 'inherit_superTestConst';
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            var ____I_PROTO___a_template_55 = 1;
            ____I_PROTO___a_template_55: while (____I_PROTO___a_template_55--) {
                __RESULT__ += ' ';
                var foo = 2;
                __RESULT__ += ' ';
                __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(foo));
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['inherit_childTestConst'] = this.inherit_childTestConst;
        } /* Snakeskin template. */ /* Snakeskin template: inherit_superTestConst2;  */
        this.inherit_superTestConst2 = function() {
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_superTestConst2',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            var ____I_PROTO___a_template_56 = 1;
            ____I_PROTO___a_template_56: while (____I_PROTO___a_template_56--) {
                __RESULT__ += ' ';
                var a = 1;
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['inherit_superTestConst2'] = this.inherit_superTestConst2;
        } /* Snakeskin template. */ /* Snakeskin template: inherit_childTestConst2;  */
        this.inherit_childTestConst2 = function() {
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_childTestConst2',
                PARENT_TPL_NAME = 'inherit_superTestConst2';
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            var ____I_PROTO___a_template_56 = 1;
            ____I_PROTO___a_template_56: while (____I_PROTO___a_template_56--) {
                __RESULT__ += ' ';
                var a = 2;
                __RESULT__ += ' ';
                __RESULT__ += ' ';
                var ____I_PROTO___e_template_56 = 1;
                ____I_PROTO___e_template_56: while (____I_PROTO___e_template_56--) {
                    __RESULT__ += ' ';
                    var j = 1;
                    __RESULT__ += ' ';
                    __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(j));
                    __RESULT__ += ' ';
                }
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['inherit_childTestConst2'] = this.inherit_childTestConst2;
        } /* Snakeskin template. */ /* Snakeskin template: inherit_superTestConst3;  */
        this.inherit_superTestConst3 = function() {
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_superTestConst3',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            var a = {};
            __RESULT__ += ' ';
            a.a = 1;
            __RESULT__ += ' ';
            a['b'] = 2;
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(a.a));
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(a.b));
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['inherit_superTestConst3'] = this.inherit_superTestConst3;
        } /* Snakeskin template. */ /* Snakeskin template: inherit_childTestConst3;  */
        this.inherit_childTestConst3 = function() {
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_childTestConst3',
                PARENT_TPL_NAME = 'inherit_superTestConst3';
            __RESULT__ += ' ';
            var a = {};
            __RESULT__ += ' ';
            a.a = 2;
            __RESULT__ += ' ';
            a.b = 3;
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(a.a));
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(a.b));
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['inherit_childTestConst3'] = this.inherit_childTestConst3;
        } /* Snakeskin template. */
    }
}).call(this);