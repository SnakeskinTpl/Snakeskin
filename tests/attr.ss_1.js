/* Snakeskin v4.0.0, generated at <1405516215637> Wed Jul 16 2014 17:10:15 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = Snakeskin || obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() {
        var $C = this.$C != null ? this.$C : Snakeskin.Vars.$C,
            async = this.async != null ? this.async : Snakeskin.Vars.async;
        var __$C__ = $C,
            __async__ = async;
        var __FILTERS__ = Snakeskin.Filters,
            __VARS__ = Snakeskin.Vars,
            __LOCAL__ = Snakeskin.LocalVars,
            __STR__, __J__;
        var $_; /* Snakeskin template: attr_index;  */
        this.attr_index = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'attr_index',
                PARENT_TPL_NAME;
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            var foo = 'foo';
            __RESULT__ += ' ';
            var bar = '';
            __RESULT__ += ' ';
            __STR__ = '';
            __J__ = 0;
            if ('bar') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (__STR__) {
                __RESULT__ += ' ' + foo + ' = "' + __STR__ + '"';
            }
            __RESULT__ += ' ';
            __STR__ = '';
            __J__ = 0;
            if (bar) {
                __STR__ += __J__ ? ' ' + bar : bar;
                __J__++;
            }
            if (foo) {
                __STR__ += __J__ ? ' ' + foo : foo;
                __J__++;
            }
            if (__STR__) {
                __RESULT__ += ' ' + 'foo' + ' = "' + __STR__ + '"';
            }
            __STR__ = '';
            __J__ = 0;
            if ('foo') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (__STR__) {
                __RESULT__ += ' ' + 'bar' + ' = "' + __STR__ + '"';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['attr_index'] = this.attr_index; /* Snakeskin template. */ /* Snakeskin template: attr_index2;  */
        this.attr_index2 = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'attr_index2',
                PARENT_TPL_NAME;
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            var foo = 'foo';
            __RESULT__ += ' ';
            var bar = 'bar';
            __RESULT__ += ' ';
            __STR__ = '';
            __J__ = 0;
            if (bar) {
                __STR__ += __J__ ? ' ' + bar : bar;
                __J__++;
            }
            if (foo) {
                __STR__ += __J__ ? ' ' + foo : foo;
                __J__++;
            }
            if (__STR__) {
                __RESULT__ += ' ' + 'ng-' + 'foo' + ' = "' + __STR__ + '"';
            }
            __STR__ = '';
            __J__ = 0;
            if ('foo') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (__STR__) {
                __RESULT__ += ' ' + 'ng-' + 'bar' + ' = "' + __STR__ + '"';
            }
            __STR__ = '';
            __J__ = 0;
            if ('bar') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (__STR__) {
                __RESULT__ += ' ' + foo + ' = "' + __STR__ + '"';
            }
            __RESULT__ += ' ';
            __STR__ = '';
            __J__ = 0;
            if ((1 ? bar : null)) {
                __STR__ += __J__ ? ' ' + (1 ? bar : null) : (1 ? bar : null);
                __J__++;
            }
            if (((foo))) {
                __STR__ += __J__ ? ' ' + ((foo)) : ((foo));
                __J__++;
            }
            if (__STR__) {
                __RESULT__ += ' ' + 'ng-' + 'foo' + ' = "' + __STR__ + '"';
            }
            __STR__ = '';
            __J__ = 0;
            if ('foo') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (__STR__) {
                __RESULT__ += ' ' + 'ng-' + 'bar' + ' = "' + __STR__ + '"';
            }
            __STR__ = '';
            __J__ = 0;
            if ('bar') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (__STR__) {
                __RESULT__ += ' ' + 'foo:' + foo + ' = "' + __STR__ + '"';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['attr_index2'] = this.attr_index2; /* Snakeskin template. */
    }
}).call(this);