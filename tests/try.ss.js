/* Snakeskin v3.4.0, generated at <1404885838165> Wed Jul 09 2014 10:03:58 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() { /* Snakeskin template: try_index;  */
        this.try_index = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'try_index',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
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
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['try_index'] = this.try_index;
        } /* Snakeskin template. */
    }
}).call(this);