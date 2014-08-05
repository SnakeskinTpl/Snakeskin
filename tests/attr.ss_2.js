/* Snakeskin v4.0.0, label <1406782358626>, generated at <1407250258652> Tue Aug 05 2014 18:50:58 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports['init'] = function(obj) {
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
        var $_ = __LOCAL__['$_c1986']; /* Snakeskin template: attr_index;  */
        this.attr_index = function() {
            var __THIS__ = this,
                callee = __ROOT__.attr_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'attr_index',
                PARENT_TPL_NAME;
            foo = 'foo';
            __RESULT__ += ' ';
            bar = '';
            __RESULT__ += ' ';
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('' + __FILTERS__.html(__FILTERS__.undef(foo)) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(foo)) + '') != '' && __STR__) {
                __RESULT__ += ' ' + '' + __FILTERS__.html(__FILTERS__.undef(foo)) + '' + '="' + __STR__ + '"';
            }
            __RESULT__ += ' ';
            __STR__ = '';
            __J__ = 0;
            if (('' + __FILTERS__.html(__FILTERS__.undef(bar)) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(bar)) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(__FILTERS__.undef(bar)) + '' : '' + __FILTERS__.html(__FILTERS__.undef(bar)) + '';
                __J__++;
            }
            if (('' + __FILTERS__.html(__FILTERS__.undef(foo)) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(foo)) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(__FILTERS__.undef(foo)) + '' : '' + __FILTERS__.html(__FILTERS__.undef(foo)) + '';
                __J__++;
            }
            if (('foo') != null && ('foo') != '' && __STR__) {
                __RESULT__ += ' ' + 'foo' + '="' + __STR__ + '"';
            }
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('bar') != null && ('bar') != '' && __STR__) {
                __RESULT__ += ' ' + 'bar' + '="' + __STR__ + '"';
            }
            __RESULT__ += ' ';
            var foo;
            var bar;
            return __RESULT__;
        };
        Snakeskin.cache['attr_index'] = this.attr_index; /* Snakeskin template. */ /* Snakeskin template: attr_index2;  */
        this.attr_index2 = function() {
            var __THIS__ = this,
                callee = __ROOT__.attr_index2;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'attr_index2',
                PARENT_TPL_NAME;
            foo = 'foo';
            __RESULT__ += ' ';
            bar = 'bar';
            __RESULT__ += ' ';
            __STR__ = '';
            __J__ = 0;
            if (('' + __FILTERS__.html(__FILTERS__.undef(bar)) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(bar)) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(__FILTERS__.undef(bar)) + '' : '' + __FILTERS__.html(__FILTERS__.undef(bar)) + '';
                __J__++;
            }
            if (('' + __FILTERS__.html(__FILTERS__.undef(foo)) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(foo)) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(__FILTERS__.undef(foo)) + '' : '' + __FILTERS__.html(__FILTERS__.undef(foo)) + '';
                __J__++;
            }
            if (('ng-foo') != null && ('ng-foo') != '' && __STR__) {
                __RESULT__ += ' ' + 'ng-foo' + '="' + __STR__ + '"';
            }
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('ng-bar') != null && ('ng-bar') != '' && __STR__) {
                __RESULT__ += ' ' + 'ng-bar' + '="' + __STR__ + '"';
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('' + __FILTERS__.html(__FILTERS__.undef(foo)) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(foo)) + '') != '' && __STR__) {
                __RESULT__ += ' ' + '' + __FILTERS__.html(__FILTERS__.undef(foo)) + '' + '="' + __STR__ + '"';
            }
            __RESULT__ += ' ';
            __STR__ = '';
            __J__ = 0;
            if (('' + __FILTERS__.html((1 ? __FILTERS__.undef(bar) : null)) + '') != null && ('' + __FILTERS__.html((1 ? __FILTERS__.undef(bar) : null)) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html((1 ? __FILTERS__.undef(bar) : null)) + '' : '' + __FILTERS__.html((1 ? __FILTERS__.undef(bar) : null)) + '';
                __J__++;
            }
            if (('' + __FILTERS__.html(((__FILTERS__.undef(foo)))) + '') != null && ('' + __FILTERS__.html(((__FILTERS__.undef(foo)))) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(((__FILTERS__.undef(foo)))) + '' : '' + __FILTERS__.html(((__FILTERS__.undef(foo)))) + '';
                __J__++;
            }
            if (('ng-foo') != null && ('ng-foo') != '' && __STR__) {
                __RESULT__ += ' ' + 'ng-foo' + '="' + __STR__ + '"';
            }
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('ng-bar') != null && ('ng-bar') != '' && __STR__) {
                __RESULT__ += ' ' + 'ng-bar' + '="' + __STR__ + '"';
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('foo:' + __FILTERS__.html(__FILTERS__.undef(foo)) + '') != null && ('foo:' + __FILTERS__.html(__FILTERS__.undef(foo)) + '') != '' && __STR__) {
                __RESULT__ += ' ' + 'foo:' + __FILTERS__.html(__FILTERS__.undef(foo)) + '' + '="' + __STR__ + '"';
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('b-foo:' + __FILTERS__.html(__FILTERS__.undef(foo)) + '') != null && ('b-foo:' + __FILTERS__.html(__FILTERS__.undef(foo)) + '') != '' && __STR__) {
                __RESULT__ += ' ' + 'b-foo:' + __FILTERS__.html(__FILTERS__.undef(foo)) + '' + '="' + __STR__ + '"';
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('b:foo-' + __FILTERS__.html(__FILTERS__.undef(foo)) + '') != null && ('b:foo-' + __FILTERS__.html(__FILTERS__.undef(foo)) + '') != '' && __STR__) {
                __RESULT__ += ' ' + 'b:foo-' + __FILTERS__.html(__FILTERS__.undef(foo)) + '' + '="' + __STR__ + '"';
            }
            __RESULT__ += ' ';
            var foo;
            var bar;
            return __RESULT__;
        };
        Snakeskin.cache['attr_index2'] = this.attr_index2; /* Snakeskin template. */
    }
}).call(this);