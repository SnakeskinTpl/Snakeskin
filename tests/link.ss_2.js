/* Snakeskin v4.0.0, label <1407482292619>, generated at <1407581619821> Sat Aug 09 2014 14:53:39 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_26473']; /* Snakeskin template: link_index;  */
        this.link_index = function() {
            var __THIS__ = this,
                callee = __ROOT__.link_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'link_index',
                PARENT_TPL_NAME;
            __RESULT__ += '<link type="text/css" rel="stylesheet"';
            __RESULT__ += ' href="';
            __RESULT__ += 'foo';
            __RESULT__ += '"/>';
            __RESULT__ += ' ';
            __RESULT__ += '<link type="text/css" rel="stylesheet"';
            __RESULT__ += ' href="';
            __RESULT__ += 'foo';
            __RESULT__ += '"/>';
            __RESULT__ += ' ';
            __RESULT__ += '<link type="text/css" rel="alternate stylesheet"';
            __RESULT__ += ' href="';
            __RESULT__ += 'foo';
            __RESULT__ += '"/>';
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['link_index'] = this.link_index; /* Snakeskin template. */ /* Snakeskin template: link_index2;  */
        this.link_index2 = function() {
            var __THIS__ = this,
                callee = __ROOT__.link_index2;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'link_index2',
                PARENT_TPL_NAME;
            __RESULT__ += '<link type="text/css" rel="stylesheet"';
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('ng-class') != null && ('ng-class') != '' && __STR__) {
                __RESULT__ += ' ' + 'ng-class' + '="' + __STR__ + '"';
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('ng-id') != null && ('ng-id') != '' && __STR__) {
                __RESULT__ += ' ' + 'ng-id' + '="' + __STR__ + '"';
            }
            __RESULT__ += ' href="';
            __RESULT__ += 'foo ';
            __RESULT__ += '"/>';
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['link_index2'] = this.link_index2; /* Snakeskin template. */
    }
}).call(this);