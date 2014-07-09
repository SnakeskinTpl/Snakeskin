/* Snakeskin v3.4.0, generated at <1404916624703> Wed Jul 09 2014 18:37:04 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
            Snakeskin.Vars.__INCLUDE__ = {};
        }
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.Vars['mod_global'] = 1;
        }
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.Vars.MG = 2;
        } /* Snakeskin template: mod_index;  */
        this.mod_index = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'mod_index',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            var b = {
                c: {
                    e: 1,
                    22: 3
                },
                1: 2
            };
            __VARS__['mod_global'] = 10;
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__VARS__['mod_global']));
            __VARS__['M' + 'G'] = 4;
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__VARS__['M' + 'G']));
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(b[b.c.e]));
            var __tmp__with_254 = void 0;
            b.c[2 == 2 && (__tmp__with_254 = ($_ = __FILTERS__['repeat'](1 + 1)))] = 5;
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__tmp__with_254));
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(b.c[($_ = __FILTERS__['repeat'](1 + 1))]));
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['mod_index'] = this.mod_index;
        } /* Snakeskin template. */
    }
}).call(this);