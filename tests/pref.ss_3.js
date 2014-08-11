/* Snakeskin v4.0.0, label <1407660751658>, generated at <1407744454992> Mon Aug 11 2014 12:07:34 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_12634'];
        __VARS__.pref_global = 1;
        __VARS__.pref_global2 = 2; /* Snakeskin template: pref_index;  */
        this.pref_index = function() {
            var __THIS__ = this,
                callee = __ROOT__.pref_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'pref_index',
                PARENT_TPL_NAME;
            if (1) {
                __RESULT__.push('{if 2} ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__VARS__.pref_global), false));
                __RESULT__.push(' {pref_global2} {/} ');
            }
            __RESULT__.push(' ');
            if (1) {
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__VARS__.pref_global), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__VARS__.pref_global2), false));
                __RESULT__.push(' #');
            }
            __RESULT__.push(' ');
            return __RESULT__.join('');
        };
        Snakeskin.cache['pref_index'] = this.pref_index; /* Snakeskin template. */
    }
}).call(this);