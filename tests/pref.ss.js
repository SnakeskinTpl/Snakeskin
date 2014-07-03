/* Snakeskin v3.4.0, generated at <1404375954892> Thu Jul 03 2014 12:25:54 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() {
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.Vars.pref_global = 1;
        }
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.Vars.pref_global2 = 2;
        } /* Snakeskin template: pref_index;  */
        this.pref_index = function() {
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'pref_index',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            if (1) {
                __RESULT__ += '{if 2} ';
                __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(Snakeskin.Vars.pref_global));
                __RESULT__ += ' {pref_global2} {/} ';
            }
            __RESULT__ += ' ';
            if (1) {
                __RESULT__ += ' ';
                __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(Snakeskin.Vars.pref_global));
                __RESULT__ += ' ';
                __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(Snakeskin.Vars.pref_global2));
                __RESULT__ += ' #';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['pref_index'] = this.pref_index;
        } /* Snakeskin template. */
    }
}).call(this);