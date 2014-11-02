/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,true,,stringConcat,true,true,true,,true,true,i18n>, label <1413959606683>, includes <>, generated at <1414919437856>.
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
        var $_ = __LOCAL__['$_54835']; /* Snakeskin template: escape_index;  */
        this.escape_index = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.escape_index,
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
            var TPL_NAME = "escape_index",
                PARENT_TPL_NAME;
            __STR__ = '';
            __J__ = 0;
            if (('1') != null && ('1') !== '') {
                __STR__ += __J__ ? ' ' + '1' : '1';
                __J__++;
            }
            if (('\\') != null && ('\\') !== '') {
                __STR__ += __J__ ? ' ' + '\\' : '\\';
                __J__++;
            }
            if (('#{foo}') != null && ('#{foo}') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('#{foo}', __STR__);
                } else {
                    __RESULT__ += ' ' + '#{foo}' + (__STR__ ? '="' + __STR__ + '"' : '');
                }
            }
            __STR__ = '';
            __J__ = 0;
            if (('2') != null && ('2') !== '') {
                __STR__ += __J__ ? ' ' + '2' : '2';
                __J__++;
            }
            if (('2') != null && ('2') != '' && (__STR__ || true)) {
                if (__NODE__) {
                    __NODE__.setAttribute('2', __STR__);
                } else {
                    __RESULT__ += ' ' + '2' + (__STR__ ? '="' + __STR__ + '"' : '');
                }
            }
            __RESULT__ += ' ';
            __RESULT__ += '\'' + __FILTERS__.html(2, false, false) + '\'';
            __RESULT__ += ' ';
            __RESULT__ += '\'#{/* 1 + */2}\'';
            __RESULT__ += ' ';
            __STR__ = '';
            __J__ = 0;
            if (('{&quot;b&quot;:') != null && ('{&quot;b&quot;:') !== '') {
                __STR__ += __J__ ? ' ' + '{&quot;b&quot;:' : '{&quot;b&quot;:';
                __J__++;
            }
            if (('\&#39;2\&#39;}') != null && ('\&#39;2\&#39;}') !== '') {
                __STR__ += __J__ ? ' ' + '\&#39;2\&#39;}' : '\&#39;2\&#39;}';
                __J__++;
            }
            if (('a') != null && ('a') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('a', __STR__);
                } else {
                    __RESULT__ += ' ' + 'a' + (__STR__ ? '="' + __STR__ + '"' : '');
                }
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache["escape_index"] = this.escape_index; /* Snakeskin template. */ /* Snakeskin template: escape_index2;  */
        this.escape_index2 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.escape_index2,
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
            var TPL_NAME = "escape_index2",
                PARENT_TPL_NAME;
            __RESULT__ += '{attr a = {«b»: “2”}} /// 1 /* 2 */ \\1 \\« 2 » ';
            return __RESULT__;
        };
        Snakeskin.cache["escape_index2"] = this.escape_index2; /* Snakeskin template. */ /* Snakeskin template: escape_index3;  */
        this.escape_index3 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.escape_index3,
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
            var TPL_NAME = "escape_index3",
                PARENT_TPL_NAME;
            __RESULT__ += '<div ';
            __RESULT__ += __FILTERS__.html('onclick="alert()" foo', true, false);
            __RESULT__ += '="2';
            __RESULT__ += __FILTERS__.html(' bar = 1', true, true);
            __RESULT__ += '"></div> ';
            __STR__ = '';
            __J__ = 0;
            if (('' + __FILTERS__.html('1 hack = 2', true, true) + '') != null && ('' + __FILTERS__.html('1 hack = 2', true, true) + '') !== '') {
                __STR__ += __J__ ? ' ' + '' + __FILTERS__.html('1 hack = 2', true, true) + '' : '' + __FILTERS__.html('1 hack = 2', true, true) + '';
                __J__++;
            }
            if (('' + __FILTERS__.html('foo = 1 bar', true, true) + '') != null && ('' + __FILTERS__.html('foo = 1 bar', true, true) + '') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('' + __FILTERS__.html('foo = 1 bar', true, true) + '', __STR__);
                } else {
                    __RESULT__ += ' ' + '' + __FILTERS__.html('foo = 1 bar', true, true) + '' + (__STR__ ? '="' + __STR__ + '"' : '');
                }
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache["escape_index3"] = this.escape_index3; /* Snakeskin template. */ /* Snakeskin template: escape_index4;  */
        this.escape_index4 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.escape_index4,
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
            var TPL_NAME = "escape_index4",
                PARENT_TPL_NAME;
            __RESULT__ += __FILTERS__.html(typeof /foo["]bar\/\//, false, false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(!/foo/.test('foo')), false, false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(!/foo/.test('foo')) % /[\/]/, false, false);
            __RESULT__ += ' ';
            __RESULT__ += '' + __FILTERS__.html(__FILTERS__.undef(!/foo/.test('foo')), false, false) + '';
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache["escape_index4"] = this.escape_index4; /* Snakeskin template. */ /* Snakeskin template: escape_base['\n\\n\'"helloWorld'];  */
        if (this.escape_base == null) {
            this.escape_base = {};
        }
        this.escape_base['\n\\n\'"helloWorld'] = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.escape_base['\n\\n\'"helloWorld'],
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
            var TPL_NAME = "escape_base['\n\\n\'\"helloWorld']",
                PARENT_TPL_NAME;
            __RESULT__ += '121 ';
            return __RESULT__;
        };
        Snakeskin.cache["escape_base['\n\\n\'\"helloWorld']"] = this.escape_base['\n\\n\'"helloWorld']; /* Snakeskin template. */ /* Snakeskin template: escape_sub;  */
        this.escape_sub = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.escape_sub,
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
            var TPL_NAME = "escape_sub",
                PARENT_TPL_NAME = "escape_base['\n\\n\'\"helloWorld']";
            __RESULT__ += '121 ';
            return __RESULT__;
        };
        Snakeskin.cache["escape_sub"] = this.escape_sub; /* Snakeskin template. */ /* Snakeskin template: escape_index5;  */
        this.escape_index5 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.escape_index5,
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
            var TPL_NAME = "escape_index5",
                PARENT_TPL_NAME;
            __RESULT__ += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> ';
            return __RESULT__;
        };
        Snakeskin.cache["escape_index5"] = this.escape_index5; /* Snakeskin template. */ /* Snakeskin template: escape_index6;  */
        this.escape_index6 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.escape_index6,
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
            var TPL_NAME = "escape_index6",
                PARENT_TPL_NAME;
            __TMP__ = {
                'class': ''
            };
            __RESULT__ += '<meta';
            __STR__ = '';
            __J__ = 0;
            if (('Content-Type') != null && ('Content-Type') !== '') {
                __STR__ += __J__ ? ' ' + 'Content-Type' : 'Content-Type';
                __J__++;
            }
            if (('http-equiv') != null && ('http-equiv') != '' && (__STR__ || false)) {
                if (__TMP__[('http-equiv')] != null) {
                    __TMP__[('http-equiv')] += __STR__;
                } else {
                    if (__NODE__) {
                        __NODE__.setAttribute('http-equiv', __STR__);
                    } else {
                        __RESULT__ += ' ' + 'http-equiv' + (__STR__ ? '="' + __STR__ + '"' : '');
                    }
                }
            }
            __STR__ = '';
            __J__ = 0;
            if (('text&#x2F;html;') != null && ('text&#x2F;html;') !== '') {
                __STR__ += __J__ ? ' ' + 'text&#x2F;html;' : 'text&#x2F;html;';
                __J__++;
            }
            if (('charset=utf-8') != null && ('charset=utf-8') !== '') {
                __STR__ += __J__ ? ' ' + 'charset=utf-8' : 'charset=utf-8';
                __J__++;
            }
            if (('content') != null && ('content') != '' && (__STR__ || false)) {
                if (__TMP__[('content')] != null) {
                    __TMP__[('content')] += __STR__;
                } else {
                    if (__NODE__) {
                        __NODE__.setAttribute('content', __STR__);
                    } else {
                        __RESULT__ += ' ' + 'content' + (__STR__ ? '="' + __STR__ + '"' : '');
                    }
                }
            }
            __RESULT__ += (__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '/>';
            return __RESULT__;
        };
        Snakeskin.cache["escape_index6"] = this.escape_index6; /* Snakeskin template. */
    }
}).call(this);
