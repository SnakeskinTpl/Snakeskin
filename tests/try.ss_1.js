/* Snakeskin v4.0.0, label <1404885835685>, generated at <1407581619485> Sat Aug 09 2014 14:53:39 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_6b8ef']; /* Snakeskin template: try_index;  */
        this.try_index = function() {
            var __THIS__ = this,
                callee = __ROOT__.try_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'try_index',
                PARENT_TPL_NAME;
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
        Snakeskin.cache['try_index'] = this.try_index; /* Snakeskin template. */
    }
}).call(this);