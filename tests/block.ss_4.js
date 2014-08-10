/* Snakeskin v4.0.0, label <1407660751394>, generated at <1407664222423> Sun Aug 10 2014 13:50:22 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_3ba72']; /* Snakeskin template: block_base;  */
        this.block_base = function() {
            var __THIS__ = this,
                callee = __ROOT__.block_base;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
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
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    __a__block_83 = arguments[0] = __a__block_83 != null ? __a__block_83 : 1;
                    __b__block_83 = arguments[1] = __b__block_83 != null ? __b__block_83 : 2;
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_83), false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_83), false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_83), false));
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(blocks.base(__a__template_49, __b__template_49, __c__template_49));
            if (!__BLOCKS__.base2) {
                __BLOCKS__.base2 = function(__a__block_182, __b__block_182, __c__block_182) {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    __a__block_182 = arguments[0] = __a__block_182 != null ? __a__block_182 : 1;
                    __b__block_182 = arguments[1] = __b__block_182 != null ? __b__block_182 : 2;
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_182), false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_182), false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_182), false));
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(__BLOCKS__.base2(0, __a__template_49, 1));
            __RESULT__.push(blocks.base2(5, 4, __b__template_49));
            return __RESULT__.join('');
        };
        Snakeskin.cache['block_base'] = this.block_base; /* Snakeskin template. */ /* Snakeskin template: block_sub;  */
        this.block_sub = function() {
            var __THIS__ = this,
                callee = __ROOT__.block_sub;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'block_sub',
                PARENT_TPL_NAME = 'block_base';
            var __a__template_313 = 2,
                __b__template_313 = void 0,
                __c__template_313 = void 0;
            if (!__BLOCKS__.base) {
                __BLOCKS__.base = function(__a__block_304) {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    var __b__block_304 = 2;
                    var __c__block_304 = void 0;
                    __a__block_304 = arguments[0] = __a__block_304 != null ? __a__block_304 : 1;
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_304), false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_304), false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_304), false));
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(blocks.base(__a__template_313, __b__template_313, __c__template_313));
            if (!__BLOCKS__.base2) {
                __BLOCKS__.base2 = function(__a__block_413) {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    var __b__block_413 = 2;
                    var __c__block_413 = void 0;
                    __a__block_413 = arguments[0] = __a__block_413 != null ? __a__block_413 : ({
                        aa: 9
                    });
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_413), false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_413), false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_413), false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_413.aa), false));
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(__BLOCKS__.base2(null));
            __RESULT__.push(blocks.base2(5, 4, __b__template_313));
            return __RESULT__.join('');
        };
        Snakeskin.cache['block_sub'] = this.block_sub; /* Snakeskin template. */ /* Snakeskin template: block_base2;  */
        this.block_base2 = function() {
            var __THIS__ = this,
                callee = __ROOT__.block_base2;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'block_base2',
                PARENT_TPL_NAME;
            var __a__template_645 = 2,
                __b__template_645 = void 0,
                __c__template_645 = void 0;
            if (!__BLOCKS__.base) {
                __BLOCKS__.base = function(__a__block_679, __b__block_679, __c__block_679) {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    __a__block_679 = arguments[0] = __a__block_679 != null ? __a__block_679 : 1;
                    __b__block_679 = arguments[1] = __b__block_679 != null ? __b__block_679 : 2;
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_679), false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_679), false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_679), false));
                    if (!__BLOCKS__.base2) {
                        __BLOCKS__.base2 = function(__a__block_741, __b__block_741, __c__block_741) {
                            var __RESULT__ = new Snakeskin.StringBuffer();
                            __a__block_741 = arguments[0] = __a__block_741 != null ? __a__block_741 : 1;
                            __b__block_741 = arguments[1] = __b__block_741 != null ? __b__block_741 : 2;
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_741), false));
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_741), false));
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_741), false));
                            return __RESULT__.join('');
                        };
                    }
                    __RESULT__.push(__BLOCKS__.base2(0, __a__block_679, 1));
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(blocks.base(__a__template_645, __b__template_645, __c__template_645));
            return __RESULT__.join('');
        };
        Snakeskin.cache['block_base2'] = this.block_base2; /* Snakeskin template. */ /* Snakeskin template: block_sub2;  */
        this.block_sub2 = function() {
            var __THIS__ = this,
                callee = __ROOT__.block_sub2;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'block_sub2',
                PARENT_TPL_NAME = 'block_base2';
            var __a__template_881 = 2,
                __b__template_881 = void 0,
                __c__template_881 = void 0;
            if (!__BLOCKS__.base) {
                __BLOCKS__.base = function(__a__block_915, __b__block_915, __c__block_915) {
                    var __RESULT__ = new Snakeskin.StringBuffer();
                    __a__block_915 = arguments[0] = __a__block_915 != null ? __a__block_915 : 1;
                    __b__block_915 = arguments[1] = __b__block_915 != null ? __b__block_915 : 2;
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_915), false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_915), false));
                    __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_915), false));
                    if (!__BLOCKS__.base2) {
                        __BLOCKS__.base2 = function(__a__block_892) {
                            var __RESULT__ = new Snakeskin.StringBuffer();
                            var __b__block_892 = 2;
                            var __c__block_892 = void 0;
                            __a__block_892 = arguments[0] = __a__block_892 != null ? __a__block_892 : ({
                                aa: 9
                            });
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_892), false));
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__b__block_892), false));
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__c__block_892), false));
                            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__a__block_892.aa), false));
                            return __RESULT__.join('');
                        };
                    }
                    __RESULT__.push(__BLOCKS__.base2(null));
                    return __RESULT__.join('');
                };
            }
            __RESULT__.push(blocks.base(__a__template_881, __b__template_881, __c__template_881));
            return __RESULT__.join('');
        };
        Snakeskin.cache['block_sub2'] = this.block_sub2; /* Snakeskin template. */
    }
}).call(this);