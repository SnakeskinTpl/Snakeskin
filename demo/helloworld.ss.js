/* Snakeskin v7.0.0, key <["umd","tpls",null,false,"\\n",false,null,"stringConcat",true,null,true,"i18n",null,["{{","}}"],"bem",{"global":["html","undef"],"local":["undef"]},true]>, label <1453201294739>, includes <>, generated at <1453201378300>.
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
        __LOCAL__ = Snakeskin.LocalVars;

    function __LENGTH__(val) {
        if (typeof Node === 'function' && val[0] instanceof Node === true) {
            return val[0].childNodes.length;
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

    function Data(val) {
        if (!this || this.constructor !== Data) {
            return new Data(val);
        }
        this.value = val;
    }
    Data.prototype.push = function(val) {
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
    __LOCAL__.$__0_0_c2dc7 = undefined; /* Snakeskin template: helloWorld; name  */
    var helloWorld = exports.helloWorld = Snakeskin.decorate([], function helloWorld(name) {
        var __THIS__ = this;
        var callee = exports.helloWorld,
            self = callee.Blocks = {};
        var __RESULT__ = '',
            __STRING_RESULT__;
        var __ATTR_POS__, __ATTR_STR__, __ATTR_TMP__, __ATTR_TYPE__, __ATTR_CACHE__, __ATTR_CONCAT_MAP__;
        var __INLINE_TAGS__ = Snakeskin.inlineTags,
            __INLINE_TAG__;
        var $0 = undefined;

        function getTplResult(opt_clear) {
            var res = __RESULT__ instanceof Data ? __RESULT__.value : __RESULT__;
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
        var TPL_NAME = "helloWorld",
            PARENT_TPL_NAME;
        name = name != null ? name : 'world';
        __RESULT__ += 'Hello ';
        __RESULT__ += __FILTERS__['htmlObject']((__LOCAL__.$__0_0_c2dc7 = __FILTERS__['undef'].call(this, (__LOCAL__.$__0_0_c2dc7 = __FILTERS__['html'].call(this, (__LOCAL__.$__0_0_c2dc7 = __FILTERS__['undef'](name)), Unsafe, __ATTR_TYPE__)))));
        __RESULT__ += '! ';
        return __RESULT__ instanceof Data ? __RESULT__.value : __RESULT__;
    });
    Snakeskin.cache["helloWorld"] = exports.helloWorld; /* Snakeskin template. */
});
