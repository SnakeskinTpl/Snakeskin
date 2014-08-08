/* Snakeskin v4.0.0, label <1404212981664>, generated at <1407503293671> Fri Aug 08 2014 17:08:13 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_1689b'];
        __VARS__.a = String; /* Snakeskin template: filters_index;  */
        this.filters_index = function() {
            var __THIS__ = this,
                callee = __ROOT__.filters_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'filters_index',
                PARENT_TPL_NAME;
            a = ({
                a: String
            });
            __RESULT__.push(' ');
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(($_ = __FILTERS__['remove'].call(this, ($_ = __FILTERS__['repeat'].call(this, ($_ = __FILTERS__['ucfirst'].call(this, ($_ = __FILTERS__['collapse'].call(this, '   foo   bar ')))), 3)), ($_ = __FILTERS__['repeat']($_ = __FILTERS__['trim']('   Foo bar'))))), false));
            __RESULT__.push(' ');
            __RESULT__.push(($_ = __FILTERS__['remove']($_ = __FILTERS__['repeat']($_ = __FILTERS__['ucfirst']($_ = __FILTERS__['collapse']('   foo   bar ')), 3), ($_ = __FILTERS__['repeat']($_ = __FILTERS__['trim'](a.a('   Foo bar')))))) + '<b>1</b>');
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(($_ = __FILTERS__['remove']($_ = __FILTERS__['repeat']($_ = __FILTERS__['ucfirst']($_ = __FILTERS__['collapse']('   foo   bar ')), 3), ($_ = __FILTERS__['repeat']($_ = __FILTERS__['trim'](__VARS__.a('   Foo bar')))))) + '<b>1</b>', false));
            __RESULT__.push(' ');
            __RESULT__.push(' ');
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache['filters_index'] = this.filters_index; /* Snakeskin template. */
    }
}).call(this);