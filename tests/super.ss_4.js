/* Snakeskin v4.0.0, label <1407660751828>, generated at <1407744455578> Mon Aug 11 2014 12:07:35 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_50e03']; /* Snakeskin template: super_base;  */
        this.super_base = function() {
            var __THIS__ = this,
                callee = __ROOT__.super_base;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'super_base',
                PARENT_TPL_NAME;
            a = 1;
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(a), false));
            var ____I_PROTO___bar_template_45 = 1;
            ____I_PROTO___bar_template_45: while (____I_PROTO___bar_template_45--) {
                __RESULT__.push('2');
            }
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache['super_base'] = this.super_base; /* Snakeskin template. */ /* Snakeskin template: super_child;  */
        this.super_child = function() {
            var __THIS__ = this,
                callee = __ROOT__.super_child;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'super_child',
                PARENT_TPL_NAME = 'super_base';
            a = 2;
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(a), false));
            var ____I_PROTO___bar_template_44 = 1;
            ____I_PROTO___bar_template_44: while (____I_PROTO___bar_template_44--) {
                __RESULT__.push('2');
                __RESULT__.push('1');
            }
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache['super_child'] = this.super_child; /* Snakeskin template. */
    }
}).call(this);