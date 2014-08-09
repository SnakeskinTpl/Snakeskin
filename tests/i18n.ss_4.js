/* Snakeskin v4.0.0, label <1405574307398>, generated at <1407579288047> Sat Aug 09 2014 14:14:48 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_0436c']; /* Snakeskin template: i18n_index;  */
        this.i18n_index = function() {
            var __THIS__ = this,
                callee = __ROOT__.i18n_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'i18n_index',
                PARENT_TPL_NAME;
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(i18n("hel`lo")), false));
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(i18n("world")), false));
            __RESULT__.push(' `bar ');
            return __RESULT__.join('');
        };
        Snakeskin.cache['i18n_index'] = this.i18n_index; /* Snakeskin template. */ /* Snakeskin template: i18n_index2;  */
        this.i18n_index2 = function() {
            var __THIS__ = this,
                callee = __ROOT__.i18n_index2;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'i18n_index2',
                PARENT_TPL_NAME;
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(i18n("hel`lo")), false));
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(i18n("world")), false));
            __RESULT__.push(' `bar ');
            return __RESULT__.join('');
        };
        Snakeskin.cache['i18n_index2'] = this.i18n_index2; /* Snakeskin template. */
    }
}).call(this);