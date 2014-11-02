/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,false,,stringBuffer,true,true,true,,true,true,i18n>, label <1413886610332>, includes <>, generated at <1414919438343>.
   This code is generated automatically, don't alter it. */
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
        var __APPEND__ = Snakeskin.appendChild,
            __FILTERS__ = Snakeskin.Filters,
            __VARS__ = Snakeskin.Vars,
            __LOCAL__ = Snakeskin.LocalVars,
            __STR__, __TMP__, __J__;
        var $_ = __LOCAL__['$_97a6f']; /* Snakeskin template: attr_index;  */
        this.attr_index = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.attr_index,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__.join('');
                if (opt_clear) {
                    __RESULT__ = new Snakeskin.StringBuffer();
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = new Snakeskin.StringBuffer();
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "attr_index",
                PARENT_TPL_NAME;
            foo = 'foo';
            bar = '';
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '', __STR__);
                } else {
                    __RESULT__.push(' ' + '' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '' + (__STR__ ? '="' + __STR__ + '"' : ''));
                }
            }
            __RESULT__.push(' ');
            __STR__ = '';
            __J__ = 0;
            if (('' + __FILTERS__.html(__FILTERS__.undef(bar), true, true) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(bar), true, true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(__FILTERS__.undef(bar), true, true) + '' : '' + __FILTERS__.html(__FILTERS__.undef(bar), true, true) + '';
                __J__++;
            }
            if (('' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '' : '' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '';
                __J__++;
            }
            if (('foo') != null && ('foo') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('foo', __STR__);
                } else {
                    __RESULT__.push(' ' + 'foo' + (__STR__ ? '="' + __STR__ + '"' : ''));
                }
            }
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('bar') != null && ('bar') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('bar', __STR__);
                } else {
                    __RESULT__.push(' ' + 'bar' + (__STR__ ? '="' + __STR__ + '"' : ''));
                }
            }
            __RESULT__.push(' ');
            var foo;
            var bar;
            return __RESULT__.join('');
        };
        Snakeskin.cache["attr_index"] = this.attr_index; /* Snakeskin template. */ /* Snakeskin template: attr_index2;  */
        this.attr_index2 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.attr_index2,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__.join('');
                if (opt_clear) {
                    __RESULT__ = new Snakeskin.StringBuffer();
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = new Snakeskin.StringBuffer();
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "attr_index2",
                PARENT_TPL_NAME;
            foo = 'foo';
            bar = 'bar';
            __STR__ = '';
            __J__ = 0;
            if (('' + __FILTERS__.html(__FILTERS__.undef(bar), true, true) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(bar), true, true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(__FILTERS__.undef(bar), true, true) + '' : '' + __FILTERS__.html(__FILTERS__.undef(bar), true, true) + '';
                __J__++;
            }
            if (('' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '' : '' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '';
                __J__++;
            }
            if (('ng-foo') != null && ('ng-foo') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('ng-foo', __STR__);
                } else {
                    __RESULT__.push(' ' + 'ng-foo' + (__STR__ ? '="' + __STR__ + '"' : ''));
                }
            }
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('ng-bar') != null && ('ng-bar') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('ng-bar', __STR__);
                } else {
                    __RESULT__.push(' ' + 'ng-bar' + (__STR__ ? '="' + __STR__ + '"' : ''));
                }
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '') != null && ('' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '', __STR__);
                } else {
                    __RESULT__.push(' ' + '' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '' + (__STR__ ? '="' + __STR__ + '"' : ''));
                }
            }
            __RESULT__.push(' ');
            __STR__ = '';
            __J__ = 0;
            if (('' + __FILTERS__.html((1 ? __FILTERS__.undef(bar) : null), true, true) + '') != null && ('' + __FILTERS__.html((1 ? __FILTERS__.undef(bar) : null), true, true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html((1 ? __FILTERS__.undef(bar) : null), true, true) + '' : '' + __FILTERS__.html((1 ? __FILTERS__.undef(bar) : null), true, true) + '';
                __J__++;
            }
            if (('' + __FILTERS__.html(((__FILTERS__.undef(foo))), true, true) + '') != null && ('' + __FILTERS__.html(((__FILTERS__.undef(foo))), true, true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(((__FILTERS__.undef(foo))), true, true) + '' : '' + __FILTERS__.html(((__FILTERS__.undef(foo))), true, true) + '';
                __J__++;
            }
            if (('ng-foo') != null && ('ng-foo') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('ng-foo', __STR__);
                } else {
                    __RESULT__.push(' ' + 'ng-foo' + (__STR__ ? '="' + __STR__ + '"' : ''));
                }
            }
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('ng-bar') != null && ('ng-bar') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('ng-bar', __STR__);
                } else {
                    __RESULT__.push(' ' + 'ng-bar' + (__STR__ ? '="' + __STR__ + '"' : ''));
                }
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('foo:' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '') != null && ('foo:' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('foo:' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '', __STR__);
                } else {
                    __RESULT__.push(' ' + 'foo:' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '' + (__STR__ ? '="' + __STR__ + '"' : ''));
                }
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('b-foo:' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '') != null && ('b-foo:' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('b-foo:' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '', __STR__);
                } else {
                    __RESULT__.push(' ' + 'b-foo:' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '' + (__STR__ ? '="' + __STR__ + '"' : ''));
                }
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('b:foo-' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '') != null && ('b:foo-' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('b:foo-' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '', __STR__);
                } else {
                    __RESULT__.push(' ' + 'b:foo-' + __FILTERS__.html(__FILTERS__.undef(foo), true, true) + '' + (__STR__ ? '="' + __STR__ + '"' : ''));
                }
            }
            __RESULT__.push(' ');
            var foo;
            var bar;
            return __RESULT__.join('');
        };
        Snakeskin.cache["attr_index2"] = this.attr_index2; /* Snakeskin template. */
    }
}).call(this);
