/* Snakeskin v4.0.0, label <1406784764450>, generated at <1407338186799> Wed Aug 06 2014 19:16:26 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_89e6a']; /* Snakeskin template: link_index;  */
        this.link_index = function() {
            var __THIS__ = this,
                callee = __ROOT__.link_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'link_index',
                PARENT_TPL_NAME;
            __RESULT__.push('<link type="text/css" rel="stylesheet"');
            __RESULT__.push(' href="');
            __RESULT__.push('foo');
            __RESULT__.push('" />');
            __RESULT__.push(' ');
            __RESULT__.push('<link type="text/css" rel="stylesheet"');
            __RESULT__.push(' href="');
            __RESULT__.push('foo');
            __RESULT__.push('" />');
            __RESULT__.push(' ');
            __RESULT__.push('<link type="text/css" rel="alternate stylesheet"');
            __RESULT__.push(' href="');
            __RESULT__.push('foo');
            __RESULT__.push('" />');
            __RESULT__.push(' ');
            return __RESULT__.join('');
        };
        Snakeskin.cache['link_index'] = this.link_index; /* Snakeskin template. */ /* Snakeskin template: link_index2;  */
        this.link_index2 = function() {
            var __THIS__ = this,
                callee = __ROOT__.link_index2;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'link_index2',
                PARENT_TPL_NAME;
            __RESULT__.push('<link type="text/css" rel="stylesheet"');
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
            __RESULT__.push(' href="');
            __RESULT__.push('foo ');
            __RESULT__.push('" />');
            __RESULT__.push(' ');
            return __RESULT__.join('');
        };
        Snakeskin.cache['link_index2'] = this.link_index2; /* Snakeskin template. */
    }
}).call(this);