/* Snakeskin v6.5.21, key <default,false,\n,xml,false,false,,stringConcat,true,true,true,,false,true,i18n,bem,true>, label <1420975710654>, includes <>, generated at <1421479907753>.
   This code is generated automatically, don't alter it. */
(function() {
    'use strict';
    var __IS_NODE__ = false,
        __AMD__ = typeof define === 'function' && define.amd,
        __HAS_EXPORTS__ = typeof exports !== 'undefined',
        __EXPORTS__ = __HAS_EXPORTS__ ? exports : __AMD__ ? {} : this;
    try {
        __IS_NODE__ = typeof process === 'object' && Object.prototype.toString.call(process) === '[object process]';
    } catch (ignore) {}
    var Snakeskin = (__IS_NODE__ ? global : this).Snakeskin;

    function __INIT__(obj) {
        Snakeskin = Snakeskin || (obj instanceof Object ? obj : void 0);
        if (__HAS_EXPORTS__) {
            delete __EXPORTS__.init;
        }
        if (__AMD__) {
            define(['Snakeskin'], function(ss) {
                Snakeskin = Snakeskin || ss;
                __EXEC__.call(__EXPORTS__);
                return __EXPORTS__;
            });
        } else {
            if (__IS_NODE__) {
                Snakeskin = Snakeskin || require(obj);
            }
            __EXEC__.call(__EXPORTS__);
            return __EXPORTS__;
        }
    }
    if (__HAS_EXPORTS__) {
        __EXPORTS__.init = __INIT__;
    }

    function __EXEC__() {
        var __ROOT__ = this,
            self = this;
        var __APPEND__ = Snakeskin.appendChild,
            __FILTERS__ = Snakeskin.Filters,
            __VARS__ = Snakeskin.Vars,
            __LOCAL__ = Snakeskin.LocalVars;
        __LOCAL__.$__0_4806f = void 0; /* Snakeskin template: helloWorld; name  */
        var helloWorld = this.helloWorld = function helloWorld(name) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.helloWorld,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $0;

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
            var TPL_NAME = "helloWorld",
                PARENT_TPL_NAME;
            name = name != null ? name : 'world';
            __RESULT__ += '<h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name), false, false);
            __RESULT__ += '!</h1> ';
            return __RESULT__;
        };
        Snakeskin.cache["helloWorld"] = this.helloWorld; /* Snakeskin template. */
    }
    if (!__IS_NODE__ && !__HAS_EXPORTS__) {
        __INIT__();
    }
}).call(this);

