/* Snakeskin v3.4.0, generated at <1404372677811> Thu Jul 03 2014 11:31:17 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'filters_index',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            var a = {
                a: String
            };
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(($_ = Snakeskin.Filters['remove'](($_ = Snakeskin.Filters['repeat'](($_ = Snakeskin.Filters['ucfirst'](($_ = Snakeskin.Filters['collapse']('   foo   bar ')))), 3)), ($_ = Snakeskin.Filters['repeat']($_ = Snakeskin.Filters['trim']('   Foo bar'))))));
            __RESULT__ += ' ';
            __RESULT__ += ($_ = Snakeskin.Filters['remove']($_ = Snakeskin.Filters['repeat']($_ = Snakeskin.Filters['ucfirst']($_ = Snakeskin.Filters['collapse']('   foo   bar ')), 3), ($_ = Snakeskin.Filters['repeat']($_ = Snakeskin.Filters['trim'](a.a('   Foo bar')))))) + '<b>1</b>';
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(($_ = Snakeskin.Filters['remove']($_ = Snakeskin.Filters['repeat']($_ = Snakeskin.Filters['ucfirst']($_ = Snakeskin.Filters['collapse']('   foo   bar ')), 3), ($_ = Snakeskin.Filters['repeat']($_ = Snakeskin.Filters['trim'](Snakeskin.Vars.a('   Foo bar')))))) + '<b>1</b>');
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['filters_index'] = this.filters_index;
        } /* Snakeskin template. */
    }
}).call(this);