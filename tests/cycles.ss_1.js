/* Snakeskin v3.4.0, generated at <1404888384065> Wed Jul 09 2014 10:46:24 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() { /* Snakeskin template: cycles_index; i  */
        this.cycles_index = function(i) {
            i = i != null ? i : 0;
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'cycles_index',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            for (var __j__for_67 = 0; __j__for_67 < 3; __j__for_67++) {
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__j__for_67));
            }
            __RESULT__ += ' ';
            while (i++ < 3) {
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(i));
            }
            __RESULT__ += ' ';
            do {
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(i));
            } while (i--);
            __RESULT__ += ' ';
            do {
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(i));
            } while (++i < 3);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['cycles_index'] = this.cycles_index;
        } /* Snakeskin template. */ /* Snakeskin template: cycles_index2; i  */
        this.cycles_index2 = function(i) {
            i = i != null ? i : 0;
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'cycles_index2',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            for (var __j__for_334 = 0; __j__for_334 < 3; __j__for_334++) {
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__j__for_334));
                break;
            }
            __RESULT__ += ' ';
            while (i++ < 3) {
                if (i === 1) {
                    continue;
                }
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(i));
            }
            __RESULT__ += ' ';
            do {
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(i));
                break;
            } while (i--);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['cycles_index2'] = this.cycles_index2;
        } /* Snakeskin template. */
    }
}).call(this);