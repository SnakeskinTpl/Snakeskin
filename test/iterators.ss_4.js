/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,true,,stringBuffer,true,true,true,,true,true,i18n>, label <1413886610349>, includes <>, generated at <1414919439324>.
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
        var $_ = __LOCAL__['$_d6d8d']; /* Snakeskin template: iterators_index1;  */
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
            var ____I_OBJ____forEach_89 = [1, 2, 3];
            if (____I_OBJ____forEach_89) {
                if (Array.isArray(____I_OBJ____forEach_89)) {
                    var ____LENGTH____forEach_89 = ____I_OBJ____forEach_89.length;
                    for (var ____I____forEach_89 = -1; ++____I____forEach_89 < ____LENGTH____forEach_89;) {
                        var __el__forEach_89 = ____I_OBJ____forEach_89[____I____forEach_89];
                        var __i__forEach_89 = ____I____forEach_89;
                        var __obj__forEach_89 = ____I_OBJ____forEach_89;
                        var __isFirst__forEach_89 = ____I____forEach_89 === 0;
                        var __isLast__forEach_89 = ____I____forEach_89 === ____LENGTH____forEach_89 - 1;
                        var __length__forEach_89 = ____LENGTH____forEach_89;
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
                    }
                } else {
                    var ____KEYS____forEach_89 = Object.keys ? Object.keys(____I_OBJ____forEach_89) : null;
                    var ____LENGTH____forEach_89 = ____KEYS____forEach_89 ? ____KEYS____forEach_89.length : 0;
                    if (!____KEYS____forEach_89) {
                        var ____LENGTH____forEach_89 = 0;
                        for (var ____KEY____forEach_89 = void 0 in ____I_OBJ____forEach_89) {
                            if (!____I_OBJ____forEach_89.hasOwnProperty(____KEY____forEach_89)) {
                                continue;
                            }
                            ____LENGTH____forEach_89++;
                        }
                    }
                    if (____KEYS____forEach_89) {
                        var ____LENGTH____forEach_89 = ____KEYS____forEach_89.length;
                        for (var ____I____forEach_89 = -1; ++____I____forEach_89 < ____LENGTH____forEach_89;) {
                            var __el__forEach_89 = ____I_OBJ____forEach_89[____KEYS____forEach_89[____I____forEach_89]];
                            var __i__forEach_89 = ____KEYS____forEach_89[____I____forEach_89];
                            var __obj__forEach_89 = ____I_OBJ____forEach_89;
                            var __isFirst__forEach_89 = ____I____forEach_89;
                            var __isLast__forEach_89 = ____I____forEach_89 === 0;
                            var __length__forEach_89 = ____I____forEach_89 === ____LENGTH____forEach_89 - 1;
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
                        }
                    } else {
                        var ____I____forEach_89 = -1;
                        for (var ____KEY____forEach_89 = void 0 in ____I_OBJ____forEach_89) {
                            if (!____I_OBJ____forEach_89.hasOwnProperty(____KEY____forEach_89)) {
                                continue;
                            }
                            ____I____forEach_89++;
                            var __el__forEach_89 = ____I_OBJ____forEach_89[____KEY____forEach_89];
                            var __i__forEach_89 = ____KEY____forEach_89;
                            var __obj__forEach_89 = ____I_OBJ____forEach_89;
                            var __isFirst__forEach_89 = ____I____forEach_89;
                            var __isLast__forEach_89 = ____I____forEach_89 === 0;
                            var __length__forEach_89 = ____I____forEach_89 === ____LENGTH____forEach_89 - 1;
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
                        }
                    }
                }
            }
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
            var ____I_OBJ____forEach_254 = ({
                a: 1,
                b: 2
            });
            if (____I_OBJ____forEach_254) {
                if (Array.isArray(____I_OBJ____forEach_254)) {
                    var ____LENGTH____forEach_254 = ____I_OBJ____forEach_254.length;
                    for (var ____I____forEach_254 = -1; ++____I____forEach_254 < ____LENGTH____forEach_254;) {
                        var __el__forEach_254 = ____I_OBJ____forEach_254[____I____forEach_254];
                        var __key__forEach_254 = ____I____forEach_254;
                        var __obj__forEach_254 = ____I_OBJ____forEach_254;
                        var __i__forEach_254 = ____I____forEach_254 === 0;
                        var __isFirst__forEach_254 = ____I____forEach_254 === ____LENGTH____forEach_254 - 1;
                        var __isLast__forEach_254 = ____LENGTH____forEach_254;
                        var __length__forEach_254 = void 0;
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
                    }
                } else {
                    var ____KEYS____forEach_254 = Object.keys ? Object.keys(____I_OBJ____forEach_254) : null;
                    var ____LENGTH____forEach_254 = ____KEYS____forEach_254 ? ____KEYS____forEach_254.length : 0;
                    if (!____KEYS____forEach_254) {
                        var ____LENGTH____forEach_254 = 0;
                        for (var ____KEY____forEach_254 = void 0 in ____I_OBJ____forEach_254) {
                            if (!____I_OBJ____forEach_254.hasOwnProperty(____KEY____forEach_254)) {
                                continue;
                            }
                            ____LENGTH____forEach_254++;
                        }
                    }
                    if (____KEYS____forEach_254) {
                        var ____LENGTH____forEach_254 = ____KEYS____forEach_254.length;
                        for (var ____I____forEach_254 = -1; ++____I____forEach_254 < ____LENGTH____forEach_254;) {
                            var __el__forEach_254 = ____I_OBJ____forEach_254[____KEYS____forEach_254[____I____forEach_254]];
                            var __key__forEach_254 = ____KEYS____forEach_254[____I____forEach_254];
                            var __obj__forEach_254 = ____I_OBJ____forEach_254;
                            var __i__forEach_254 = ____I____forEach_254;
                            var __isFirst__forEach_254 = ____I____forEach_254 === 0;
                            var __isLast__forEach_254 = ____I____forEach_254 === ____LENGTH____forEach_254 - 1;
                            var __length__forEach_254 = ____LENGTH____forEach_254;
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
                        }
                    } else {
                        var ____I____forEach_254 = -1;
                        for (var ____KEY____forEach_254 = void 0 in ____I_OBJ____forEach_254) {
                            if (!____I_OBJ____forEach_254.hasOwnProperty(____KEY____forEach_254)) {
                                continue;
                            }
                            ____I____forEach_254++;
                            var __el__forEach_254 = ____I_OBJ____forEach_254[____KEY____forEach_254];
                            var __key__forEach_254 = ____KEY____forEach_254;
                            var __obj__forEach_254 = ____I_OBJ____forEach_254;
                            var __i__forEach_254 = ____I____forEach_254;
                            var __isFirst__forEach_254 = ____I____forEach_254 === 0;
                            var __isLast__forEach_254 = ____I____forEach_254 === ____LENGTH____forEach_254 - 1;
                            var __length__forEach_254 = ____LENGTH____forEach_254;
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
                        }
                    }
                }
            }
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
            var ____I_OBJ____forIn_444 = a;
            if (____I_OBJ____forIn_444) {
                var ____LENGTH____forIn_444 = 0;
                for (var __key__forIn_444 = void 0 in ____I_OBJ____forIn_444) {
                    ____LENGTH____forIn_444++;
                }
                var ____I____forIn_444 = -1;
                for (var ____KEY____forIn_444 = void 0 in ____I_OBJ____forIn_444) {
                    ____I____forIn_444++;
                    var __el__forIn_444 = ____I_OBJ____forIn_444[____KEY____forIn_444];
                    var __key__forIn_444 = ____KEY____forIn_444;
                    var __obj__forIn_444 = ____I_OBJ____forIn_444;
                    var __i__forIn_444 = ____I____forIn_444;
                    var __isFirst__forIn_444 = ____I____forIn_444 === 0;
                    var __isLast__forIn_444 = ____I____forIn_444 === ____LENGTH____forIn_444 - 1;
                    var __length__forIn_444 = ____LENGTH____forIn_444;
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
                }
            }
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
            var ____I_OBJ____forEach_609 = [1, 2, 3];
            if (____I_OBJ____forEach_609) {
                if (Array.isArray(____I_OBJ____forEach_609)) {
                    var ____LENGTH____forEach_609 = ____I_OBJ____forEach_609.length;
                    for (var ____I____forEach_609 = -1; ++____I____forEach_609 < ____LENGTH____forEach_609;) {
                        var __el__forEach_609 = ____I_OBJ____forEach_609[____I____forEach_609];
                        var __i__forEach_609 = ____I____forEach_609;
                        var __obj__forEach_609 = ____I_OBJ____forEach_609;
                        var __isFirst__forEach_609 = ____I____forEach_609 === 0;
                        var __isLast__forEach_609 = ____I____forEach_609 === ____LENGTH____forEach_609 - 1;
                        var __length__forEach_609 = ____LENGTH____forEach_609;
                        __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forEach_609), false, false));
                        __RESULT__.push(' ');
                        continue;
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
                    }
                } else {
                    var ____KEYS____forEach_609 = Object.keys ? Object.keys(____I_OBJ____forEach_609) : null;
                    var ____LENGTH____forEach_609 = ____KEYS____forEach_609 ? ____KEYS____forEach_609.length : 0;
                    if (!____KEYS____forEach_609) {
                        var ____LENGTH____forEach_609 = 0;
                        for (var ____KEY____forEach_609 = void 0 in ____I_OBJ____forEach_609) {
                            if (!____I_OBJ____forEach_609.hasOwnProperty(____KEY____forEach_609)) {
                                continue;
                            }
                            ____LENGTH____forEach_609++;
                        }
                    }
                    if (____KEYS____forEach_609) {
                        var ____LENGTH____forEach_609 = ____KEYS____forEach_609.length;
                        for (var ____I____forEach_609 = -1; ++____I____forEach_609 < ____LENGTH____forEach_609;) {
                            var __el__forEach_609 = ____I_OBJ____forEach_609[____KEYS____forEach_609[____I____forEach_609]];
                            var __i__forEach_609 = ____KEYS____forEach_609[____I____forEach_609];
                            var __obj__forEach_609 = ____I_OBJ____forEach_609;
                            var __isFirst__forEach_609 = ____I____forEach_609;
                            var __isLast__forEach_609 = ____I____forEach_609 === 0;
                            var __length__forEach_609 = ____I____forEach_609 === ____LENGTH____forEach_609 - 1;
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forEach_609), false, false));
                            __RESULT__.push(' ');
                            continue;
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
                        }
                    } else {
                        var ____I____forEach_609 = -1;
                        for (var ____KEY____forEach_609 = void 0 in ____I_OBJ____forEach_609) {
                            if (!____I_OBJ____forEach_609.hasOwnProperty(____KEY____forEach_609)) {
                                continue;
                            }
                            ____I____forEach_609++;
                            var __el__forEach_609 = ____I_OBJ____forEach_609[____KEY____forEach_609];
                            var __i__forEach_609 = ____KEY____forEach_609;
                            var __obj__forEach_609 = ____I_OBJ____forEach_609;
                            var __isFirst__forEach_609 = ____I____forEach_609;
                            var __isLast__forEach_609 = ____I____forEach_609 === 0;
                            var __length__forEach_609 = ____I____forEach_609 === ____LENGTH____forEach_609 - 1;
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forEach_609), false, false));
                            __RESULT__.push(' ');
                            continue;
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
                        }
                    }
                }
            }
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
            var ____I_OBJ____forEach_791 = ({
                a: 1,
                b: 2
            });
            if (____I_OBJ____forEach_791) {
                if (Array.isArray(____I_OBJ____forEach_791)) {
                    var ____LENGTH____forEach_791 = ____I_OBJ____forEach_791.length;
                    for (var ____I____forEach_791 = -1; ++____I____forEach_791 < ____LENGTH____forEach_791;) {
                        var __el__forEach_791 = ____I_OBJ____forEach_791[____I____forEach_791];
                        var __key__forEach_791 = ____I____forEach_791;
                        var __obj__forEach_791 = ____I_OBJ____forEach_791;
                        var __i__forEach_791 = ____I____forEach_791 === 0;
                        var __isFirst__forEach_791 = ____I____forEach_791 === ____LENGTH____forEach_791 - 1;
                        var __isLast__forEach_791 = ____LENGTH____forEach_791;
                        var __length__forEach_791 = void 0;
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
                        break;
                    }
                } else {
                    var ____KEYS____forEach_791 = Object.keys ? Object.keys(____I_OBJ____forEach_791) : null;
                    var ____LENGTH____forEach_791 = ____KEYS____forEach_791 ? ____KEYS____forEach_791.length : 0;
                    if (!____KEYS____forEach_791) {
                        var ____LENGTH____forEach_791 = 0;
                        for (var ____KEY____forEach_791 = void 0 in ____I_OBJ____forEach_791) {
                            if (!____I_OBJ____forEach_791.hasOwnProperty(____KEY____forEach_791)) {
                                continue;
                            }
                            ____LENGTH____forEach_791++;
                        }
                    }
                    if (____KEYS____forEach_791) {
                        var ____LENGTH____forEach_791 = ____KEYS____forEach_791.length;
                        for (var ____I____forEach_791 = -1; ++____I____forEach_791 < ____LENGTH____forEach_791;) {
                            var __el__forEach_791 = ____I_OBJ____forEach_791[____KEYS____forEach_791[____I____forEach_791]];
                            var __key__forEach_791 = ____KEYS____forEach_791[____I____forEach_791];
                            var __obj__forEach_791 = ____I_OBJ____forEach_791;
                            var __i__forEach_791 = ____I____forEach_791;
                            var __isFirst__forEach_791 = ____I____forEach_791 === 0;
                            var __isLast__forEach_791 = ____I____forEach_791 === ____LENGTH____forEach_791 - 1;
                            var __length__forEach_791 = ____LENGTH____forEach_791;
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
                            break;
                        }
                    } else {
                        var ____I____forEach_791 = -1;
                        for (var ____KEY____forEach_791 = void 0 in ____I_OBJ____forEach_791) {
                            if (!____I_OBJ____forEach_791.hasOwnProperty(____KEY____forEach_791)) {
                                continue;
                            }
                            ____I____forEach_791++;
                            var __el__forEach_791 = ____I_OBJ____forEach_791[____KEY____forEach_791];
                            var __key__forEach_791 = ____KEY____forEach_791;
                            var __obj__forEach_791 = ____I_OBJ____forEach_791;
                            var __i__forEach_791 = ____I____forEach_791;
                            var __isFirst__forEach_791 = ____I____forEach_791 === 0;
                            var __isLast__forEach_791 = ____I____forEach_791 === ____LENGTH____forEach_791 - 1;
                            var __length__forEach_791 = ____LENGTH____forEach_791;
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
                            break;
                        }
                    }
                }
            }
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
            var ____I_OBJ____forIn_992 = a;
            if (____I_OBJ____forIn_992) {
                var ____LENGTH____forIn_992 = 0;
                for (var __key__forIn_992 = void 0 in ____I_OBJ____forIn_992) {
                    ____LENGTH____forIn_992++;
                }
                var ____I____forIn_992 = -1;
                for (var ____KEY____forIn_992 = void 0 in ____I_OBJ____forIn_992) {
                    ____I____forIn_992++;
                    var __el__forIn_992 = ____I_OBJ____forIn_992[____KEY____forIn_992];
                    var __key__forIn_992 = ____KEY____forIn_992;
                    var __obj__forIn_992 = ____I_OBJ____forIn_992;
                    var __i__forIn_992 = ____I____forIn_992;
                    var __isFirst__forIn_992 = ____I____forIn_992 === 0;
                    var __isLast__forIn_992 = ____I____forIn_992 === ____LENGTH____forIn_992 - 1;
                    var __length__forIn_992 = ____LENGTH____forIn_992;
                    break;
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
                }
            }
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache["iterators_index6"] = this.iterators_index6; /* Snakeskin template. */
    }
}).call(this);
