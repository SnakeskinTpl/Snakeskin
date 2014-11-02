/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,false,,stringBuffer,true,true,true,,true,true,i18n>, label <1413886610373>, includes <>, generated at <1414827001642>.
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
        var $_ = __LOCAL__['$_d1c30'];
        __LOCAL__.a_0_d1c30 = 1; /* Snakeskin template: syntax_index;  */
        this.syntax_index = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.syntax_index,
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
            var TPL_NAME = "syntax_index",
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
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + 'foo';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<div');
            __RESULT__.push(' id="my"');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'foo', '__bar')), false, false) + '';
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
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'foo', '__bar')), false, false) + '';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('1');
            __RESULT__.push('</div>');
            return __RESULT__.join('');
        };
        Snakeskin.cache["syntax_index"] = this.syntax_index; /* Snakeskin template. */ /* Snakeskin template: syntax_index2;  */
        this.syntax_index2 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.syntax_index2,
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
            var TPL_NAME = "syntax_index2",
                PARENT_TPL_NAME = "syntax_index";
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
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + 'foo';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<div');
            __RESULT__.push(' id="my"');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'foo', '__bar')), false, false) + '';
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
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'foo', '__bar')), false, false) + '';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('1');
            __RESULT__.push('</div>');
            return __RESULT__.join('');
        };
        Snakeskin.cache["syntax_index2"] = this.syntax_index2; /* Snakeskin template. */ /* Snakeskin template: syntax_index3;  */
        this.syntax_index3 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.syntax_index3,
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
            var TPL_NAME = "syntax_index3",
                PARENT_TPL_NAME;
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('ng-class') != null && ('ng-class') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('ng-class', __STR__);
                } else {
                    __RESULT__.push(' ' + 'ng-class' + (__STR__ ? '="' + __STR__ + '"' : ''));
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
            return __RESULT__.join('');
        };
        Snakeskin.cache["syntax_index3"] = this.syntax_index3; /* Snakeskin template. */ /* Snakeskin template: syntax_index4;  */
        this.syntax_index4 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.syntax_index4,
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
            var TPL_NAME = "syntax_index4",
                PARENT_TPL_NAME;
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<div');
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('ng-class') != null && ('ng-class') != '' && (__STR__ || false)) {
                if (__TMP__[('ng-class')] != null) {
                    __TMP__[('ng-class')] += __STR__;
                } else {
                    if (__NODE__) {
                        __NODE__.setAttribute('ng-class', __STR__);
                    } else {
                        __RESULT__.push(' ' + 'ng-class' + (__STR__ ? '="' + __STR__ + '"' : ''));
                    }
                }
            }
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('ng-bar') != null && ('ng-bar') != '' && (__STR__ || false)) {
                if (__TMP__[('ng-bar')] != null) {
                    __TMP__[('ng-bar')] += __STR__;
                } else {
                    if (__NODE__) {
                        __NODE__.setAttribute('ng-bar', __STR__);
                    } else {
                        __RESULT__.push(' ' + 'ng-bar' + (__STR__ ? '="' + __STR__ + '"' : ''));
                    }
                }
            }
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('foo');
            __RESULT__.push('</div>');
            return __RESULT__.join('');
        };
        Snakeskin.cache["syntax_index4"] = this.syntax_index4; /* Snakeskin template. */
        __LOCAL__.usingSnakeskin_0_d1c30 = true; /* Snakeskin template: syntax_index5; name  */
        this.syntax_index5 = function(name) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.syntax_index5,
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
            var TPL_NAME = "syntax_index5",
                PARENT_TPL_NAME;
            name = arguments[0] = name != null ? name : 'friend';
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<h1');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + 'b-hello';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            if (__LOCAL__.usingSnakeskin_0_d1c30) {
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
                if (('some') != null && ('some') !== '') {
                    __STR__ += __J__ ? ' ' + 'some' : 'some';
                    __J__++;
                }
                if (('description') != null && ('description') !== '') {
                    __STR__ += __J__ ? ' ' + 'description' : 'description';
                    __J__++;
                }
                if (('data-info') != null && ('data-info') != '' && (__STR__ || false)) {
                    if (__TMP__[('data-info')] != null) {
                        __TMP__[('data-info')] += __STR__;
                    } else {
                        if (__NODE__) {
                            __NODE__.setAttribute('data-info', __STR__);
                        } else {
                            __RESULT__.push(' ' + 'data-info' + (__STR__ ? '="' + __STR__ + '"' : ''));
                        }
                    }
                }
                __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'b-hello', '__msg')), false, false) + '';
                __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
                __RESULT__.push('Hello ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(name), false, false));
                __RESULT__.push('! You are amazing!');
                __RESULT__.push('</span>');
            } else {
                __TMP__ = {
                    'class': ''
                };
                __RESULT__.push('<span');
                __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'b-hello', '__warning')), false, false) + '';
                __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
                __RESULT__.push('Youwrong!!!');
                __RESULT__.push('</span>');
            }
            __RESULT__.push('</h1>');
            return __RESULT__.join('');
        };
        Snakeskin.cache["syntax_index5"] = this.syntax_index5; /* Snakeskin template. */ /* Snakeskin template: syntax_index6;  */
        this.syntax_index6 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.syntax_index6,
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
            var TPL_NAME = "syntax_index6",
                PARENT_TPL_NAME;
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<h1');
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + 'b-hello';
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('foo bar car my mooo boo');
            __RESULT__.push('</h1>');
            return __RESULT__.join('');
        };
        Snakeskin.cache["syntax_index6"] = this.syntax_index6; /* Snakeskin template. */ /* Snakeskin template: syntax_index7;  */
        this.syntax_index7 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.syntax_index7,
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
            var TPL_NAME = "syntax_index7",
                PARENT_TPL_NAME;
            switch (1) {
                case 1:
                    {
                        __RESULT__.push('foo');
                    }
                    break;
            }
            __RESULT__.push(' ');
            __RESULT__.push('bar');
            return __RESULT__.join('');
        };
        Snakeskin.cache["syntax_index7"] = this.syntax_index7; /* Snakeskin template. */ /* Snakeskin template: syntax_index8;  */
        this.syntax_index8 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.syntax_index8,
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
            var TPL_NAME = "syntax_index8",
                PARENT_TPL_NAME;
            __RESULT__.push('Hello man & foo bar ');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<div');
            __STR__ = '';
            __J__ = 0;
            if (('color:') != null && ('color:') !== '') {
                __STR__ += __J__ ? ' ' + 'color:' : 'color:';
                __J__++;
            }
            if (('red') != null && ('red') !== '') {
                __STR__ += __J__ ? ' ' + 'red' : 'red';
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
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('bar');
            __RESULT__.push('</div>');
            __RESULT__.push('foo :: bar ');
            __TMP__ = {
                'class': ''
            };
            __RESULT__.push('<div');
            __STR__ = '';
            __J__ = 0;
            if (('::') != null && ('::') !== '') {
                __STR__ += __J__ ? ' ' + '::' : '::';
                __J__++;
            }
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
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
            __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
            __RESULT__.push('</div>');
            return __RESULT__.join('');
        };
        Snakeskin.cache["syntax_index8"] = this.syntax_index8; /* Snakeskin template. */
    }
}).call(this);
