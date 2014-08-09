/* Snakeskin v4.0.0, label <1406783485267>, generated at <1407579286793> Sat Aug 09 2014 14:14:46 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var __FILTERS__ = Snakeskin.Filters,
            __VARS__ = Snakeskin.Vars,
            __LOCAL__ = Snakeskin.LocalVars,
            __STR__, __TMP__, __J__;
        var $_ = __LOCAL__['$_19c12']; /* Snakeskin template: block_base;  */
        this.block_base = function() {
            var __THIS__ = this,
                callee = __ROOT__.block_base;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'block_base',
                PARENT_TPL_NAME;
            var __a__template_49 = 2,
                __b__template_49 = void 0,
                __c__template_49 = void 0;
            if (!__BLOCKS__.base) {
                __BLOCKS__.base = function(__a__block_83, __b__block_83, __c__block_83) {
                    var __RESULT__ = '';
                    __a__block_83 = arguments[0] = __a__block_83 != null ? __a__block_83 : 1;
                    __b__block_83 = arguments[1] = __b__block_83 != null ? __b__block_83 : 2;
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__a__block_83), false);
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__b__block_83), false);
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__c__block_83), false);
                    return __RESULT__;
                };
            }
            __RESULT__ += __BLOCKS__.base(__a__template_49, __b__template_49, __c__template_49);
            if (!__BLOCKS__.base2) {
                __BLOCKS__.base2 = function(__a__block_150, __b__block_150, __c__block_150) {
                    var __RESULT__ = '';
                    __a__block_150 = arguments[0] = __a__block_150 != null ? __a__block_150 : 1;
                    __b__block_150 = arguments[1] = __b__block_150 != null ? __b__block_150 : 2;
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__a__block_150), false);
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__b__block_150), false);
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__c__block_150), false);
                    return __RESULT__;
                };
            }
            __RESULT__ += __BLOCKS__.base2(0, __a__template_49, 1);
            __RESULT__ += blocks.base2(5, 4, __b__template_49);
            return __RESULT__;
        };
        Snakeskin.cache['block_base'] = this.block_base; /* Snakeskin template. */ /* Snakeskin template: block_sub;  */
        this.block_sub = function() {
            var __THIS__ = this,
                callee = __ROOT__.block_sub;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'block_sub',
                PARENT_TPL_NAME = 'block_base';
            var __a__template_281 = 2,
                __b__template_281 = void 0,
                __c__template_281 = void 0;
            if (!__BLOCKS__.base) {
                __BLOCKS__.base = function(__a__block_272) {
                    var __RESULT__ = '';
                    var __b__block_272 = 2;
                    var __c__block_272 = void 0;
                    __a__block_272 = arguments[0] = __a__block_272 != null ? __a__block_272 : 1;
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__a__block_272), false);
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__b__block_272), false);
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__c__block_272), false);
                    return __RESULT__;
                };
            }
            __RESULT__ += __BLOCKS__.base(__a__template_281, __b__template_281, __c__template_281);
            if (!__BLOCKS__.base2) {
                __BLOCKS__.base2 = function(__a__block_381) {
                    var __RESULT__ = '';
                    var __b__block_381 = 2;
                    var __c__block_381 = void 0;
                    __a__block_381 = arguments[0] = __a__block_381 != null ? __a__block_381 : ({
                        aa: 9
                    });
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__a__block_381), false);
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__b__block_381), false);
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__c__block_381), false);
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__a__block_381.aa), false);
                    return __RESULT__;
                };
            }
            __RESULT__ += __BLOCKS__.base2(null);
            __RESULT__ += blocks.base2(5, 4, __b__template_281);
            return __RESULT__;
        };
        Snakeskin.cache['block_sub'] = this.block_sub; /* Snakeskin template. */ /* Snakeskin template: block_base2;  */
        this.block_base2 = function() {
            var __THIS__ = this,
                callee = __ROOT__.block_base2;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'block_base2',
                PARENT_TPL_NAME;
            var __a__template_581 = 2,
                __b__template_581 = void 0,
                __c__template_581 = void 0;
            if (!__BLOCKS__.base) {
                __BLOCKS__.base = function(__a__block_615, __b__block_615, __c__block_615) {
                    var __RESULT__ = '';
                    __a__block_615 = arguments[0] = __a__block_615 != null ? __a__block_615 : 1;
                    __b__block_615 = arguments[1] = __b__block_615 != null ? __b__block_615 : 2;
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__a__block_615), false);
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__b__block_615), false);
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__c__block_615), false);
                    if (!__BLOCKS__.base2) {
                        __BLOCKS__.base2 = function(__a__block_677, __b__block_677, __c__block_677) {
                            var __RESULT__ = '';
                            __a__block_677 = arguments[0] = __a__block_677 != null ? __a__block_677 : 1;
                            __b__block_677 = arguments[1] = __b__block_677 != null ? __b__block_677 : 2;
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__a__block_677), false);
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__b__block_677), false);
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__c__block_677), false);
                            return __RESULT__;
                        };
                    }
                    __RESULT__ += __BLOCKS__.base2(0, __a__block_615, 1);
                    return __RESULT__;
                };
            }
            __RESULT__ += __BLOCKS__.base(__a__template_581, __b__template_581, __c__template_581);
            return __RESULT__;
        };
        Snakeskin.cache['block_base2'] = this.block_base2; /* Snakeskin template. */ /* Snakeskin template: block_sub2;  */
        this.block_sub2 = function() {
            var __THIS__ = this,
                callee = __ROOT__.block_sub2;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'block_sub2',
                PARENT_TPL_NAME = 'block_base2';
            var __a__template_785 = 2,
                __b__template_785 = void 0,
                __c__template_785 = void 0;
            if (!__BLOCKS__.base) {
                __BLOCKS__.base = function(__a__block_819, __b__block_819, __c__block_819) {
                    var __RESULT__ = '';
                    __a__block_819 = arguments[0] = __a__block_819 != null ? __a__block_819 : 1;
                    __b__block_819 = arguments[1] = __b__block_819 != null ? __b__block_819 : 2;
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__a__block_819), false);
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__b__block_819), false);
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__c__block_819), false);
                    if (!__BLOCKS__.base2) {
                        __BLOCKS__.base2 = function(__a__block_796) {
                            var __RESULT__ = '';
                            var __b__block_796 = 2;
                            var __c__block_796 = void 0;
                            __a__block_796 = arguments[0] = __a__block_796 != null ? __a__block_796 : ({
                                aa: 9
                            });
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__a__block_796), false);
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__b__block_796), false);
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__c__block_796), false);
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__a__block_796.aa), false);
                            return __RESULT__;
                        };
                    }
                    __RESULT__ += __BLOCKS__.base2(null);
                    return __RESULT__;
                };
            }
            __RESULT__ += __BLOCKS__.base(__a__template_785, __b__template_785, __c__template_785);
            return __RESULT__;
        };
        Snakeskin.cache['block_sub2'] = this.block_sub2; /* Snakeskin template. */
    }
}).call(this);