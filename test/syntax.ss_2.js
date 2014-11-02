/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,true,,stringConcat,true,true,true,,true,true,i18n>, label <1413886610373>, includes <>, generated at <1414826999791>.
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
        var $_ = __LOCAL__['$_07919'];
        __LOCAL__.a_0_07919 = 1; /* Snakeskin template: syntax_index;  */
        this.syntax_index = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.syntax_index,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "syntax_index",
                PARENT_TPL_NAME;
            __TMP__ = {
                'class': ''
            };
            __RESULT__ += '<span';
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
                        __RESULT__ += ' ' + 'class' + (__STR__ ? '="' + __STR__ + '"' : '');
                    }
                }
            }
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + 'foo';
            __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
            __TMP__ = {
                'class': ''
            };
            __RESULT__ += '<div';
            __RESULT__ += ' id="my"';
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'foo', '__bar')), false, false) + '';
            __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
            __RESULT__ += '1';
            __RESULT__ += '</div>';
            __RESULT__ += '</span>';
            __TMP__ = {
                'class': ''
            };
            __RESULT__ += '<div';
            __RESULT__ += ' id="my"';
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '&__bar';
            __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
            __RESULT__ += '1';
            __RESULT__ += '</div>';
            __TMP__ = {
                'class': ''
            };
            __RESULT__ += '<div';
            __RESULT__ += ' id="my"';
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'foo', '__bar')), false, false) + '';
            __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
            __RESULT__ += '1';
            __RESULT__ += '</div>';
            return __RESULT__;
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
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "syntax_index2",
                PARENT_TPL_NAME = "syntax_index";
            __TMP__ = {
                'class': ''
            };
            __RESULT__ += '<span';
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
                        __RESULT__ += ' ' + 'class' + (__STR__ ? '="' + __STR__ + '"' : '');
                    }
                }
            }
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + 'foo';
            __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
            __TMP__ = {
                'class': ''
            };
            __RESULT__ += '<div';
            __RESULT__ += ' id="my"';
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'foo', '__bar')), false, false) + '';
            __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
            __RESULT__ += '1';
            __RESULT__ += '</div>';
            __RESULT__ += '</span>';
            __TMP__ = {
                'class': ''
            };
            __RESULT__ += '<div';
            __RESULT__ += ' id="my"';
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '&__bar';
            __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
            __RESULT__ += '1';
            __RESULT__ += '</div>';
            __TMP__ = {
                'class': ''
            };
            __RESULT__ += '<div';
            __RESULT__ += ' id="my"';
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'foo', '__bar')), false, false) + '';
            __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
            __RESULT__ += '1';
            __RESULT__ += '</div>';
            return __RESULT__;
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
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
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
                    __RESULT__ += ' ' + 'ng-class' + (__STR__ ? '="' + __STR__ + '"' : '');
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
                    __RESULT__ += ' ' + 'ng-bar' + (__STR__ ? '="' + __STR__ + '"' : '');
                }
            }
            return __RESULT__;
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
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "syntax_index4",
                PARENT_TPL_NAME;
            __TMP__ = {
                'class': ''
            };
            __RESULT__ += '<div';
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
                        __RESULT__ += ' ' + 'ng-class' + (__STR__ ? '="' + __STR__ + '"' : '');
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
                        __RESULT__ += ' ' + 'ng-bar' + (__STR__ ? '="' + __STR__ + '"' : '');
                    }
                }
            }
            __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
            __RESULT__ += 'foo';
            __RESULT__ += '</div>';
            return __RESULT__;
        };
        Snakeskin.cache["syntax_index4"] = this.syntax_index4; /* Snakeskin template. */
        __LOCAL__.usingSnakeskin_0_07919 = true; /* Snakeskin template: syntax_index5; name  */
        this.syntax_index5 = function(name) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.syntax_index5,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "syntax_index5",
                PARENT_TPL_NAME;
            name = arguments[0] = name != null ? name : 'friend';
            __TMP__ = {
                'class': ''
            };
            __RESULT__ += '<h1';
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + 'b-hello';
            __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
            if (__LOCAL__.usingSnakeskin_0_07919) {
                __TMP__ = {
                    'class': ''
                };
                __RESULT__ += '<span';
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
                            __RESULT__ += ' ' + 'style' + (__STR__ ? '="' + __STR__ + '"' : '');
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
                            __RESULT__ += ' ' + 'data-info' + (__STR__ ? '="' + __STR__ + '"' : '');
                        }
                    }
                }
                __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'b-hello', '__msg')), false, false) + '';
                __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
                __RESULT__ += 'Hello ';
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name), false, false);
                __RESULT__ += '! You are amazing!';
                __RESULT__ += '</span>';
            } else {
                __TMP__ = {
                    'class': ''
                };
                __RESULT__ += '<span';
                __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '' + __FILTERS__.html(($_ = __FILTERS__['bem'].call(this, 'b-hello', '__warning')), false, false) + '';
                __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
                __RESULT__ += 'Youwrong!!!';
                __RESULT__ += '</span>';
            }
            __RESULT__ += '</h1>';
            return __RESULT__;
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
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "syntax_index6",
                PARENT_TPL_NAME;
            __TMP__ = {
                'class': ''
            };
            __RESULT__ += '<h1';
            __TMP__['class'] += (__TMP__['class'] ? ' ' : '') + 'b-hello';
            __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
            __RESULT__ += 'foo bar car my mooo boo';
            __RESULT__ += '</h1>';
            return __RESULT__;
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
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "syntax_index7",
                PARENT_TPL_NAME;
            switch (1) {
                case 1:
                    {
                        __RESULT__ += 'foo';
                    }
                    break;
            }
            __RESULT__ += ' ';
            __RESULT__ += 'bar';
            return __RESULT__;
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
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "syntax_index8",
                PARENT_TPL_NAME;
            __RESULT__ += 'Hello man & foo bar ';
            __TMP__ = {
                'class': ''
            };
            __RESULT__ += '<div';
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
                        __RESULT__ += ' ' + 'style' + (__STR__ ? '="' + __STR__ + '"' : '');
                    }
                }
            }
            __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
            __RESULT__ += 'bar';
            __RESULT__ += '</div>';
            __RESULT__ += 'foo :: bar ';
            __TMP__ = {
                'class': ''
            };
            __RESULT__ += '<div';
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
                        __RESULT__ += ' ' + 'class' + (__STR__ ? '="' + __STR__ + '"' : '');
                    }
                }
            }
            __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>';
            __RESULT__ += '</div>';
            return __RESULT__;
        };
        Snakeskin.cache["syntax_index8"] = this.syntax_index8; /* Snakeskin template. */
    }
}).call(this);
