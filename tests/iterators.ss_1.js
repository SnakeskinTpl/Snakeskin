/* Snakeskin v4.0.0, generated at <1406791321005> Thu Jul 31 2014 11:22:01 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
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
        var $_ = __LOCAL__['$_42451']; /* Snakeskin template: iterators_index1;  */
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
            Snakeskin.forEach(([1, 2, 3]), function(__el__forEach_89, __i__forEach_89, __obj__forEach_89, __isFirst__forEach_89, __isLast__forEach_89, __length__forEach_89) {
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
            });
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
            Snakeskin.forEach(({
                a: 1,
                b: 2
            }), function(__el__forEach_255, __key__forEach_255, __obj__forEach_255, __i__forEach_255, __isFirst__forEach_255, __isLast__forEach_255, __length__forEach_255) {
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
            });
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
            a = Object.create({
                a: 1
            });
            __RESULT__ += ' ';
            Snakeskin.forIn((a), function(__el__forIn_448, __key__forIn_448, __obj__forIn_448, __i__forIn_448, __isFirst__forIn_448, __isLast__forIn_448, __length__forIn_448) {
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
            });
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
            Snakeskin.forEach(([1, 2, 3]), function(__el__forEach_614, __i__forEach_614, __obj__forEach_614, __isFirst__forEach_614, __isLast__forEach_614, __length__forEach_614) {
                __RESULT__ += ' ';
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__el__forEach_614));
                __RESULT__ += ' ';
                return;
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
            });
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
            Snakeskin.forEach(({
                a: 1,
                b: 2
            }), function(__el__forEach_797, __key__forEach_797, __obj__forEach_797, __i__forEach_797, __isFirst__forEach_797, __isLast__forEach_797, __length__forEach_797) {
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
                return false;
            });
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
            a = Object.create({
                a: 1
            });
            __RESULT__ += ' ';
            Snakeskin.forIn((a), function(__el__forIn_1001, __key__forIn_1001, __obj__forIn_1001, __i__forIn_1001, __isFirst__forIn_1001, __isLast__forIn_1001, __length__forIn_1001) {
                __RESULT__ += ' ';
                return false;
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
            });
            __RESULT__ += ' ';
            var a;
            return __RESULT__;
        };
        Snakeskin.cache['iterators_index6'] = this.iterators_index6; /* Snakeskin template. */
    }
}).call(this);