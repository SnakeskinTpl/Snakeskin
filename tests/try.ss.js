/* Snakeskin v3.4.0, generated at <1404375954954> Thu Jul 03 2014 12:25:54 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'try_index',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            try {
                foo();
            } catch (__err__catch_68) {
                __RESULT__ += 'bar';
            } finally {
                __RESULT__ += '2';
            }
            try {
                foo();
            } catch (__err__catch_142) {
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