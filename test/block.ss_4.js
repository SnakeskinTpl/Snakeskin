/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,true,,stringBuffer,true,true,true,,true,true,i18n>, label <1413886610335>, includes <>, generated at <1414919439144>.
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
        var $_ = __LOCAL__['$_7429f']; /* Snakeskin template: block_base;  */
        this.block_base = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.block_base,
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
            var TPL_NAME = "block_base",
                PARENT_TPL_NAME;
            var __a__template_49 = 2,
                __b__template_49 = void 0,
                __c__template_49 = void 0;
            if (!__BLOCKS__.base) {
                __BLOCKS__.base = function(__a__block_83, __b__block_83, __c__block_83) {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    var __ARGUMENTS__ = arguments;
                    var __arguments__block_83 = __ARGUMENTS__;

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
                    __a__block_83 = arguments[0] = __a__block_83 != null ? __a__block_83 : 1;
                    __b__block_83 = arguments[1] = __b__block_83 != null ? __b__block_83 : 2;
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_83), false, false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_83), false, false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_83), false, false));
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(blocks.base(__a__template_49, __b__template_49, __c__template_49));
            if (!__BLOCKS__.base2) {
                __BLOCKS__.base2 = function(__a__block_182, __b__block_182, __c__block_182) {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    var __ARGUMENTS__ = arguments;
                    var __arguments__block_182 = __ARGUMENTS__;

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
                    __a__block_182 = arguments[0] = __a__block_182 != null ? __a__block_182 : 1;
                    __b__block_182 = arguments[1] = __b__block_182 != null ? __b__block_182 : 2;
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_182), false, false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_182), false, false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_182), false, false));
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(__BLOCKS__.base2(0, __a__template_49, 1));
            __RESULT__.push(blocks.base2(5, 4, __b__template_49));
            return __RESULT__.join('');
        };
        Snakeskin.cache["block_base"] = this.block_base; /* Snakeskin template. */ /* Snakeskin template: block_sub;  */
        this.block_sub = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.block_sub,
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
            var TPL_NAME = "block_sub",
                PARENT_TPL_NAME = "block_base";
            var __a__template_313 = 2,
                __b__template_313 = void 0,
                __c__template_313 = void 0;
            if (!__BLOCKS__.base) {
                __BLOCKS__.base = function(__a__block_304) {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    var __ARGUMENTS__ = arguments;
                    var __arguments__block_333 = __ARGUMENTS__;

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
                    var __b__block_304 = 2;
                    var __c__block_304 = void 0;
                    __a__block_304 = arguments[0] = __a__block_304 != null ? __a__block_304 : 1;
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_304), false, false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_304), false, false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_304), false, false));
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(blocks.base(__a__template_313, __b__template_313, __c__template_313));
            if (!__BLOCKS__.base2) {
                __BLOCKS__.base2 = function(__a__block_417) {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    var __ARGUMENTS__ = arguments;
                    var __arguments__block_478 = __ARGUMENTS__;

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
                    var __b__block_417 = 2;
                    var __c__block_417 = void 0;
                    __a__block_417 = arguments[0] = __a__block_417 != null ? __a__block_417 : ({
                        aa: 9
                    });
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_417), false, false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_417), false, false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_417), false, false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_417.aa), false, false));
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(__BLOCKS__.base2(null));
            __RESULT__.push(blocks.base2(5, 4, __b__template_313));
            return __RESULT__.join('');
        };
        Snakeskin.cache["block_sub"] = this.block_sub; /* Snakeskin template. */ /* Snakeskin template: block_base2;  */
        this.block_base2 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.block_base2,
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
            var TPL_NAME = "block_base2",
                PARENT_TPL_NAME;
            var __a__template_653 = 2,
                __b__template_653 = void 0,
                __c__template_653 = void 0;
            if (!__BLOCKS__.base) {
                __BLOCKS__.base = function(__a__block_687, __b__block_687, __c__block_687) {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    var __ARGUMENTS__ = arguments;
                    var __arguments__block_687 = __ARGUMENTS__;

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
                    __a__block_687 = arguments[0] = __a__block_687 != null ? __a__block_687 : 1;
                    __b__block_687 = arguments[1] = __b__block_687 != null ? __b__block_687 : 2;
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_687), false, false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_687), false, false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_687), false, false));
                    if (!__BLOCKS__.base2) {
                        __BLOCKS__.base2 = function(__a__block_749, __b__block_749, __c__block_749) {
                            var __RESULT__ = new Snakeskin.StringBuffer();
                            var __ARGUMENTS__ = arguments;
                            var __arguments__block_749 = __ARGUMENTS__;

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
                            __a__block_749 = arguments[0] = __a__block_749 != null ? __a__block_749 : 1;
                            __b__block_749 = arguments[1] = __b__block_749 != null ? __b__block_749 : 2;
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_749), false, false));
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_749), false, false));
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_749), false, false));
                            return __RESULT__.join('');
                        };
                    }
                    __RESULT__.push(__BLOCKS__.base2(0, __a__block_687, 1));
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(blocks.base(__a__template_653, __b__template_653, __c__template_653));
            return __RESULT__.join('');
        };
        Snakeskin.cache["block_base2"] = this.block_base2; /* Snakeskin template. */ /* Snakeskin template: block_sub2;  */
        this.block_sub2 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.block_sub2,
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
            var TPL_NAME = "block_sub2",
                PARENT_TPL_NAME = "block_base2";
            var __a__template_889 = 2,
                __b__template_889 = void 0,
                __c__template_889 = void 0;
            if (!__BLOCKS__.base) {
                __BLOCKS__.base = function(__a__block_923, __b__block_923, __c__block_923) {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    var __ARGUMENTS__ = arguments;
                    var __arguments__block_923 = __ARGUMENTS__;

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
                    __a__block_923 = arguments[0] = __a__block_923 != null ? __a__block_923 : 1;
                    __b__block_923 = arguments[1] = __b__block_923 != null ? __b__block_923 : 2;
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_923), false, false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_923), false, false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_923), false, false));
                    if (!__BLOCKS__.base2) {
                        __BLOCKS__.base2 = function(__a__block_900) {
                            var __RESULT__ = new Snakeskin.StringBuffer();
                            var __ARGUMENTS__ = arguments;
                            var __arguments__block_979 = __ARGUMENTS__;

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
                            var __b__block_900 = 2;
                            var __c__block_900 = void 0;
                            __a__block_900 = arguments[0] = __a__block_900 != null ? __a__block_900 : ({
                                aa: 9
                            });
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_900), false, false));
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_900), false, false));
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_900), false, false));
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_900.aa), false, false));
                            return __RESULT__.join('');
                        };
                    }
                    __RESULT__.push(__BLOCKS__.base2(null));
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(blocks.base(__a__template_889, __b__template_889, __c__template_889));
            return __RESULT__.join('');
        };
        Snakeskin.cache["block_sub2"] = this.block_sub2; /* Snakeskin template. */ /* Snakeskin template: block_base3;  */
        this.block_base3 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.block_base3,
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
            var TPL_NAME = "block_base3",
                PARENT_TPL_NAME;
            if (!__BLOCKS__.foo) {
                __BLOCKS__.foo = function() {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    var __ARGUMENTS__ = arguments;
                    var __arguments__block_1202 = __ARGUMENTS__;

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
                    __RESULT__.push('121 ');
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(blocks.foo());
            __RESULT__.push(' ');
            return __RESULT__.join('');
        };
        Snakeskin.cache["block_base3"] = this.block_base3; /* Snakeskin template. */ /* Snakeskin template: block_sub3;  */
        this.block_sub3 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.block_sub3,
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
            var TPL_NAME = "block_sub3",
                PARENT_TPL_NAME = "block_base3";
            if (!__BLOCKS__.foo) {
                __BLOCKS__.foo = function() {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    var __ARGUMENTS__ = arguments;
                    var __arguments__block_1408 = __ARGUMENTS__;

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
                    __RESULT__.push('222 ');
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(blocks.foo());
            __RESULT__.push(' ');
            return __RESULT__.join('');
        };
        Snakeskin.cache["block_sub3"] = this.block_sub3; /* Snakeskin template. */ /* Snakeskin template: block_base4;  */
        this.block_base4 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.block_base4,
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
            var TPL_NAME = "block_base4",
                PARENT_TPL_NAME;
            if (!__BLOCKS__.bar) {
                __BLOCKS__.bar = function() {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    var __ARGUMENTS__ = arguments;
                    var __arguments__block_1635 = __ARGUMENTS__;

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
                    a = 1;
                    return __RESULT__.join('');
                };
            }
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache["block_base4"] = this.block_base4; /* Snakeskin template. */ /* Snakeskin template: block_sub4;  */
        this.block_sub4 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.block_sub4,
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
            var TPL_NAME = "block_sub4",
                PARENT_TPL_NAME = "block_base4";
            if (!__BLOCKS__.bar) {
                __BLOCKS__.bar = function() {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    var __ARGUMENTS__ = arguments;
                    var __arguments__block_1954 = __ARGUMENTS__;

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
                    __TMP__ = {
                        'class': ''
                    };
                    __RESULT__.push('<div');
                    __RESULT__.push((__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '>');
                    __RESULT__.push('112');
                    __RESULT__.push('</div>');
                    a = 1;
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(__BLOCKS__.bar());
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache["block_sub4"] = this.block_sub4; /* Snakeskin template. */
    }
}).call(this);
