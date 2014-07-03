/* Snakeskin v3.4.0, generated at <1404372677920> Thu Jul 03 2014 11:31:17 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
            Snakeskin.Vars['mod_global'] = 1;
        }
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.Vars.MG = 2;
        } /* Snakeskin template: mod_index;  */
        this.mod_index = function() {
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'mod_index',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            var b = {
                c: {
                    e: 1,
                    22: 3
                },
                1: 2
            };
            Snakeskin.Vars['mod_global'] = 10;
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(Snakeskin.Vars['mod_global']));
            Snakeskin.Vars['M' + 'G'] = 4;
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(Snakeskin.Vars['M' + 'G']));
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(b[b.c.e]));
            var __tmp__with_236 = void 0;
            b.c[2 == 2 && (__tmp__with_236 = ($_ = Snakeskin.Filters['repeat'](1 + 1)))] = 5;
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(__tmp__with_236));
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(b.c[($_ = Snakeskin.Filters['repeat'](1 + 1))]));
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['mod_index'] = this.mod_index;
        } /* Snakeskin template. */
    }
}).call(this);