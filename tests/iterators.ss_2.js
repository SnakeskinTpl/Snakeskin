/* Snakeskin v4.0.0, label <1406953399891>, generated at <1407485984499> Fri Aug 08 2014 12:19:44 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_9f5a0']; /* Snakeskin template: iterators_index1;  */
        this.iterators_index1 = function() {
            var __THIS__ = this,
                callee = __ROOT__.iterators_index1;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index1',
                PARENT_TPL_NAME;
            var ____TMP____forEach_89 = [1, 2, 3];
            if (____TMP____forEach_89) {
                if (Array.isArray(____TMP____forEach_89)) {
                    var ____LENGTH____forEach_89 = ____TMP____forEach_89.length;
                    for (var ____I____forEach_89 = -1; ++____I____forEach_89 < ____LENGTH____forEach_89;) {
                        var __el__forEach_89 = ____TMP____forEach_89[____I____forEach_89];
                        var __i__forEach_89 = ____I____forEach_89;
                        var __obj__forEach_89 = ____TMP____forEach_89;
                        var __isFirst__forEach_89 = ____I____forEach_89 === 0;
                        var __isLast__forEach_89 = ____I____forEach_89 === ____LENGTH____forEach_89 - 1;
                        var __length__forEach_89 = ____LENGTH____forEach_89;
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_89), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_89), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_89[__i__forEach_89]), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_89), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_89), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_89), false);
                        __RESULT__ += ' --- ';
                    }
                } else {
                    var ____KEYS____forEach_89 = Object.keys ? Object.keys(____TMP____forEach_89) : null;
                    var ____LENGTH____forEach_89 = ____KEYS____forEach_89 ? ____KEYS____forEach_89.length : 0;
                    if (!____KEYS____forEach_89) {
                        var ____LENGTH____forEach_89 = 0;
                        for (var ____KEY____forEach_89 = void 0 in ____TMP____forEach_89) {
                            if (!____TMP____forEach_89.hasOwnProperty(____KEY____forEach_89)) {
                                continue;
                            }
                            ____LENGTH____forEach_89++;
                        }
                    }
                    if (____KEYS____forEach_89) {
                        var ____LENGTH____forEach_89 = ____KEYS____forEach_89.length;
                        for (var ____I____forEach_89 = -1; ++____I____forEach_89 < ____LENGTH____forEach_89;) {
                            var __el__forEach_89 = ____TMP____forEach_89[____KEYS____forEach_89[____I____forEach_89]];
                            var __i__forEach_89 = ____KEYS____forEach_89[____I____forEach_89];
                            var __obj__forEach_89 = ____TMP____forEach_89;
                            var __isFirst__forEach_89 = ____I____forEach_89;
                            var __isLast__forEach_89 = ____I____forEach_89 === 0;
                            var __length__forEach_89 = ____I____forEach_89 === ____LENGTH____forEach_89 - 1;
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_89), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_89), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_89[__i__forEach_89]), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_89), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_89), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_89), false);
                            __RESULT__ += ' --- ';
                        }
                    } else {
                        var ____I____forEach_89 = -1;
                        for (var ____KEY____forEach_89 = void 0 in ____TMP____forEach_89) {
                            if (!____TMP____forEach_89.hasOwnProperty(____KEY____forEach_89)) {
                                continue;
                            }
                            ____I____forEach_89++;
                            var __el__forEach_89 = ____TMP____forEach_89[____KEY____forEach_89];
                            var __i__forEach_89 = ____KEY____forEach_89;
                            var __obj__forEach_89 = ____TMP____forEach_89;
                            var __isFirst__forEach_89 = ____I____forEach_89;
                            var __isLast__forEach_89 = ____I____forEach_89 === 0;
                            var __length__forEach_89 = ____I____forEach_89 === ____LENGTH____forEach_89 - 1;
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_89), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_89), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_89[__i__forEach_89]), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_89), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_89), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_89), false);
                            __RESULT__ += ' --- ';
                        }
                    }
                }
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['iterators_index1'] = this.iterators_index1; /* Snakeskin template. */ /* Snakeskin template: iterators_index2;  */
        this.iterators_index2 = function() {
            var __THIS__ = this,
                callee = __ROOT__.iterators_index2;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index2',
                PARENT_TPL_NAME;
            var ____TMP____forEach_255 = ({
                a: 1,
                b: 2
            });
            if (____TMP____forEach_255) {
                if (Array.isArray(____TMP____forEach_255)) {
                    var ____LENGTH____forEach_255 = ____TMP____forEach_255.length;
                    for (var ____I____forEach_255 = -1; ++____I____forEach_255 < ____LENGTH____forEach_255;) {
                        var __el__forEach_255 = ____TMP____forEach_255[____I____forEach_255];
                        var __key__forEach_255 = ____I____forEach_255;
                        var __obj__forEach_255 = ____TMP____forEach_255;
                        var __i__forEach_255 = ____I____forEach_255 === 0;
                        var __isFirst__forEach_255 = ____I____forEach_255 === ____LENGTH____forEach_255 - 1;
                        var __isLast__forEach_255 = ____LENGTH____forEach_255;
                        var __length__forEach_255 = void 0;
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_255), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forEach_255), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_255[__key__forEach_255]), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_255), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_255), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_255), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_255), false);
                        __RESULT__ += ' --- ';
                    }
                } else {
                    var ____KEYS____forEach_255 = Object.keys ? Object.keys(____TMP____forEach_255) : null;
                    var ____LENGTH____forEach_255 = ____KEYS____forEach_255 ? ____KEYS____forEach_255.length : 0;
                    if (!____KEYS____forEach_255) {
                        var ____LENGTH____forEach_255 = 0;
                        for (var ____KEY____forEach_255 = void 0 in ____TMP____forEach_255) {
                            if (!____TMP____forEach_255.hasOwnProperty(____KEY____forEach_255)) {
                                continue;
                            }
                            ____LENGTH____forEach_255++;
                        }
                    }
                    if (____KEYS____forEach_255) {
                        var ____LENGTH____forEach_255 = ____KEYS____forEach_255.length;
                        for (var ____I____forEach_255 = -1; ++____I____forEach_255 < ____LENGTH____forEach_255;) {
                            var __el__forEach_255 = ____TMP____forEach_255[____KEYS____forEach_255[____I____forEach_255]];
                            var __key__forEach_255 = ____KEYS____forEach_255[____I____forEach_255];
                            var __obj__forEach_255 = ____TMP____forEach_255;
                            var __i__forEach_255 = ____I____forEach_255;
                            var __isFirst__forEach_255 = ____I____forEach_255 === 0;
                            var __isLast__forEach_255 = ____I____forEach_255 === ____LENGTH____forEach_255 - 1;
                            var __length__forEach_255 = ____LENGTH____forEach_255;
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_255), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forEach_255), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_255[__key__forEach_255]), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_255), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_255), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_255), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_255), false);
                            __RESULT__ += ' --- ';
                        }
                    } else {
                        var ____I____forEach_255 = -1;
                        for (var ____KEY____forEach_255 = void 0 in ____TMP____forEach_255) {
                            if (!____TMP____forEach_255.hasOwnProperty(____KEY____forEach_255)) {
                                continue;
                            }
                            ____I____forEach_255++;
                            var __el__forEach_255 = ____TMP____forEach_255[____KEY____forEach_255];
                            var __key__forEach_255 = ____KEY____forEach_255;
                            var __obj__forEach_255 = ____TMP____forEach_255;
                            var __i__forEach_255 = ____I____forEach_255;
                            var __isFirst__forEach_255 = ____I____forEach_255 === 0;
                            var __isLast__forEach_255 = ____I____forEach_255 === ____LENGTH____forEach_255 - 1;
                            var __length__forEach_255 = ____LENGTH____forEach_255;
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_255), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forEach_255), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_255[__key__forEach_255]), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_255), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_255), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_255), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_255), false);
                            __RESULT__ += ' --- ';
                        }
                    }
                }
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['iterators_index2'] = this.iterators_index2; /* Snakeskin template. */ /* Snakeskin template: iterators_index3;  */
        this.iterators_index3 = function() {
            var __THIS__ = this,
                callee = __ROOT__.iterators_index3;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index3',
                PARENT_TPL_NAME;
            a = Object.create(({
                a: 1
            }));
            __RESULT__ += ' ';
            var ____TMP____forIn_446 = a;
            if (____TMP____forIn_446) {
                var ____LENGTH____forIn_446 = 0;
                for (var __key__forIn_446 = void 0 in ____TMP____forIn_446) {
                    ____LENGTH____forIn_446++;
                }
                var ____I____forIn_446 = -1;
                for (var ____KEY____forIn_446 = void 0 in ____TMP____forIn_446) {
                    ____I____forIn_446++;
                    var __el__forIn_446 = ____TMP____forIn_446[____KEY____forIn_446];
                    var __key__forIn_446 = ____KEY____forIn_446;
                    var __obj__forIn_446 = ____TMP____forIn_446;
                    var __i__forIn_446 = ____I____forIn_446;
                    var __isFirst__forIn_446 = ____I____forIn_446 === 0;
                    var __isLast__forIn_446 = ____I____forIn_446 === ____LENGTH____forIn_446 - 1;
                    var __length__forIn_446 = ____LENGTH____forIn_446;
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forIn_446), false);
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forIn_446), false);
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forIn_446[__key__forIn_446]), false);
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forIn_446), false);
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forIn_446), false);
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forIn_446), false);
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forIn_446), false);
                    __RESULT__ += ' --- ';
                }
            }
            __RESULT__ += ' ';
            var a;
            return __RESULT__;
        };
        Snakeskin.cache['iterators_index3'] = this.iterators_index3; /* Snakeskin template. */ /* Snakeskin template: iterators_index4;  */
        this.iterators_index4 = function() {
            var __THIS__ = this,
                callee = __ROOT__.iterators_index4;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index4',
                PARENT_TPL_NAME;
            var ____TMP____forEach_612 = [1, 2, 3];
            if (____TMP____forEach_612) {
                if (Array.isArray(____TMP____forEach_612)) {
                    var ____LENGTH____forEach_612 = ____TMP____forEach_612.length;
                    for (var ____I____forEach_612 = -1; ++____I____forEach_612 < ____LENGTH____forEach_612;) {
                        var __el__forEach_612 = ____TMP____forEach_612[____I____forEach_612];
                        var __i__forEach_612 = ____I____forEach_612;
                        var __obj__forEach_612 = ____TMP____forEach_612;
                        var __isFirst__forEach_612 = ____I____forEach_612 === 0;
                        var __isLast__forEach_612 = ____I____forEach_612 === ____LENGTH____forEach_612 - 1;
                        var __length__forEach_612 = ____LENGTH____forEach_612;
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_612), false);
                        __RESULT__ += ' ';
                        continue;
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_612), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_612[__i__forEach_612]), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_612), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_612), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_612), false);
                        __RESULT__ += ' --- ';
                    }
                } else {
                    var ____KEYS____forEach_612 = Object.keys ? Object.keys(____TMP____forEach_612) : null;
                    var ____LENGTH____forEach_612 = ____KEYS____forEach_612 ? ____KEYS____forEach_612.length : 0;
                    if (!____KEYS____forEach_612) {
                        var ____LENGTH____forEach_612 = 0;
                        for (var ____KEY____forEach_612 = void 0 in ____TMP____forEach_612) {
                            if (!____TMP____forEach_612.hasOwnProperty(____KEY____forEach_612)) {
                                continue;
                            }
                            ____LENGTH____forEach_612++;
                        }
                    }
                    if (____KEYS____forEach_612) {
                        var ____LENGTH____forEach_612 = ____KEYS____forEach_612.length;
                        for (var ____I____forEach_612 = -1; ++____I____forEach_612 < ____LENGTH____forEach_612;) {
                            var __el__forEach_612 = ____TMP____forEach_612[____KEYS____forEach_612[____I____forEach_612]];
                            var __i__forEach_612 = ____KEYS____forEach_612[____I____forEach_612];
                            var __obj__forEach_612 = ____TMP____forEach_612;
                            var __isFirst__forEach_612 = ____I____forEach_612;
                            var __isLast__forEach_612 = ____I____forEach_612 === 0;
                            var __length__forEach_612 = ____I____forEach_612 === ____LENGTH____forEach_612 - 1;
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_612), false);
                            __RESULT__ += ' ';
                            continue;
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_612), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_612[__i__forEach_612]), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_612), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_612), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_612), false);
                            __RESULT__ += ' --- ';
                        }
                    } else {
                        var ____I____forEach_612 = -1;
                        for (var ____KEY____forEach_612 = void 0 in ____TMP____forEach_612) {
                            if (!____TMP____forEach_612.hasOwnProperty(____KEY____forEach_612)) {
                                continue;
                            }
                            ____I____forEach_612++;
                            var __el__forEach_612 = ____TMP____forEach_612[____KEY____forEach_612];
                            var __i__forEach_612 = ____KEY____forEach_612;
                            var __obj__forEach_612 = ____TMP____forEach_612;
                            var __isFirst__forEach_612 = ____I____forEach_612;
                            var __isLast__forEach_612 = ____I____forEach_612 === 0;
                            var __length__forEach_612 = ____I____forEach_612 === ____LENGTH____forEach_612 - 1;
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_612), false);
                            __RESULT__ += ' ';
                            continue;
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_612), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_612[__i__forEach_612]), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_612), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_612), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_612), false);
                            __RESULT__ += ' --- ';
                        }
                    }
                }
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['iterators_index4'] = this.iterators_index4; /* Snakeskin template. */ /* Snakeskin template: iterators_index5;  */
        this.iterators_index5 = function() {
            var __THIS__ = this,
                callee = __ROOT__.iterators_index5;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index5',
                PARENT_TPL_NAME;
            var ____TMP____forEach_795 = ({
                a: 1,
                b: 2
            });
            if (____TMP____forEach_795) {
                if (Array.isArray(____TMP____forEach_795)) {
                    var ____LENGTH____forEach_795 = ____TMP____forEach_795.length;
                    for (var ____I____forEach_795 = -1; ++____I____forEach_795 < ____LENGTH____forEach_795;) {
                        var __el__forEach_795 = ____TMP____forEach_795[____I____forEach_795];
                        var __key__forEach_795 = ____I____forEach_795;
                        var __obj__forEach_795 = ____TMP____forEach_795;
                        var __i__forEach_795 = ____I____forEach_795 === 0;
                        var __isFirst__forEach_795 = ____I____forEach_795 === ____LENGTH____forEach_795 - 1;
                        var __isLast__forEach_795 = ____LENGTH____forEach_795;
                        var __length__forEach_795 = void 0;
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_795), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forEach_795), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_795[__key__forEach_795]), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_795), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_795), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_795), false);
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_795), false);
                        __RESULT__ += ' --- ';
                        break;
                    }
                } else {
                    var ____KEYS____forEach_795 = Object.keys ? Object.keys(____TMP____forEach_795) : null;
                    var ____LENGTH____forEach_795 = ____KEYS____forEach_795 ? ____KEYS____forEach_795.length : 0;
                    if (!____KEYS____forEach_795) {
                        var ____LENGTH____forEach_795 = 0;
                        for (var ____KEY____forEach_795 = void 0 in ____TMP____forEach_795) {
                            if (!____TMP____forEach_795.hasOwnProperty(____KEY____forEach_795)) {
                                continue;
                            }
                            ____LENGTH____forEach_795++;
                        }
                    }
                    if (____KEYS____forEach_795) {
                        var ____LENGTH____forEach_795 = ____KEYS____forEach_795.length;
                        for (var ____I____forEach_795 = -1; ++____I____forEach_795 < ____LENGTH____forEach_795;) {
                            var __el__forEach_795 = ____TMP____forEach_795[____KEYS____forEach_795[____I____forEach_795]];
                            var __key__forEach_795 = ____KEYS____forEach_795[____I____forEach_795];
                            var __obj__forEach_795 = ____TMP____forEach_795;
                            var __i__forEach_795 = ____I____forEach_795;
                            var __isFirst__forEach_795 = ____I____forEach_795 === 0;
                            var __isLast__forEach_795 = ____I____forEach_795 === ____LENGTH____forEach_795 - 1;
                            var __length__forEach_795 = ____LENGTH____forEach_795;
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_795), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forEach_795), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_795[__key__forEach_795]), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_795), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_795), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_795), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_795), false);
                            __RESULT__ += ' --- ';
                            break;
                        }
                    } else {
                        var ____I____forEach_795 = -1;
                        for (var ____KEY____forEach_795 = void 0 in ____TMP____forEach_795) {
                            if (!____TMP____forEach_795.hasOwnProperty(____KEY____forEach_795)) {
                                continue;
                            }
                            ____I____forEach_795++;
                            var __el__forEach_795 = ____TMP____forEach_795[____KEY____forEach_795];
                            var __key__forEach_795 = ____KEY____forEach_795;
                            var __obj__forEach_795 = ____TMP____forEach_795;
                            var __i__forEach_795 = ____I____forEach_795;
                            var __isFirst__forEach_795 = ____I____forEach_795 === 0;
                            var __isLast__forEach_795 = ____I____forEach_795 === ____LENGTH____forEach_795 - 1;
                            var __length__forEach_795 = ____LENGTH____forEach_795;
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_795), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forEach_795), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_795[__key__forEach_795]), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_795), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_795), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_795), false);
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_795), false);
                            __RESULT__ += ' --- ';
                            break;
                        }
                    }
                }
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['iterators_index5'] = this.iterators_index5; /* Snakeskin template. */ /* Snakeskin template: iterators_index6;  */
        this.iterators_index6 = function() {
            var __THIS__ = this,
                callee = __ROOT__.iterators_index6;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index6',
                PARENT_TPL_NAME;
            a = Object.create(({
                a: 1
            }));
            __RESULT__ += ' ';
            var ____TMP____forIn_997 = a;
            if (____TMP____forIn_997) {
                var ____LENGTH____forIn_997 = 0;
                for (var __key__forIn_997 = void 0 in ____TMP____forIn_997) {
                    ____LENGTH____forIn_997++;
                }
                var ____I____forIn_997 = -1;
                for (var ____KEY____forIn_997 = void 0 in ____TMP____forIn_997) {
                    ____I____forIn_997++;
                    var __el__forIn_997 = ____TMP____forIn_997[____KEY____forIn_997];
                    var __key__forIn_997 = ____KEY____forIn_997;
                    var __obj__forIn_997 = ____TMP____forIn_997;
                    var __i__forIn_997 = ____I____forIn_997;
                    var __isFirst__forIn_997 = ____I____forIn_997 === 0;
                    var __isLast__forIn_997 = ____I____forIn_997 === ____LENGTH____forIn_997 - 1;
                    var __length__forIn_997 = ____LENGTH____forIn_997;
                    __RESULT__ += ' ';
                    break;
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forIn_997), false);
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forIn_997), false);
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forIn_997[__key__forIn_997]), false);
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forIn_997), false);
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forIn_997), false);
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forIn_997), false);
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forIn_997), false);
                    __RESULT__ += ' --- ';
                }
            }
            __RESULT__ += ' ';
            var a;
            return __RESULT__;
        };
        Snakeskin.cache['iterators_index6'] = this.iterators_index6; /* Snakeskin template. */
    }
}).call(this);