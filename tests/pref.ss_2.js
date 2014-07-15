/* Snakeskin v4.0.0, generated at <1405420931628> Tue Jul 15 2014 14:42:11 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = Snakeskin || obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() {
        var $C = this.$C != null ? this.$C : Snakeskin.Vars.$C,
            async = this.async != null ? this.async : Snakeskin.Vars.async;
        var __$C__ = $C,
            __async__ = async;
        var __FILTERS__ = Snakeskin.Filters,
            __VARS__ = Snakeskin.Vars,
            __LOCAL__ = Snakeskin.LocalVars,
            __STR__, __J__;
        var $_;
        Snakeskin.Vars.pref_global = 1;
        Snakeskin.Vars.pref_global2 = 2; /* Snakeskin template: pref_index;  */
        this.pref_index = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'pref_index',
                PARENT_TPL_NAME;
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
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
        Snakeskin.cache['pref_index'] = this.pref_index; /* Snakeskin template. */
    }
}).call(this);