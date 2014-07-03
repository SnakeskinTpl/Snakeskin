/* Snakeskin v3.4.0, generated at <1404372677996> Thu Jul 03 2014 11:31:17 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() { /* Snakeskin template: super_base;  */
        this.super_base = function() {
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'super_base',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            var a = 1;
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(a));
            var ____I_PROTO___bar_template_43 = 1;
            ____I_PROTO___bar_template_43: while (____I_PROTO___bar_template_43--) {
                __RESULT__ += '2';
            }
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['super_base'] = this.super_base;
        } /* Snakeskin template. */ /* Snakeskin template: super_child;  */
        this.super_child = function() {
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'super_child',
                PARENT_TPL_NAME = 'super_base';
            var a = 2;
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(a));
            var ____I_PROTO___bar_template_44 = 1;
            ____I_PROTO___bar_template_44: while (____I_PROTO___bar_template_44--) {
                __RESULT__ += '21';
            }
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['super_child'] = this.super_child;
        } /* Snakeskin template. */
    }
}).call(this);