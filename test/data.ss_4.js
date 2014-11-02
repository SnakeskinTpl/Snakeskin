/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,true,,stringBuffer,true,true,true,,true,true,i18n>, label <1413886610338>, includes <>, generated at <1414919439176>.
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
        var $_ = __LOCAL__['$_e59ad']; /* Snakeskin template: data_index;  */
        this.data_index = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.data_index,
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
            var TPL_NAME = "data_index",
                PARENT_TPL_NAME;
            a = ' foo ';
            __RESULT__.push('{a: "' + __FILTERS__.html(($_ = __FILTERS__['ucfirst'].call(this, ($_ = __FILTERS__['trim'].call(this, __FILTERS__.undef(a))))), false, false) + '"}');
            __RESULT__.push(' ');
            __RESULT__.push('{{' + __FILTERS__.html(($_ = __FILTERS__['ucfirst'].call(this, ($_ = __FILTERS__['trim'].call(this, __FILTERS__.undef(a))))), false, false) + '}}');
            __RESULT__.push(' ');
            __RESULT__.push('{= {a: "${a|trim|ucfirst}"}}{{${a|trim|ucfirst}}} ');
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache["data_index"] = this.data_index; /* Snakeskin template. */ /* Snakeskin template: data_index2;  */
        this.data_index2 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.data_index2,
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
            var TPL_NAME = "data_index2",
                PARENT_TPL_NAME;
            __RESULT__.push('#{1}\\\\' + __FILTERS__.html(1, false, false) + '');
            __RESULT__.push(' ');
            return __RESULT__.join('');
        };
        Snakeskin.cache["data_index2"] = this.data_index2; /* Snakeskin template. */ /* Snakeskin template: data_index3;  */
        this.data_index3 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.data_index3,
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
            var TPL_NAME = "data_index3",
                PARENT_TPL_NAME;
            __RESULT__.push('{ foo: ' + __FILTERS__.html(1 + 2, false, false) + ' }');
            __RESULT__.push(' ');
            return __RESULT__.join('');
        };
        Snakeskin.cache["data_index3"] = this.data_index3; /* Snakeskin template. */ /* Snakeskin template: data_index4;  */
        this.data_index4 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.data_index4,
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
            var TPL_NAME = "data_index4",
                PARENT_TPL_NAME;
            __RESULT__.push('{ ' + __FILTERS__.html(1 + 2, false, false) + ' }');
            __RESULT__.push(' 121');
            return __RESULT__.join('');
        };
        Snakeskin.cache["data_index4"] = this.data_index4; /* Snakeskin template. */ /* Snakeskin template: data_decl;  */
        this.data_decl = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.data_decl,
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
            var TPL_NAME = "data_decl",
                PARENT_TPL_NAME;
            foo = 'bar';
            __RESULT__.push('{{foo}}');
            __RESULT__.push(' ');
            __RESULT__.push('{{' + __FILTERS__.html(__FILTERS__.undef(foo), false, false) + '}}');
            __RESULT__.push(' ');
            __RESULT__.push('{{' + __FILTERS__.html(__FILTERS__.undef(foo), false, false) + '}}');
            __RESULT__.push(' ');
            var foo;
            return __RESULT__.join('');
        };
        Snakeskin.cache["data_decl"] = this.data_decl; /* Snakeskin template. */
    }
}).call(this);
