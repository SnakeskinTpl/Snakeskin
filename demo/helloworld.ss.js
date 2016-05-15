/* Snakeskin v7.0.0, key <[false,"umd","tpls",null,false,"\\n",false,null,"stringConcat",true,null,true,"i18n",null,["{{","}}"],"bem",{"global":["html","undef"],"local":["undef"]},true]>, label <1463304108453>, includes <>, generated at <1463304109512>.
   This code is generated automatically, don't alter it. */
(function(global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        factory(exports, typeof Snakeskin === 'undefined' ? require('snakeskin') : Snakeskin);
        return;
    }
    if (typeof define === 'function' && define.amd) {
        define('tpls', ['exports', 'Snakeskin' /*#__SNAKESKIN_MODULES_DECL__*/ ], factory);
        return;
    }
    factory(global, Snakeskin);
})(this, function(exports, Snakeskin /*#__SNAKESKIN_MODULES__*/ ) {
    'use strict';
    var GLOBAL = new Function('return this')(),
        __FILTERS__ = Snakeskin.Filters,
        __VARS__ = Snakeskin.Vars,
        __LOCAL__ = Snakeskin.LocalVars,
        __REQUIRE__;

    function __LENGTH__(val) {
        if (val[0] instanceof Snakeskin.Node) {
            return val[0].length();
        }
        if (typeof val === 'string' || Array.isArray(val)) {
            return val.length;
        }
        return 1;
    }

    function __JOIN__(arr) {
        var str = '';
        for (var i = 0; i < arr.length; i++) {
            str += arr[i];
        }
        return str;
    }

    function __ESCAPE_D_Q__(str) {
        return str.replace(/"/g, "&quot;")
    }
    var TRUE = new Boolean(true),
        FALSE = new Boolean(false);

    function Raw(val) {
        if (!this || this.constructor !== Raw) {
            return new Raw(val);
        }
        this.value = val;
    }
    Raw.prototype.push = function(val) {
        this.value += val;
    };

    function Unsafe(val) {
        if (!this || this.constructor !== Unsafe) {
            if (typeof val === 'string') {
                return new Unsafe(val);
            }
            return val;
        }
        this.value = val;
    }
    Unsafe.prototype.toString = function() {
        return this.value;
    };
    __LOCAL__.$__0_0_24d5b = undefined; /* Snakeskin template: demo.helloWorld; name  */
    if (exports.demo instanceof Object === false) {
        exports.demo = {};
    }
    var demo = exports.demo;
    exports.demo.helloWorld = Snakeskin.decorate([], function helloWorld(name) {
        var __THIS__ = this;
        var callee = exports.demo.helloWorld,
            self = callee.Blocks = {};
        var __INLINE_TAGS__ = Snakeskin.inlineTags['undefined'] || Snakeskin.inlineTags['html'],
            __INLINE_TAG__;
        var __STRING_RESULT__;
        var __RESULT__ = '';

        function getTplResult(opt_clear) {
            var res = __RESULT__ instanceof Raw ? __RESULT__.value : __RESULT__;
            if (opt_clear) {
                __RESULT__ = '';
            }
            return res;
        }

        function clearTplResult() {
            __RESULT__ = '';
        }
        var $0 = undefined,
            $class = '';
        var __ATTR_STR__, __ATTR_TYPE__, __ATTR_CACHE__, __ATTR_CONCAT_MAP__ = {
            'class': true
        };

        function __GET_XML_ATTR_KEY_DECL__(val, cache, empty) {
            if (val != null && val !== '') {
                if (!__ATTR_CONCAT_MAP__[val] || !cache[val] || cache[val][0] === TRUE) {
                    cache[val] = [];
                }
                cache[val].push(empty ? TRUE : __ATTR_STR__);
            }
            __ATTR_STR__ = __ATTR_TYPE__ = undefined;
        }

        function __APPEND_XML_ATTR_VAL__(val) {
            __ATTR_STR__ = __ATTR_STR__ + (__ATTR_STR__ ? ' ' : '') + (val != null ? val : '');
        }

        function __GET_XML_ATTRS_DECL_START__(res, link, renderMode, isDOMRenderMode, stringResult) {
            var __RESULT__ = res;
            if (!stringResult && isDOMRenderMode) {
                if (link !== '?') {
                    $0 = new Snakeskin.Element(link, renderMode);
                }
            } else {
                if (link !== '?') {
                    if (stringResult) {
                        __STRING_RESULT__ += '<' + link;
                    } else {
                        __RESULT__ += '<' + link;
                    }
                }
            }
            return __RESULT__;
        }

        function __GET_XML_ATTRS_DECL_END__(res, link, cache, isDOMRenderMode, stringResult, isXMLDoctype) {
            var __RESULT__ = res;
            if (typeof link === 'undefined' || link !== '?') {
                var base = true;
                var set = function(el, key) {
                    if (!base && {
                            'class': true,
                            'id': true
                        }[key]) {
                        return;
                    }
                    var attr = el[0] === TRUE ? isDOMRenderMode || isXMLDoctype ? key : TRUE : el.join(' ');
                    if (stringResult) {
                        __STRING_RESULT__ += ' ' + key + (attr === TRUE ? '' : '="' + __ESCAPE_D_Q__(attr) + '"');
                    } else if (isDOMRenderMode) {
                        Snakeskin.setAttribute($0, key, attr);
                    } else {
                        __RESULT__ += ' ' + key + (attr === TRUE ? '' : '="' + __ESCAPE_D_Q__(attr) + '"');
                    }
                };
                if (cache['id']) {
                    set(cache['id'], 'id');
                }
                if (cache['class']) {
                    set(cache['class'], 'class');
                }
                base = false;
                Snakeskin.forEach(cache, set);
            }
            return __RESULT__;
        }

        function __GET_XML_TAG_DECL_END__(res, link, inline, inlineTag, isDOMRenderMode, stringResult, isXMLDoctype) {
            var __RESULT__ = res;
            if (isDOMRenderMode) {
                if (link !== '?') {
                    __RESULT__ += $0;
                    if (inline && (!inlineTag || inlineTag === true)) {
                        $0 = __RESULT__[__RESULT__.length - 1];
                    } else if (inlineTag && inlineTag !== true) {
                        __RESULT__ = '';
                        $0 = __RESULT__[__RESULT__.length - 1];
                    } else {
                        __RESULT__.push($0);
                    }
                }
            } else {
                if (link !== '?') {
                    if (inline && (!inlineTag || inlineTag === true)) {
                        if (stringResult) {
                            __STRING_RESULT__ += (isXMLDoctype ? '/' : '') + '>';
                        } else {
                            __RESULT__ += (isXMLDoctype ? '/' : '') + '>';
                        }
                    } else if (inlineTag && inlineTag !== true) {
                        __RESULT__ = '';
                    } else {
                        if (stringResult) {
                            __STRING_RESULT__ += '>';
                        } else {
                            __RESULT__ += '>';
                        }
                    }
                }
            }
            return __RESULT__;
        }

        function __GET_END_XML_TAG_DECL__(res, link, inline, inlineTag, attrCache, callCache, callTmp, isDOMRenderMode, stringResult, isXMLDoctype, node) {
            var __RESULT__ = res;
            if (isDOMRenderMode) {
                if (link !== '?') {
                    if (inlineTag) {
                        if (inlineTag !== true) {
                            __RESULT__ = callCache;
                            if (inlineTag in attrCache === false) {
                                Snakeskin.setAttribute(node, inlineTag, callTmp);
                            }
                        }
                    } else if (!inline) {
                        __RESULT__.pop();
                        $0 = __RESULT__[__RESULT__.length - 1];
                    }
                }
            } else {
                if (link !== '?') {
                    if (inlineTag) {
                        if (inlineTag !== true) {
                            __RESULT__ = callCache;
                            if (inlineTag in attrCache === false) {
                                if (stringResult) {
                                    __STRING_RESULT__ += ' ' + inlineTag + '="' + callTmp + '"';
                                } else {
                                    __RESULT__ += ' ' + inlineTag + '="' + callTmp + '"';
                                }
                            }
                            if (stringResult) {
                                __STRING_RESULT__ += (isXMLDoctype ? '/' : '') + '>';
                            } else {
                                __RESULT__ += (isXMLDoctype ? '/' : '') + '>';
                            }
                        }
                    } else if (!inline) {
                        if (stringResult) {
                            __STRING_RESULT__ += '</' + link + '>';
                        } else {
                            __RESULT__ += '</' + link + '>';
                        }
                    }
                }
            }
            return __RESULT__;
        }

        function __TARGET_END__(res, stack, ref) {
            var __RESULT__ = res;
            if (__LENGTH__(__RESULT__)) {
                stack.push({
                    key: undefined,
                    value: Unsafe(__RESULT__ instanceof Raw ? __RESULT__.value : __RESULT__)
                });
            }
            Snakeskin.forEach(stack, function(el) {
                ref[el.key || ref.length] = el.value;
            });
            return __RESULT__;
        }

        function __PUTIN_CALL__(res, pos, stack) {
            var __RESULT__ = res;
            if (pos === true || !pos && __LENGTH__(__RESULT__)) {
                stack.push(Unsafe(__RESULT__ instanceof Raw ? __RESULT__.value : __RESULT__));
                __RESULT__ = '';
            }
            return __RESULT__;
        }

        function __PUTIN_TARGET__(res, pos, stack, key) {
            var __RESULT__ = res;
            if (pos === true || !pos && __LENGTH__(__RESULT__)) {
                stack.push({
                    key: key,
                    value: Unsafe(__RESULT__ instanceof Raw ? __RESULT__.value : __RESULT__)
                });
                __RESULT__ = '';
            }
            return __RESULT__;
        }
        var __RETURN__ = false,
            __RETURN_VAL__;
        var TPL_NAME = "demo.helloWorld",
            PARENT_TPL_NAME;
        name = name != null ? name : 'world';
        $class = 'hello';
        var ____TAG___tag_254 = ('div').trim() || 'div';
        __RESULT__ = __GET_XML_ATTRS_DECL_START__(__RESULT__, ____TAG___tag_254, 'stringConcat', false, false);
        var ____ATTR_CACHE___tag_254 = {};
        ____ATTR_CACHE___tag_254['class'] = ['hello'].concat(____ATTR_CACHE___tag_254['class'] || []);
        __RESULT__ = __GET_XML_ATTRS_DECL_END__(__RESULT__, ____TAG___tag_254, ____ATTR_CACHE___tag_254, false, false, false);
        var ____CALL_CACHE___tag_254 = __RESULT__;
        __RESULT__ = __GET_XML_TAG_DECL_END__(__RESULT__, ____TAG___tag_254, false, __INLINE_TAGS__[____TAG___tag_254], false, false, false);
        __RESULT__ += 'Hello ';
        __RESULT__ += __FILTERS__['htmlObject'](__FILTERS__['undef'].call(this, __FILTERS__['html'].call(this, (__FILTERS__['undef'](name)), Unsafe, __ATTR_TYPE__, __ATTR_CACHE__, TRUE)));
        __RESULT__ += '!';
        $class = '';
        var ____CALL_TMP___tag_307 = __RESULT__ instanceof Raw ? __RESULT__.value : __RESULT__;
        __RESULT__ = __GET_END_XML_TAG_DECL__(__RESULT__, ____TAG___tag_254, false, __INLINE_TAGS__[____TAG___tag_254], ____ATTR_CACHE___tag_254, ____CALL_CACHE___tag_254, ____CALL_TMP___tag_307, false, false, false);
        return __RESULT__ instanceof Raw ? __RESULT__.value : __RESULT__;
    });
    Snakeskin.cache["demo.helloWorld"] = exports.demo.helloWorld; /* Snakeskin template. */
});
