/* Snakeskin v3.4.0, generated at <1404372677801> Thu Jul 03 2014 11:31:17 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() { /* Snakeskin template: data_index;  */
        this.data_index = function() {
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'data_index',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            var a = ' foo ';
            __RESULT__ += ' ';
            __RESULT__ += '{a: \"' + Snakeskin.Filters.html(($_ = Snakeskin.Filters['ucfirst'](($_ = Snakeskin.Filters['trim'](Snakeskin.Filters.undef(a)))))) + '\"}';
            __RESULT__ += ' ';
            __RESULT__ += '{{' + Snakeskin.Filters.html(($_ = Snakeskin.Filters['ucfirst'](($_ = Snakeskin.Filters['trim'](Snakeskin.Filters.undef(a)))))) + '}}';
            __RESULT__ += ' ';
            __RESULT__ += '{= {a: "${a|trim|ucfirst}"}}{{${a|trim|ucfirst}}} ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['data_index'] = this.data_index;
        } /* Snakeskin template. */ /* Snakeskin template: data_attr;  */
        this.data_attr = function() {
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'data_attr',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            var foo = 'foo';
            __RESULT__ += ' ';
            var bar = 'bar';
            __RESULT__ += ' ';
            if ('bar') {
                __RESULT__ += ' ' + foo + ' = "' + ('bar') + '"';
            }
            if ('bar') {
                __RESULT__ += ' ' + foo + ' = "' + ('bar') + '"';
            }
            __RESULT__ += ' ';
            if (bar) {
                __RESULT__ += ' ' + 'foo' + ' = "' + (bar) + '"';
            }
            if (bar) {
                __RESULT__ += ' ' + 'foo' + ' = "' + (bar) + '"';
            }
            if ('foo') {
                __RESULT__ += ' ' + 'bar' + ' = "' + ('foo') + '"';
            }
            if ('foo') {
                __RESULT__ += ' ' + 'bar' + ' = "' + ('foo') + '"';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['data_attr'] = this.data_attr;
        } /* Snakeskin template. */ /* Snakeskin template: data_decl;  */
        this.data_decl = function() {
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'data_decl',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            var foo = 'bar';
            __RESULT__ += ' ';
            __RESULT__ += '{{foo}}';
            __RESULT__ += ' ';
            __RESULT__ += '{{' + Snakeskin.Filters.html(Snakeskin.Filters.undef(foo)) + '}}';
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['data_decl'] = this.data_decl;
        } /* Snakeskin template. */
    }
}).call(this);