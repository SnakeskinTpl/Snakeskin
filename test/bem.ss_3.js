/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,false,,stringBuffer,true,true,true,,true,true,i18n>, label <1413886610334>, includes <>, generated at <1414919438366>.
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
        var $_ = __LOCAL__['$_a131c']; /* Snakeskin template: bem_index;  */
        this.bem_index = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.bem_index,
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
            var TPL_NAME = "bem_index",
                PARENT_TPL_NAME;
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<h1');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + 'b-hello';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<span');
            __STR__ = '';
            __J__ = 0;
            if (('color:') != null && ('color:') !== '') {
                __STR__ += __J__ ? ' ' + 'color:' : 'color:';
                __J__++;
            }
            if (('blue') != null && ('blue') !== '') {
                __STR__ += __J__ ? ' ' + 'blue' : 'blue';
                __J__++;
            }
            if (('style') != null && ('style') != '' && (__STR__ || false)) {
                if (__TMP__[('style')] != null) {
                    __TMP__[('style')] += __STR__;
                } else {
                    if (__NODE__) {
                        __NODE__.setAttribute('style', __STR__);
                    } else {
                        __RESULT__.push(' ' + 'style' + (__STR__ ? '="' + __STR__ + '"' : ''));
                    }
                }
            }
            __STR__ = '';
            __J__ = 0;
            if (('' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-hello', '__bar')), true, true) + '') != null && ('' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-hello', '__bar')), true, true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-hello', '__bar')), true, true) + '' : '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-hello', '__bar')), true, true) + '';
                __J__++;
            }
            if (('class') != null && ('class') != '' && (__STR__ || false)) {
                if (__TMP__[('class')] != null) {
                    __TMP__[('class')] += __STR__;
                } else {
                    if (__NODE__) {
                        __NODE__.setAttribute('class', __STR__);
                    } else {
                        __RESULT__.push(' ' + 'class' + (__STR__ ? '="' + __STR__ + '"' : ''));
                    }
                }
            }
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'b-hello', '__msg')), false, false) + '';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('You are amazing!');
            __RESULT__.push('</span>');
            __RESULT__.push('</h1>');
            return __RESULT__.join('');
        };
        Snakeskin.cache["bem_index"] = this.bem_index; /* Snakeskin template. */ /* Snakeskin template: bem_index2;  */
        this.bem_index2 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.bem_index2,
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
            var TPL_NAME = "bem_index2",
                PARENT_TPL_NAME;
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<h1');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + 'b-hello';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<h2');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + 'b-desc';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<span');
            __STR__ = '';
            __J__ = 0;
            if (('' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-desc', '__bar')), true, true) + '') != null && ('' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-desc', '__bar')), true, true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-desc', '__bar')), true, true) + '' : '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-desc', '__bar')), true, true) + '';
                __J__++;
            }
            if (('class') != null && ('class') != '' && (__STR__ || false)) {
                if (__TMP__[('class')] != null) {
                    __TMP__[('class')] += __STR__;
                } else {
                    if (__NODE__) {
                        __NODE__.setAttribute('class', __STR__);
                    } else {
                        __RESULT__.push(' ' + 'class' + (__STR__ ? '="' + __STR__ + '"' : ''));
                    }
                }
            }
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'b-desc', '__msg')), false, false) + '';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('You are amazing!');
            __RESULT__.push('</span>');
            __RESULT__.push('</h2>');
            __RESULT__.push('</h1>');
            return __RESULT__.join('');
        };
        Snakeskin.cache["bem_index2"] = this.bem_index2; /* Snakeskin template. */ /* Snakeskin template: bem_index3;  */
        this.bem_index3 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.bem_index3,
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
            var TPL_NAME = "bem_index3",
                PARENT_TPL_NAME;
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<h1');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + 'b-hello';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<h2');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'b-hello', '__desc')), false, false) + '';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<span');
            __STR__ = '';
            __J__ = 0;
            if (('' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-hello', '__bar')), true, true) + '') != null && ('' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-hello', '__bar')), true, true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-hello', '__bar')), true, true) + '' : '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-hello', '__bar')), true, true) + '';
                __J__++;
            }
            if (('class') != null && ('class') != '' && (__STR__ || false)) {
                if (__TMP__[('class')] != null) {
                    __TMP__[('class')] += __STR__;
                } else {
                    if (__NODE__) {
                        __NODE__.setAttribute('class', __STR__);
                    } else {
                        __RESULT__.push(' ' + 'class' + (__STR__ ? '="' + __STR__ + '"' : ''));
                    }
                }
            }
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'b-hello', '__msg')), false, false) + '';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('You are amazing!');
            __RESULT__.push('</span>');
            __RESULT__.push('</h2>');
            __RESULT__.push('</h1>');
            return __RESULT__.join('');
        };
        Snakeskin.cache["bem_index3"] = this.bem_index3; /* Snakeskin template. */ /* Snakeskin template: bem_index4;  */
        this.bem_index4 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.bem_index4,
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
            var TPL_NAME = "bem_index4",
                PARENT_TPL_NAME;
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<h1');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'b-hello', '')), false, false) + '';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<h2');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'b-hello', '__desc')), false, false) + '';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<span');
            __STR__ = '';
            __J__ = 0;
            if (('' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-hello', '__bar')), true, true) + '') != null && ('' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-hello', '__bar')), true, true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-hello', '__bar')), true, true) + '' : '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(__THIS__, 'b-hello', '__bar')), true, true) + '';
                __J__++;
            }
            if (('class') != null && ('class') != '' && (__STR__ || false)) {
                if (__TMP__[('class')] != null) {
                    __TMP__[('class')] += __STR__;
                } else {
                    if (__NODE__) {
                        __NODE__.setAttribute('class', __STR__);
                    } else {
                        __RESULT__.push(' ' + 'class' + (__STR__ ? '="' + __STR__ + '"' : ''));
                    }
                }
            }
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'b-hello', '__msg')), false, false) + '';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('You are amazing!');
            __RESULT__.push('</span>');
            __RESULT__.push('</h2>');
            __RESULT__.push('</h1>');
            return __RESULT__.join('');
        };
        Snakeskin.cache["bem_index4"] = this.bem_index4; /* Snakeskin template. */
    }
}).call(this);
