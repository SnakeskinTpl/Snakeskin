/* Snakeskin v6.3.1, key <default,false,
,xml,false,false,,stringConcat,true,true,1,,false,true,i18n>, label <1415185010517>, includes <>, generated at <1415474664875>.
   This code is generated automatically, don't alter it. */
(function() {
    var __IS_NODE__ = false,
        __HAS_EXPORTS__ = typeof exports !== 'undefined',
        __EXPORTS__ = __HAS_EXPORTS__ ? exports : this;
    try {
        __IS_NODE__ = 'object' === typeof process && Object.prototype.toString.call(process) === '[object process]';
    } catch (ignore) {}
    var Snakeskin = (__IS_NODE__ ? global : this).Snakeskin;

    function __INIT__(obj) {
        Snakeskin = Snakeskin || (obj instanceof Object ? obj : void 0);
        if (__HAS_EXPORTS__) {
            delete __EXPORTS__.init;
        }
        if (__IS_NODE__) {
            Snakeskin = Snakeskin || require(obj);
        }
        __EXEC__.call(__EXPORTS__);
        return __EXPORTS__;
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
        var $_ = __LOCAL__['$_bfe99']; /* Snakeskin template: helloWorld; name  */
        this.helloWorld = function(name) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.helloWorld,
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
            var TPL_NAME = "helloWorld",
                PARENT_TPL_NAME;
            name = arguments[0] = name != null ? name : 'world';
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
