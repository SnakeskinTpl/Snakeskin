/* Snakeskin v4.0.0, label <1407660751362>, generated at <1407667214456> Sun Aug 10 2014 14:40:14 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_02c64']; /* Snakeskin template: attr_index;  */
        this.attr_index = function() {
            var __THIS__ = this,
                callee = __ROOT__.attr_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'attr_index',
                PARENT_TPL_NAME;
            foo = 'foo';
            __RESULT__.push(' ');
            bar = '';
            __RESULT__.push(' ');
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '') != '' && __STR__) {
                __RESULT__.push(' ' + '' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '' + '="' + __STR__ + '"');
            }
            __RESULT__.push(' ');
            __STR__ = '';
            __J__ = 0;
            if (('' + __FILTERS__.html(__FILTERS__.undef(bar), true) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(bar), true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(__FILTERS__.undef(bar), true) + '' : '' + __FILTERS__.html(__FILTERS__.undef(bar), true) + '';
                __J__++;
            }
            if (('' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '' : '' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '';
                __J__++;
            }
            if (('foo') != null && ('foo') != '' && __STR__) {
                __RESULT__.push(' ' + 'foo' + '="' + __STR__ + '"');
            }
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('bar') != null && ('bar') != '' && __STR__) {
                __RESULT__.push(' ' + 'bar' + '="' + __STR__ + '"');
            }
            __RESULT__.push(' ');
            var foo;
            var bar;
            return __RESULT__.join('');
        };
        Snakeskin.cache['attr_index'] = this.attr_index; /* Snakeskin template. */ /* Snakeskin template: attr_index2;  */
        this.attr_index2 = function() {
            var __THIS__ = this,
                callee = __ROOT__.attr_index2;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'attr_index2',
                PARENT_TPL_NAME;
            foo = 'foo';
            __RESULT__.push(' ');
            bar = 'bar';
            __RESULT__.push(' ');
            __STR__ = '';
            __J__ = 0;
            if (('' + __FILTERS__.html(__FILTERS__.undef(bar), true) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(bar), true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(__FILTERS__.undef(bar), true) + '' : '' + __FILTERS__.html(__FILTERS__.undef(bar), true) + '';
                __J__++;
            }
            if (('' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '' : '' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '';
                __J__++;
            }
            if (('ng-foo') != null && ('ng-foo') != '' && __STR__) {
                __RESULT__.push(' ' + 'ng-foo' + '="' + __STR__ + '"');
            }
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('ng-bar') != null && ('ng-bar') != '' && __STR__) {
                __RESULT__.push(' ' + 'ng-bar' + '="' + __STR__ + '"');
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '') != '' && __STR__) {
                __RESULT__.push(' ' + '' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '' + '="' + __STR__ + '"');
            }
            __RESULT__.push(' ');
            __STR__ = '';
            __J__ = 0;
            if (('' + __FILTERS__.html((1 ? __FILTERS__.undef(bar) : null), true) + '') != null && ('' + __FILTERS__.html((1 ? __FILTERS__.undef(bar) : null), true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html((1 ? __FILTERS__.undef(bar) : null), true) + '' : '' + __FILTERS__.html((1 ? __FILTERS__.undef(bar) : null), true) + '';
                __J__++;
            }
            if (('' + __FILTERS__.html(((__FILTERS__.undef(foo))), true) + '') != null && ('' + __FILTERS__.html(((__FILTERS__.undef(foo))), true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(((__FILTERS__.undef(foo))), true) + '' : '' + __FILTERS__.html(((__FILTERS__.undef(foo))), true) + '';
                __J__++;
            }
            if (('ng-foo') != null && ('ng-foo') != '' && __STR__) {
                __RESULT__.push(' ' + 'ng-foo' + '="' + __STR__ + '"');
            }
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('ng-bar') != null && ('ng-bar') != '' && __STR__) {
                __RESULT__.push(' ' + 'ng-bar' + '="' + __STR__ + '"');
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('foo:' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '') != null && ('foo:' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '') != '' && __STR__) {
                __RESULT__.push(' ' + 'foo:' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '' + '="' + __STR__ + '"');
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('b-foo:' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '') != null && ('b-foo:' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '') != '' && __STR__) {
                __RESULT__.push(' ' + 'b-foo:' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '' + '="' + __STR__ + '"');
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('b:foo-' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '') != null && ('b:foo-' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '') != '' && __STR__) {
                __RESULT__.push(' ' + 'b:foo-' + __FILTERS__.html(__FILTERS__.undef(foo), true) + '' + '="' + __STR__ + '"');
            }
            __RESULT__.push(' ');
            var foo;
            var bar;
            return __RESULT__.join('');
        };
        Snakeskin.cache['attr_index2'] = this.attr_index2; /* Snakeskin template. */
    }
}).call(this);