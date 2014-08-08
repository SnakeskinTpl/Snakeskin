/* Snakeskin v4.0.0, label <1406953399891>, generated at <1407485984864> Fri Aug 08 2014 12:19:44 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_08086']; /* Snakeskin template: iterators_index1;  */
        this.iterators_index1 = function() {
            var __THIS__ = this,
                callee = __ROOT__.iterators_index1;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index1',
                PARENT_TPL_NAME;
            Snakeskin.forEach([1, 2, 3], function(__el__forEach_89, __i__forEach_89, __obj__forEach_89, __isFirst__forEach_89, __isLast__forEach_89, __length__forEach_89) {
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forEach_89), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__i__forEach_89), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__obj__forEach_89[__i__forEach_89]), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_89), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isLast__forEach_89), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__length__forEach_89), false));
                __RESULT__.push(' --- ');
            });
            __RESULT__.push(' ');
            return __RESULT__.join('');
        };
        Snakeskin.cache['iterators_index1'] = this.iterators_index1; /* Snakeskin template. */ /* Snakeskin template: iterators_index2;  */
        this.iterators_index2 = function() {
            var __THIS__ = this,
                callee = __ROOT__.iterators_index2;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index2',
                PARENT_TPL_NAME;
            Snakeskin.forEach(({
                a: 1,
                b: 2
            }), function(__el__forEach_255, __key__forEach_255, __obj__forEach_255, __i__forEach_255, __isFirst__forEach_255, __isLast__forEach_255, __length__forEach_255) {
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forEach_255), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__key__forEach_255), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__obj__forEach_255[__key__forEach_255]), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__i__forEach_255), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_255), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isLast__forEach_255), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__length__forEach_255), false));
                __RESULT__.push(' --- ');
            });
            __RESULT__.push(' ');
            return __RESULT__.join('');
        };
        Snakeskin.cache['iterators_index2'] = this.iterators_index2; /* Snakeskin template. */ /* Snakeskin template: iterators_index3;  */
        this.iterators_index3 = function() {
            var __THIS__ = this,
                callee = __ROOT__.iterators_index3;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index3',
                PARENT_TPL_NAME;
            a = Object.create(({
                a: 1
            }));
            __RESULT__.push(' ');
            Snakeskin.forIn(a, function(__el__forIn_446, __key__forIn_446, __obj__forIn_446, __i__forIn_446, __isFirst__forIn_446, __isLast__forIn_446, __length__forIn_446) {
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forIn_446), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__key__forIn_446), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__obj__forIn_446[__key__forIn_446]), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__i__forIn_446), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isFirst__forIn_446), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isLast__forIn_446), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__length__forIn_446), false));
                __RESULT__.push(' --- ');
            });
            __RESULT__.push(' ');
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache['iterators_index3'] = this.iterators_index3; /* Snakeskin template. */ /* Snakeskin template: iterators_index4;  */
        this.iterators_index4 = function() {
            var __THIS__ = this,
                callee = __ROOT__.iterators_index4;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index4',
                PARENT_TPL_NAME;
            Snakeskin.forEach([1, 2, 3], function(__el__forEach_612, __i__forEach_612, __obj__forEach_612, __isFirst__forEach_612, __isLast__forEach_612, __length__forEach_612) {
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forEach_612), false));
                __RESULT__.push(' ');
                return;
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__i__forEach_612), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__obj__forEach_612[__i__forEach_612]), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_612), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isLast__forEach_612), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__length__forEach_612), false));
                __RESULT__.push(' --- ');
            });
            __RESULT__.push(' ');
            return __RESULT__.join('');
        };
        Snakeskin.cache['iterators_index4'] = this.iterators_index4; /* Snakeskin template. */ /* Snakeskin template: iterators_index5;  */
        this.iterators_index5 = function() {
            var __THIS__ = this,
                callee = __ROOT__.iterators_index5;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index5',
                PARENT_TPL_NAME;
            Snakeskin.forEach(({
                a: 1,
                b: 2
            }), function(__el__forEach_795, __key__forEach_795, __obj__forEach_795, __i__forEach_795, __isFirst__forEach_795, __isLast__forEach_795, __length__forEach_795) {
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forEach_795), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__key__forEach_795), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__obj__forEach_795[__key__forEach_795]), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__i__forEach_795), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isFirst__forEach_795), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isLast__forEach_795), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__length__forEach_795), false));
                __RESULT__.push(' --- ');
                return false;
            });
            __RESULT__.push(' ');
            return __RESULT__.join('');
        };
        Snakeskin.cache['iterators_index5'] = this.iterators_index5; /* Snakeskin template. */ /* Snakeskin template: iterators_index6;  */
        this.iterators_index6 = function() {
            var __THIS__ = this,
                callee = __ROOT__.iterators_index6;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'iterators_index6',
                PARENT_TPL_NAME;
            a = Object.create(({
                a: 1
            }));
            __RESULT__.push(' ');
            Snakeskin.forIn(a, function(__el__forIn_997, __key__forIn_997, __obj__forIn_997, __i__forIn_997, __isFirst__forIn_997, __isLast__forIn_997, __length__forIn_997) {
                __RESULT__.push(' ');
                return false;
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__el__forIn_997), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__key__forIn_997), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__obj__forIn_997[__key__forIn_997]), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__i__forIn_997), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isFirst__forIn_997), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__isLast__forIn_997), false));
                __RESULT__.push(' ');
                __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(__length__forIn_997), false));
                __RESULT__.push(' --- ');
            });
            __RESULT__.push(' ');
            var a;
            return __RESULT__.join('');
        };
        Snakeskin.cache['iterators_index6'] = this.iterators_index6; /* Snakeskin template. */
    }
}).call(this);