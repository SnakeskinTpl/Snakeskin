/* Snakeskin v4.0.0, label <1406784790910>, generated at <1407579288271> Sat Aug 09 2014 14:14:48 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_5c931']; /* Snakeskin template: style_index;  */
        this.style_index = function() {
            var __THIS__ = this,
                callee = __ROOT__.style_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'style_index',
                PARENT_TPL_NAME;
            __RESULT__.push('<style type="text/css"');
            __RESULT__.push('>');
            __RESULT__.push('.a {} ');
            __RESULT__.push('</style>');
            __RESULT__.push(' ');
            __RESULT__.push('<style type="text/css"');
            __RESULT__.push('>');
            __RESULT__.push('.a {} ');
            __RESULT__.push('</style>');
            __RESULT__.push(' ');
            __RESULT__.push('<style type="css2"');
            __RESULT__.push('>');
            __RESULT__.push('.a {} ');
            __RESULT__.push('</style>');
            __RESULT__.push(' ');
            return __RESULT__.join('');
        };
        Snakeskin.cache['style_index'] = this.style_index; /* Snakeskin template. */ /* Snakeskin template: style_index2;  */
        this.style_index2 = function() {
            var __THIS__ = this,
                callee = __ROOT__.style_index2;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'style_index2',
                PARENT_TPL_NAME;
            __RESULT__.push('<style type="text/css"');
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('ng-class') != null && ('ng-class') != '' && __STR__) {
                __RESULT__.push(' ' + 'ng-class' + '="' + __STR__ + '"');
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('ng-id') != null && ('ng-id') != '' && __STR__) {
                __RESULT__.push(' ' + 'ng-id' + '="' + __STR__ + '"');
            }
            __RESULT__.push('>');
            __RESULT__.push('.a {} ');
            __RESULT__.push('</style>');
            __RESULT__.push(' ');
            return __RESULT__.join('');
        };
        Snakeskin.cache['style_index2'] = this.style_index2; /* Snakeskin template. */
    }
}).call(this);