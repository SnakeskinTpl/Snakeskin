/* Snakeskin v3.4.0, generated at <1404888384167> Wed Jul 09 2014 10:46:24 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() { /* Snakeskin template: iterators_index1;  */
        this.iterators_index1 = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index1',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
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
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_89));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_89));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_89[__i__forEach_89]));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_89));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_89));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_89));
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
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_89));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_89));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_89[__i__forEach_89]));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_89));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_89));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_89));
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
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_89));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_89));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_89[__i__forEach_89]));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_89));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_89));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_89));
                            __RESULT__ += ' --- ';
                        }
                    }
                }
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['iterators_index1'] = this.iterators_index1;
        } /* Snakeskin template. */ /* Snakeskin template: iterators_index2;  */
        this.iterators_index2 = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index2',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            var ____TMP____forEach_255 = {
                a: 1,
                b: 2
            };
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
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_255));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forEach_255));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_255[__key__forEach_255]));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_255));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_255));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_255));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_255));
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
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_255));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forEach_255));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_255[__key__forEach_255]));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_255));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_255));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_255));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_255));
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
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_255));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forEach_255));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_255[__key__forEach_255]));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_255));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_255));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_255));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_255));
                            __RESULT__ += ' --- ';
                        }
                    }
                }
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['iterators_index2'] = this.iterators_index2;
        } /* Snakeskin template. */ /* Snakeskin template: iterators_index3;  */
        this.iterators_index3 = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index3',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            var a = Object.create({
                a: 1
            });
            __RESULT__ += ' ';
            var ____TMP____forIn_448 = a;
            if (____TMP____forIn_448) {
                var ____LENGTH____forIn_448 = 0;
                for (var __key__forIn_448 = void 0 in ____TMP____forIn_448) {
                    ____LENGTH____forIn_448++;
                }
                var ____I____forIn_448 = -1;
                for (var ____KEY____forIn_448 = void 0 in ____TMP____forIn_448) {
                    ____I____forIn_448++;
                    var __el__forIn_448 = ____TMP____forIn_448[____KEY____forIn_448];
                    var __key__forIn_448 = ____KEY____forIn_448;
                    var __obj__forIn_448 = ____TMP____forIn_448;
                    var __i__forIn_448 = ____I____forIn_448;
                    var __isFirst__forIn_448 = ____I____forIn_448 === 0;
                    var __isLast__forIn_448 = ____I____forIn_448 === ____LENGTH____forIn_448 - 1;
                    var __length__forIn_448 = ____LENGTH____forIn_448;
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forIn_448));
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forIn_448));
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forIn_448[__key__forIn_448]));
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forIn_448));
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forIn_448));
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forIn_448));
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forIn_448));
                    __RESULT__ += ' --- ';
                }
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['iterators_index3'] = this.iterators_index3;
        } /* Snakeskin template. */ /* Snakeskin template: iterators_index4;  */
        this.iterators_index4 = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index4',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            var ____TMP____forEach_614 = [1, 2, 3];
            if (____TMP____forEach_614) {
                if (Array.isArray(____TMP____forEach_614)) {
                    var ____LENGTH____forEach_614 = ____TMP____forEach_614.length;
                    for (var ____I____forEach_614 = -1; ++____I____forEach_614 < ____LENGTH____forEach_614;) {
                        var __el__forEach_614 = ____TMP____forEach_614[____I____forEach_614];
                        var __i__forEach_614 = ____I____forEach_614;
                        var __obj__forEach_614 = ____TMP____forEach_614;
                        var __isFirst__forEach_614 = ____I____forEach_614 === 0;
                        var __isLast__forEach_614 = ____I____forEach_614 === ____LENGTH____forEach_614 - 1;
                        var __length__forEach_614 = ____LENGTH____forEach_614;
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_614));
                        __RESULT__ += ' ';
                        continue;
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_614));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_614[__i__forEach_614]));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_614));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_614));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_614));
                        __RESULT__ += ' --- ';
                    }
                } else {
                    var ____KEYS____forEach_614 = Object.keys ? Object.keys(____TMP____forEach_614) : null;
                    var ____LENGTH____forEach_614 = ____KEYS____forEach_614 ? ____KEYS____forEach_614.length : 0;
                    if (!____KEYS____forEach_614) {
                        var ____LENGTH____forEach_614 = 0;
                        for (var ____KEY____forEach_614 = void 0 in ____TMP____forEach_614) {
                            if (!____TMP____forEach_614.hasOwnProperty(____KEY____forEach_614)) {
                                continue;
                            }
                            ____LENGTH____forEach_614++;
                        }
                    }
                    if (____KEYS____forEach_614) {
                        var ____LENGTH____forEach_614 = ____KEYS____forEach_614.length;
                        for (var ____I____forEach_614 = -1; ++____I____forEach_614 < ____LENGTH____forEach_614;) {
                            var __el__forEach_614 = ____TMP____forEach_614[____KEYS____forEach_614[____I____forEach_614]];
                            var __i__forEach_614 = ____KEYS____forEach_614[____I____forEach_614];
                            var __obj__forEach_614 = ____TMP____forEach_614;
                            var __isFirst__forEach_614 = ____I____forEach_614;
                            var __isLast__forEach_614 = ____I____forEach_614 === 0;
                            var __length__forEach_614 = ____I____forEach_614 === ____LENGTH____forEach_614 - 1;
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_614));
                            __RESULT__ += ' ';
                            continue;
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_614));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_614[__i__forEach_614]));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_614));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_614));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_614));
                            __RESULT__ += ' --- ';
                        }
                    } else {
                        var ____I____forEach_614 = -1;
                        for (var ____KEY____forEach_614 = void 0 in ____TMP____forEach_614) {
                            if (!____TMP____forEach_614.hasOwnProperty(____KEY____forEach_614)) {
                                continue;
                            }
                            ____I____forEach_614++;
                            var __el__forEach_614 = ____TMP____forEach_614[____KEY____forEach_614];
                            var __i__forEach_614 = ____KEY____forEach_614;
                            var __obj__forEach_614 = ____TMP____forEach_614;
                            var __isFirst__forEach_614 = ____I____forEach_614;
                            var __isLast__forEach_614 = ____I____forEach_614 === 0;
                            var __length__forEach_614 = ____I____forEach_614 === ____LENGTH____forEach_614 - 1;
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_614));
                            __RESULT__ += ' ';
                            continue;
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_614));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_614[__i__forEach_614]));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_614));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_614));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_614));
                            __RESULT__ += ' --- ';
                        }
                    }
                }
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['iterators_index4'] = this.iterators_index4;
        } /* Snakeskin template. */ /* Snakeskin template: iterators_index5;  */
        this.iterators_index5 = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index5',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            var ____TMP____forEach_797 = {
                a: 1,
                b: 2
            };
            if (____TMP____forEach_797) {
                if (Array.isArray(____TMP____forEach_797)) {
                    var ____LENGTH____forEach_797 = ____TMP____forEach_797.length;
                    for (var ____I____forEach_797 = -1; ++____I____forEach_797 < ____LENGTH____forEach_797;) {
                        var __el__forEach_797 = ____TMP____forEach_797[____I____forEach_797];
                        var __key__forEach_797 = ____I____forEach_797;
                        var __obj__forEach_797 = ____TMP____forEach_797;
                        var __i__forEach_797 = ____I____forEach_797 === 0;
                        var __isFirst__forEach_797 = ____I____forEach_797 === ____LENGTH____forEach_797 - 1;
                        var __isLast__forEach_797 = ____LENGTH____forEach_797;
                        var __length__forEach_797 = void 0;
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_797));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forEach_797));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_797[__key__forEach_797]));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_797));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_797));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_797));
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_797));
                        __RESULT__ += ' --- ';
                        break;
                    }
                } else {
                    var ____KEYS____forEach_797 = Object.keys ? Object.keys(____TMP____forEach_797) : null;
                    var ____LENGTH____forEach_797 = ____KEYS____forEach_797 ? ____KEYS____forEach_797.length : 0;
                    if (!____KEYS____forEach_797) {
                        var ____LENGTH____forEach_797 = 0;
                        for (var ____KEY____forEach_797 = void 0 in ____TMP____forEach_797) {
                            if (!____TMP____forEach_797.hasOwnProperty(____KEY____forEach_797)) {
                                continue;
                            }
                            ____LENGTH____forEach_797++;
                        }
                    }
                    if (____KEYS____forEach_797) {
                        var ____LENGTH____forEach_797 = ____KEYS____forEach_797.length;
                        for (var ____I____forEach_797 = -1; ++____I____forEach_797 < ____LENGTH____forEach_797;) {
                            var __el__forEach_797 = ____TMP____forEach_797[____KEYS____forEach_797[____I____forEach_797]];
                            var __key__forEach_797 = ____KEYS____forEach_797[____I____forEach_797];
                            var __obj__forEach_797 = ____TMP____forEach_797;
                            var __i__forEach_797 = ____I____forEach_797;
                            var __isFirst__forEach_797 = ____I____forEach_797 === 0;
                            var __isLast__forEach_797 = ____I____forEach_797 === ____LENGTH____forEach_797 - 1;
                            var __length__forEach_797 = ____LENGTH____forEach_797;
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_797));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forEach_797));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_797[__key__forEach_797]));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_797));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_797));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_797));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_797));
                            __RESULT__ += ' --- ';
                            break;
                        }
                    } else {
                        var ____I____forEach_797 = -1;
                        for (var ____KEY____forEach_797 = void 0 in ____TMP____forEach_797) {
                            if (!____TMP____forEach_797.hasOwnProperty(____KEY____forEach_797)) {
                                continue;
                            }
                            ____I____forEach_797++;
                            var __el__forEach_797 = ____TMP____forEach_797[____KEY____forEach_797];
                            var __key__forEach_797 = ____KEY____forEach_797;
                            var __obj__forEach_797 = ____TMP____forEach_797;
                            var __i__forEach_797 = ____I____forEach_797;
                            var __isFirst__forEach_797 = ____I____forEach_797 === 0;
                            var __isLast__forEach_797 = ____I____forEach_797 === ____LENGTH____forEach_797 - 1;
                            var __length__forEach_797 = ____LENGTH____forEach_797;
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_797));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forEach_797));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forEach_797[__key__forEach_797]));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forEach_797));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_797));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forEach_797));
                            __RESULT__ += ' ';
                            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forEach_797));
                            __RESULT__ += ' --- ';
                            break;
                        }
                    }
                }
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['iterators_index5'] = this.iterators_index5;
        } /* Snakeskin template. */ /* Snakeskin template: iterators_index6;  */
        this.iterators_index6 = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __FILTERS__ = Snakeskin.Filters,
                __VARS__ = Snakeskin.Vars,
                __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index6',
                PARENT_TPL_NAME;
            var $C = typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C,
                async = typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            var a = Object.create({
                a: 1
            });
            __RESULT__ += ' ';
            var ____TMP____forIn_1001 = a;
            if (____TMP____forIn_1001) {
                var ____LENGTH____forIn_1001 = 0;
                for (var __key__forIn_1001 = void 0 in ____TMP____forIn_1001) {
                    ____LENGTH____forIn_1001++;
                }
                var ____I____forIn_1001 = -1;
                for (var ____KEY____forIn_1001 = void 0 in ____TMP____forIn_1001) {
                    ____I____forIn_1001++;
                    var __el__forIn_1001 = ____TMP____forIn_1001[____KEY____forIn_1001];
                    var __key__forIn_1001 = ____KEY____forIn_1001;
                    var __obj__forIn_1001 = ____TMP____forIn_1001;
                    var __i__forIn_1001 = ____I____forIn_1001;
                    var __isFirst__forIn_1001 = ____I____forIn_1001 === 0;
                    var __isLast__forIn_1001 = ____I____forIn_1001 === ____LENGTH____forIn_1001 - 1;
                    var __length__forIn_1001 = ____LENGTH____forIn_1001;
                    __RESULT__ += ' ';
                    break;
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forIn_1001));
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__key__forIn_1001));
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__obj__forIn_1001[__key__forIn_1001]));
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__forIn_1001));
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isFirst__forIn_1001));
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__isLast__forIn_1001));
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__length__forIn_1001));
                    __RESULT__ += ' --- ';
                }
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['iterators_index6'] = this.iterators_index6;
        } /* Snakeskin template. */
    }
}).call(this);