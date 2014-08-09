/* Snakeskin v4.0.0, label <1404298266902>, generated at <1407583070328> Sat Aug 09 2014 15:17:50 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var __FILTERS__ = Snakeskin.Filters,
            __VARS__ = Snakeskin.Vars,
            __LOCAL__ = Snakeskin.LocalVars,
            __STR__, __TMP__, __J__;
        var $_ = __LOCAL__['$_bace6']; /* Snakeskin template: cycles_index; i  */
        this.cycles_index = function(i) {
            var __THIS__ = this,
                callee = __ROOT__.cycles_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'cycles_index',
                PARENT_TPL_NAME;
            i = arguments[0] = i != null ? i : 0;
            for (var __j__for_67 = 0;
                (__j__for_67 < 3);
                (__j__for_67++)) {
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__j__for_67), false);
            }
            __RESULT__ += ' ';
            while (i++ < 3) {
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(i), false);
            }
            __RESULT__ += ' ';
            do {
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(i), false);
            } while (i--);
            __RESULT__ += ' ';
            do {
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(i), false);
            } while (++i < 3);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['cycles_index'] = this.cycles_index; /* Snakeskin template. */ /* Snakeskin template: cycles_index2; i  */
        this.cycles_index2 = function(i) {
            var __THIS__ = this,
                callee = __ROOT__.cycles_index2;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'cycles_index2',
                PARENT_TPL_NAME;
            i = arguments[0] = i != null ? i : 0;
            for (var __j__for_334 = 0;
                (__j__for_334 < 3);
                (__j__for_334++)) {
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__j__for_334), false);
                break;
            }
            __RESULT__ += ' ';
            while (i++ < 3) {
                if (i === 1) {
                    continue;
                }
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(i), false);
            }
            __RESULT__ += ' ';
            do {
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(i), false);
                break;
            } while (i--);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['cycles_index2'] = this.cycles_index2; /* Snakeskin template. */
    }
}).call(this);