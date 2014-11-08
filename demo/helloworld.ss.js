/* Snakeskin v6.3.0, key <default,false,
,xml,false,false,,stringConcat,true,true,1,,false,true,i18n>, label <1415185010517>, includes <>, generated at <1415430072189>.
   This code is generated automatically, don't alter it. */
(function() {
    var IS_NODE = false,
        hasExports = typeof exports !== 'undefined',
        ctx = hasExports ? exports : this;
    try {
        IS_NODE = 'object' === typeof process && Object.prototype.toString.call(process) === '[object process]';
    } catch (ignore) {}
    var Snakeskin = (IS_NODE ? global : this).Snakeskin;

    function init(obj) {
        Snakeskin = Snakeskin || (obj instanceof Object ? obj : void 0);
        if (hasExports) {
            delete exports.init;
        }
        if (IS_NODE) {
            Snakeskin = Snakeskin || require(obj);
        }
        exec.call(ctx);
        return ctx;
    };
    if (hasExports) {
        ctx.init = init;
    }

    function exec() {
        var __ROOT__ = this,
            self = this;
        var __APPEND__ = Snakeskin.appendChild,
            __FILTERS__ = Snakeskin.Filters,
            __VARS__ = Snakeskin.Vars,
            __LOCAL__ = Snakeskin.LocalVars;
        var $_ = __LOCAL__['$_7e353']; /* Snakeskin template: helloWorld; name  */
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

    if (!IS_NODE && !hasExports) {
        init();
    }

}).call(this);
