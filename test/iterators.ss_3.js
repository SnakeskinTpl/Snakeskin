/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,false,,stringBuffer,true,true,true,,true,true,i18n>, label <1413886610349>, includes <>, generated at <1414827000740>.
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
        var $_ = __LOCAL__['$_290ca']; /* Snakeskin template: iterators_index1;  */
        this.iterators_index1 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.iterators_index1,
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
            var TPL_NAME = "iterators_index1",
                PARENT_TPL_NAME;
            Snakeskin.forEach([1, 2, 3], function(__el__forEach_89, __i__forEach_89, __obj__forEach_89, __isFirst__forEach_89, __isLast__forEach_89, __length__forEach_89) {
                var __ARGUMENTS__ = arguments;
                var __arguments__forEach_89 = __ARGUMENTS__;
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forEach_89), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__i__forEach_89), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__obj__forEach_89[__i__forEach_89]), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_89), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isLast__forEach_89), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__length__forEach_89), false, false));
                __RESULT__.push(' — ');
            });
            return __RESULT__.join('');
        };
        Snakeskin.cache["iterators_index1"] = this.iterators_index1; /* Snakeskin template. */ /* Snakeskin template: iterators_index2;  */
        this.iterators_index2 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.iterators_index2,
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
            var TPL_NAME = "iterators_index2",
                PARENT_TPL_NAME;
            Snakeskin.forEach(({
                a: 1,
                b: 2
            }), function(__el__forEach_254, __key__forEach_254, __obj__forEach_254, __i__forEach_254, __isFirst__forEach_254, __isLast__forEach_254, __length__forEach_254) {
                var __ARGUMENTS__ = arguments;
                var __arguments__forEach_254 = __ARGUMENTS__;
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forEach_254), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__key__forEach_254), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__obj__forEach_254[__key__forEach_254]), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__i__forEach_254), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_254), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isLast__forEach_254), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__length__forEach_254), false, false));
                __RESULT__.push(' — ');
            });
            return __RESULT__.join('');
        };
        Snakeskin.cache["iterators_index2"] = this.iterators_index2; /* Snakeskin template. */ /* Snakeskin template: iterators_index3;  */
        this.iterators_index3 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.iterators_index3,
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
            var TPL_NAME = "iterators_index3",
                PARENT_TPL_NAME;
            a = Object.create(({
                a: 1
            }));
            Snakeskin.forIn(a, function(__el__forIn_444, __key__forIn_444, __obj__forIn_444, __i__forIn_444, __isFirst__forIn_444, __isLast__forIn_444, __length__forIn_444) {
                var __ARGUMENTS__ = arguments;
                var __arguments__forIn_444 = __ARGUMENTS__;
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forIn_444), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__key__forIn_444), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__obj__forIn_444[__key__forIn_444]), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__i__forIn_444), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isFirst__forIn_444), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isLast__forIn_444), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__length__forIn_444), false, false));
                __RESULT__.push(' — ');
            });
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache["iterators_index3"] = this.iterators_index3; /* Snakeskin template. */ /* Snakeskin template: iterators_index4;  */
        this.iterators_index4 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.iterators_index4,
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
            var TPL_NAME = "iterators_index4",
                PARENT_TPL_NAME;
            Snakeskin.forEach([1, 2, 3], function(__el__forEach_609, __i__forEach_609, __obj__forEach_609, __isFirst__forEach_609, __isLast__forEach_609, __length__forEach_609) {
                var __ARGUMENTS__ = arguments;
                var __arguments__forEach_609 = __ARGUMENTS__;
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forEach_609), false, false));
                __RESULT__.push(' ');
                return;
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__i__forEach_609), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__obj__forEach_609[__i__forEach_609]), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_609), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isLast__forEach_609), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__length__forEach_609), false, false));
                __RESULT__.push(' — ');
            });
            return __RESULT__.join('');
        };
        Snakeskin.cache["iterators_index4"] = this.iterators_index4; /* Snakeskin template. */ /* Snakeskin template: iterators_index5;  */
        this.iterators_index5 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.iterators_index5,
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
            var TPL_NAME = "iterators_index5",
                PARENT_TPL_NAME;
            Snakeskin.forEach(({
                a: 1,
                b: 2
            }), function(__el__forEach_791, __key__forEach_791, __obj__forEach_791, __i__forEach_791, __isFirst__forEach_791, __isLast__forEach_791, __length__forEach_791) {
                var __ARGUMENTS__ = arguments;
                var __arguments__forEach_791 = __ARGUMENTS__;
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forEach_791), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__key__forEach_791), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__obj__forEach_791[__key__forEach_791]), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__i__forEach_791), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_791), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isLast__forEach_791), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__length__forEach_791), false, false));
                __RESULT__.push(' — ');
                return false;
            });
            return __RESULT__.join('');
        };
        Snakeskin.cache["iterators_index5"] = this.iterators_index5; /* Snakeskin template. */ /* Snakeskin template: iterators_index6;  */
        this.iterators_index6 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.iterators_index6,
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
            var TPL_NAME = "iterators_index6",
                PARENT_TPL_NAME;
            a = Object.create(({
                a: 1
            }));
            Snakeskin.forIn(a, function(__el__forIn_992, __key__forIn_992, __obj__forIn_992, __i__forIn_992, __isFirst__forIn_992, __isLast__forIn_992, __length__forIn_992) {
                var __ARGUMENTS__ = arguments;
                var __arguments__forIn_992 = __ARGUMENTS__;
                return false;
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forIn_992), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__key__forIn_992), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__obj__forIn_992[__key__forIn_992]), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__i__forIn_992), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isFirst__forIn_992), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isLast__forIn_992), false, false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__length__forIn_992), false, false));
                __RESULT__.push(' — ');
            });
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache["iterators_index6"] = this.iterators_index6; /* Snakeskin template. */
    }
}).call(this);
