/* Snakeskin v3.4.0, generated at <1404916624761> Wed Jul 09 2014 18:37:04 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        }
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.Vars.name = 'foo';
        } /* Snakeskin template: scope_index; obj */
        this.scope_index = function(obj) {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'scope_index',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            var name = 'bar';
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(obj.child.name));
            var __e__with_130 = 'test';
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name) + ' ' + __FILTERS__.undef(name) + ' ' + __FILTERS__.undef(obj.child.name) + ' ' + __FILTERS__.undef(obj.child.name) + ' ' + __FILTERS__.undef(name) + ' ' + __FILTERS__.undef(__VARS__.name) + ' ' + __FILTERS__.undef(obj.child.child.name) + ' ' + __FILTERS__.undef(__e__with_130));
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['scope_index'] = this.scope_index;
        } /* Snakeskin template. */
    }
}).call(this);