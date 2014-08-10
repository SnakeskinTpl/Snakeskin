/* Snakeskin v4.0.0, label <1407660751625>, generated at <1407667214603> Sun Aug 10 2014 14:40:14 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_ce50d'];
        __VARS__['mod_global'] = 1;
        __VARS__.MG = 2; /* Snakeskin template: mod_index;  */
        this.mod_index = function() {
            var __THIS__ = this,
                callee = __ROOT__.mod_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'mod_index',
                PARENT_TPL_NAME;
            b = ({
                c: {
                    e: 1,
                    22: 3
                },
                1: 2
            });
            __VARS__['mod_global'] = 10;
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__VARS__['mod_global']), false));
            __VARS__['M' + 'G'] = 4;
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__VARS__['M' + 'G']), false));
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(b[b.c.e]), false));
            var __tmp__with_236 = void 0;
            b.c[2 == 2 && (__tmp__with_236 = ($_ = __FILTERS__['repeat'](1 + 1)))] = 5;
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__tmp__with_236), false));
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(b.c[($_ = __FILTERS__['repeat'](1 + 1))]), false));
            var b;
            return __RESULT__.join('');
        };
        Snakeskin.cache['mod_index'] = this.mod_index; /* Snakeskin template. */
    }
}).call(this);