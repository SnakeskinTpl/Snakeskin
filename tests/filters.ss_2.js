/* Snakeskin v4.0.0, generated at <1407038467386> Sun Aug 03 2014 08:01:07 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
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
        var $_ = __LOCAL__['$_3bf92'];
        __VARS__.a = String; /* Snakeskin template: filters_index;  */
        this.filters_index = function() {
            var __THIS__ = this,
                callee = __ROOT__.filters_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'filters_index',
                PARENT_TPL_NAME;
            a = ({
                a: String
            });
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(($_ = __FILTERS__['remove'](($_ = __FILTERS__['repeat'](($_ = __FILTERS__['ucfirst'](($_ = __FILTERS__['collapse']('   foo   bar ')))), 3)), ($_ = __FILTERS__['repeat']($_ = __FILTERS__['trim']('   Foo bar'))))));
            __RESULT__ += ' ';
            __RESULT__ += ($_ = __FILTERS__['remove']($_ = __FILTERS__['repeat']($_ = __FILTERS__['ucfirst']($_ = __FILTERS__['collapse']('   foo   bar ')), 3), ($_ = __FILTERS__['repeat']($_ = __FILTERS__['trim'](a.a('   Foo bar')))))) + '<b>1</b>';
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(($_ = __FILTERS__['remove']($_ = __FILTERS__['repeat']($_ = __FILTERS__['ucfirst']($_ = __FILTERS__['collapse']('   foo   bar ')), 3), ($_ = __FILTERS__['repeat']($_ = __FILTERS__['trim'](__VARS__.a('   Foo bar')))))) + '<b>1</b>');
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            var a;
            return __RESULT__;
        };
        Snakeskin.cache['filters_index'] = this.filters_index; /* Snakeskin template. */
    }
}).call(this);