/* Snakeskin v7.0.0, key <["umd","tpls",null,false,"\\n",false,null,"stringConcat",true,null,true,"i18n",null,["{{","}}"],"bem",{"global":["html","undef"],"local":["undef"]},true]>, label <1454444946116>, includes <>, generated at <1454447473233>.
   This code is generated automatically, don't alter it. */
(function(global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        factory(exports, typeof Snakeskin === 'undefined' ? require('snakeskin') : Snakeskin);
        return;
    }
    if (typeof define === 'function' && define.amd) {
        define('tpls', ['exports', 'Snakeskin'], factory);
        return;
    }
    factory(global, Snakeskin);
})(this, function(exports, Snakeskin) {
    'use strict';
    var __FILTERS__ = Snakeskin.Filters,
        __VARS__ = Snakeskin.Vars,
        __LOCAL__ = Snakeskin.LocalVars,
        __REQUIRE__;

    function __LENGTH__(val) {
        if (val[0] instanceof Snakeskin.Node) {
            return val[0].length();
        }
        if (typeof val === 'string' || {}.toString.call(val) === '[object Array]') {
            return val;
        }
        return 1;
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
    __LOCAL__.$__0_0_420d2 = undefined; /* Snakeskin template: demo.helloWorld; name  */
    if (exports.demo == null) {
        exports.demo = {};
    }
    var demo = exports.demo;
    exports.demo.helloWorld = Snakeskin.decorate([], function helloWorld(name) {
        var __THIS__ = this;
        var callee = exports.demo.helloWorld,
            self = callee.Blocks = {};
        var __RESULT__ = '',
            __STRING_RESULT__;
        var __ATTR_STR__, __ATTR_TMP__, __ATTR_TYPE__, __ATTR_CACHE__, __ATTR_CONCAT_MAP__;
        var __INLINE_TAGS__ = Snakeskin.inlineTags,
            __INLINE_TAG__;
        var $0 = undefined;

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
        var __RETURN__ = false,
            __RETURN_VAL__;
        var TPL_NAME = "demo.helloWorld",
            PARENT_TPL_NAME;
        name = name != null ? name : 'world';
        var ____TAG___tag_254 = ('div').trim() || 'div';
        if (____TAG___tag_254 !== '?') {
            __RESULT__ += '<' + ____TAG___tag_254;
        }
        var ____ATTR_CACHE___tag_254 = {};
        __ATTR_CONCAT_MAP__ = {
            'class': true
        };
        ____ATTR_CACHE___tag_254['class'] = ['hello'].concat(____ATTR_CACHE___tag_254['class'] || []);
        if (typeof ____TAG___tag_254 === 'undefined' || ____TAG___tag_254 !== '?') {
            Snakeskin.forEach(____ATTR_CACHE___tag_254, function(el, key) {
                var attr = el[0] === TRUE ? TRUE : el.join(' ');
                __RESULT__ += ' ' + key + (attr === TRUE ? '' : '="' + __ESCAPE_D_Q__(attr) + '"');
            });
        }
        __ATTR_CONCAT_MAP__ = undefined;
        if (____TAG___tag_254 !== '?') {
            if (false && (!__INLINE_TAGS__[____TAG___tag_254] || __INLINE_TAGS__[____TAG___tag_254] === true)) {
                __RESULT__ += '>';
            } else if (__INLINE_TAGS__[____TAG___tag_254] && __INLINE_TAGS__[____TAG___tag_254] !== true) {
                var ____CALL_CACHE___tag_254 = __RESULT__;
                __RESULT__ = '';
            } else {
                __RESULT__ += '>';
            }
        }
        __RESULT__ += 'Hello ';
        __RESULT__ += __FILTERS__['htmlObject']((__LOCAL__.$__0_0_420d2 = __FILTERS__['html'].call(this, (__LOCAL__.$__0_0_420d2 = __FILTERS__['attr'].call(this, ((__LOCAL__.$__0_0_420d2 = __FILTERS__['undef'](name))), 'undefined', __ATTR_TYPE__, ____ATTR_CACHE___tag_254, TRUE, FALSE)), Unsafe, __ATTR_TYPE__, ____ATTR_CACHE___tag_254, TRUE)));
        __RESULT__ += '!';
        if (____TAG___tag_254 !== '?') {
            if (__INLINE_TAGS__[____TAG___tag_254] && __INLINE_TAGS__[____TAG___tag_254] !== true) {
                var ____CALL_TMP___tag_305 = __RESULT__ instanceof Raw ? __RESULT__.value : __RESULT__;
                __RESULT__ = ____CALL_CACHE___tag_254;
                if (__INLINE_TAGS__[____TAG___tag_254] in ____ATTR_CACHE___tag_254 === false) {
                    __RESULT__ += ' ' + __INLINE_TAGS__[____TAG___tag_254] + '="' + __FILTERS__['htmlObject']((__LOCAL__.$__0_0_420d2 = __FILTERS__['html'].call(this, (__LOCAL__.$__0_0_420d2 = __FILTERS__['attr'].call(this, ((__LOCAL__.$__0_0_420d2 = __FILTERS__['undef'](____CALL_TMP___tag_305))), 'undefined', __ATTR_TYPE__, ____ATTR_CACHE___tag_254, TRUE, FALSE)), Unsafe, __ATTR_TYPE__, ____ATTR_CACHE___tag_254, TRUE))) + '"';
                }
                __RESULT__ += '>';
            } else if (true) {
                __RESULT__ += '</' + ____TAG___tag_254 + '>';
            }
        }
        return __RESULT__ instanceof Raw ? __RESULT__.value : __RESULT__;
    });
    Snakeskin.cache["demo.helloWorld"] = exports.demo.helloWorld; /* Snakeskin template. */
});
