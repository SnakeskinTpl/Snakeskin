/* Snakeskin v4.0.0, label <1406785448122>, generated at <1407502635861> Fri Aug 08 2014 16:57:15 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_35bbd']; /* Snakeskin template: syntax_index;  */
        this.syntax_index = function() {
            var __THIS__ = this,
                callee = __ROOT__.syntax_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'syntax_index',
                PARENT_TPL_NAME;
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<span');
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('car') != null && ('car') !== '') {
                __STR__ += __J__ ? ' ' + 'car' : 'car';
                __J__++;
            }
            if (('class') != null && ('class') != '' && __STR__) {
                if (__TMP__[('class')] != null) {
                    __TMP__[('class')] += __STR__;
                } else {
                    __RESULT__.push(' ' + 'class' + '="' + __STR__ + '"');
                }
            }
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + 'foo';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<div');
            __RESULT__.push(' id="my"');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'foo', '__bar')), false) + '';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('1');
            __RESULT__.push('</div>');
            __RESULT__.push('</span>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<div');
            __RESULT__.push(' id="my"');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '&__bar';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('1');
            __RESULT__.push('</div>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<div');
            __RESULT__.push(' id="my"');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'foo', '__bar')), false) + '';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('1');
            __RESULT__.push('</div>');
            return __RESULT__.join('');
        };
        Snakeskin.cache['syntax_index'] = this.syntax_index; /* Snakeskin template. */ /* Snakeskin template: syntax_index2;  */
        this.syntax_index2 = function() {
            var __THIS__ = this,
                callee = __ROOT__.syntax_index2;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'syntax_index2',
                PARENT_TPL_NAME = 'syntax_index';
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<span');
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('car') != null && ('car') !== '') {
                __STR__ += __J__ ? ' ' + 'car' : 'car';
                __J__++;
            }
            if (('class') != null && ('class') != '' && __STR__) {
                if (__TMP__[('class')] != null) {
                    __TMP__[('class')] += __STR__;
                } else {
                    __RESULT__.push(' ' + 'class' + '="' + __STR__ + '"');
                }
            }
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + 'foo';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<div');
            __RESULT__.push(' id="my"');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'foo', '__bar')), false) + '';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('1');
            __RESULT__.push('</div>');
            __RESULT__.push('</span>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<div');
            __RESULT__.push(' id="my"');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '&__bar';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('1');
            __RESULT__.push('</div>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<div');
            __RESULT__.push(' id="my"');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'foo', '__bar')), false) + '';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('1');
            __RESULT__.push('</div>');
            return __RESULT__.join('');
        };
        Snakeskin.cache['syntax_index2'] = this.syntax_index2; /* Snakeskin template. */
    }
}).call(this);