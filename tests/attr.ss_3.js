/* Snakeskin v3.4.0, generated at <1404916624567> Wed Jul 09 2014 18:37:04 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        } /* Snakeskin template: data_attr;  */
        this.data_attr = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'data_attr',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            var foo = 'foo';
            __RESULT__ += ' ';
            var bar = 'bar';
            __RESULT__ += ' ';
            __STR__ = '';
            if ('bar') {
                __STR__ += ' ' + 'bar';
            }
            if (__STR__) {
                __RESULT__ += ' ' + foo + ' = "' + __STR__ + '"';
            }
            __RESULT__ += ' ';
            __STR__ = '';
            if (bar) {
                __STR__ += ' ' + bar;
            }
            if (foo) {
                __STR__ += ' ' + foo;
            }
            if (__STR__) {
                __RESULT__ += ' ' + 'foo' + ' = "' + __STR__ + '"';
            }
            __STR__ = '';
            if ('foo') {
                __STR__ += ' ' + 'foo';
            }
            if (__STR__) {
                __RESULT__ += ' ' + 'bar' + ' = "' + __STR__ + '"';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['data_attr'] = this.data_attr;
        } /* Snakeskin template. */ /* Snakeskin template: data_attr2;  */
        this.data_attr2 = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'data_attr2',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            var foo = 'foo';
            __RESULT__ += ' ';
            var bar = 'bar';
            __RESULT__ += ' ';
            __STR__ = '';
            if (bar) {
                __STR__ += ' ' + bar;
            }
            if (foo) {
                __STR__ += ' ' + foo;
            }
            if (__STR__) {
                __RESULT__ += ' ' + 'ng-' + 'foo' + ' = "' + __STR__ + '"';
            }
            __STR__ = '';
            if ('foo') {
                __STR__ += ' ' + 'foo';
            }
            if (__STR__) {
                __RESULT__ += ' ' + 'ng-' + 'bar' + ' = "' + __STR__ + '"';
            }
            __STR__ = '';
            if ('bar') {
                __STR__ += ' ' + 'bar';
            }
            if (__STR__) {
                __RESULT__ += ' ' + foo + ' = "' + __STR__ + '"';
            }
            __RESULT__ += ' ';
            __STR__ = '';
            if ((1 ? bar : null)) {
                __STR__ += ' ' + (1 ? bar : null);
            }
            if (((foo))) {
                __STR__ += ' ' + ((foo));
            }
            if (__STR__) {
                __RESULT__ += ' ' + 'ng-' + 'foo' + ' = "' + __STR__ + '"';
            }
            __STR__ = '';
            if ('foo') {
                __STR__ += ' ' + 'foo';
            }
            if (__STR__) {
                __RESULT__ += ' ' + 'ng-' + 'bar' + ' = "' + __STR__ + '"';
            }
            __STR__ = '';
            if ('bar') {
                __STR__ += ' ' + 'bar';
            }
            if (__STR__) {
                __RESULT__ += ' ' + 'foo:' + foo + ' = "' + __STR__ + '"';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['data_attr2'] = this.data_attr2;
        } /* Snakeskin template. */
    }
}).call(this);