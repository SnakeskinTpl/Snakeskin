/* Snakeskin v3.4.0, generated at <1404888384094> Wed Jul 09 2014 10:46:24 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() {
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.Vars.a = String;
        } /* Snakeskin template: filters_index;  */
        this.filters_index = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'filters_index',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            var a = {
                a: String
            };
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(($_ = __FILTERS__['remove'](($_ = __FILTERS__['repeat'](($_ = __FILTERS__['ucfirst'](($_ = __FILTERS__['collapse']('   foo   bar ')))), 3)), ($_ = __FILTERS__['repeat']($_ = __FILTERS__['trim']('   Foo bar'))))));
            __RESULT__ += ' ';
            __RESULT__ += ($_ = __FILTERS__['remove']($_ = __FILTERS__['repeat']($_ = __FILTERS__['ucfirst']($_ = __FILTERS__['collapse']('   foo   bar ')), 3), ($_ = __FILTERS__['repeat']($_ = __FILTERS__['trim'](a.a('   Foo bar')))))) + '<b>1</b>';
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(($_ = __FILTERS__['remove']($_ = __FILTERS__['repeat']($_ = __FILTERS__['ucfirst']($_ = __FILTERS__['collapse']('   foo   bar ')), 3), ($_ = __FILTERS__['repeat']($_ = __FILTERS__['trim'](__VARS__.a('   Foo bar')))))) + '<b>1</b>');
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['filters_index'] = this.filters_index;
        } /* Snakeskin template. */
    }
}).call(this);