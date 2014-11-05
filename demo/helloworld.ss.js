/* Snakeskin v6.1.4, key <global,false,
,xml,false,false,,stringConcat,true,true,1,,false,true,i18n>, label <1415185010517>, includes <>, generated at <1415185012062>.
   This code is generated automatically, don't alter it. */
(function() {
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
    var $_ = __LOCAL__['$_a80cb']; /* Snakeskin template: helloWorld; name  */
    this.helloWorld = function helloWorld(name) {
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
}).call(this);
