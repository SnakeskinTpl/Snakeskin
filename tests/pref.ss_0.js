/* Snakeskin v3.4.0, generated at <1404888384237> Wed Jul 09 2014 10:46:24 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'pref_index',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            if (1) {
                __RESULT__ += '{if 2} ';
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__VARS__.pref_global));
                __RESULT__ += ' {pref_global2} {/} ';
            }
            __RESULT__ += ' ';
            if (1) {
                __RESULT__ += ' ';
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__VARS__.pref_global));
                __RESULT__ += ' ';
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__VARS__.pref_global2));
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