/* Snakeskin v3.4.0, generated at <1404300112722> Wed Jul 02 2014 15:21:52 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
            Snakeskin.Vars.name = 'foo';
        } /* Snakeskin template: scope_index; obj */
        this.scope_index = function(obj) {
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'scope_index',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            var name = 'bar';
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(obj.child.name));
            var __e__with_112 = 'test';
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(name) + ' ' + Snakeskin.Filters.undef(name) + ' ' + Snakeskin.Filters.undef(obj.child.name) + ' ' + Snakeskin.Filters.undef(obj.child.name) + ' ' + Snakeskin.Filters.undef(name) + ' ' + Snakeskin.Filters.undef(Snakeskin.Vars.name) + ' ' + Snakeskin.Filters.undef(obj.child.child.name) + ' ' + Snakeskin.Filters.undef(__e__with_112));
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