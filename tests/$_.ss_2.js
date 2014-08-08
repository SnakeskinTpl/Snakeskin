/* Snakeskin v4.0.0, label <1405575685051>, generated at <1407485984320> Fri Aug 08 2014 12:19:44 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_b5850'];
        ($_ = __LOCAL__['$_b5850'] = __FILTERS__['trim'].call(this, ' bar '));
        __LOCAL__.tmp_0_b5850 = $_; /* Snakeskin template: $__index;  */
        this.$__index = function() {
            var __THIS__ = this,
                callee = __ROOT__.$__index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = '$__index',
                PARENT_TPL_NAME;
            ($_ = __FILTERS__['trim'].call(this, ' foo '));
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef($_), false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__LOCAL__.tmp_0_b5850), false);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['$__index'] = this.$__index; /* Snakeskin template. */
    }
}).call(this);