/* Snakeskin v3.4.0, generated at <1404916624600> Wed Jul 09 2014 18:37:04 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
            Snakeskin.Vars.__INCLUDE__ = {};
        } /* Snakeskin template: data_index;  */
        this.data_index = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'data_index',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            var a = ' foo ';
            __RESULT__ += ' ';
            __RESULT__ += '{a: \"' + __FILTERS__.html(($_ = __FILTERS__['ucfirst'](($_ = __FILTERS__['trim'](__FILTERS__.undef(a)))))) + '\"}';
            __RESULT__ += ' ';
            __RESULT__ += '{{' + __FILTERS__.html(($_ = __FILTERS__['ucfirst'](($_ = __FILTERS__['trim'](__FILTERS__.undef(a)))))) + '}}';
            __RESULT__ += ' ';
            __RESULT__ += '{= {a: "${a|trim|ucfirst}"}}{{${a|trim|ucfirst}}} ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['data_index'] = this.data_index;
        } /* Snakeskin template. */ /* Snakeskin template: data_decl;  */
        this.data_decl = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'data_decl',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            var foo = 'bar';
            __RESULT__ += ' ';
            __RESULT__ += '{{foo}}';
            __RESULT__ += ' ';
            __RESULT__ += '{{' + __FILTERS__.html(__FILTERS__.undef(foo)) + '}}';
            __RESULT__ += ' ';
            __RESULT__ += '{{' + __FILTERS__.html(__FILTERS__.undef(foo)) + '}}';
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['data_decl'] = this.data_decl;
        } /* Snakeskin template. */
    }
}).call(this);