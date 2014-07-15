/* Snakeskin v4.0.0, generated at <1405420931650> Tue Jul 15 2014 14:42:11 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = Snakeskin || obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() {
        var $C = this.$C != null ? this.$C : Snakeskin.Vars.$C,
            async = this.async != null ? this.async : Snakeskin.Vars.async;
        var __$C__ = $C,
            __async__ = async;
        var __FILTERS__ = Snakeskin.Filters,
            __VARS__ = Snakeskin.Vars,
            __LOCAL__ = Snakeskin.LocalVars,
            __STR__, __J__;
        var $_; /* Snakeskin template: proto_index; i */
        this.proto_index = function(i) {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'proto_index',
                PARENT_TPL_NAME;
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            var ____I_PROTO___begin_template_44 = 1;
            ____I_PROTO___begin_template_44: while (____I_PROTO___begin_template_44--) {
                __RESULT__ += ' ';
                var __i__proto_257 = 1;
                var ____I_PROTO___f1_template_44 = 1;
                ____I_PROTO___f1_template_44: while (____I_PROTO___f1_template_44--) {
                    __RESULT__ += ' ';
                    var __i__proto_386 = __i__proto_257;
                    var ____I_PROTO___f2_template_44 = 1;
                    ____I_PROTO___f2_template_44: while (____I_PROTO___f2_template_44--) {
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__proto_386));
                        __RESULT__ += ' ';
                    }
                    __RESULT__ += ' ';
                    var __i__proto_386 = __i__proto_257 + 1;
                    var ____I_PROTO___f2_template_44 = 1;
                    ____I_PROTO___f2_template_44: while (____I_PROTO___f2_template_44--) {
                        __RESULT__ += ' ';
                        __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__proto_386));
                        __RESULT__ += ' ';
                    }
                    __RESULT__ += ' ';
                }
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            var __i__proto_311 = 2;
            var ____I_PROTO___f3_template_44 = 1;
            ____I_PROTO___f3_template_44: while (____I_PROTO___f3_template_44--) {
                __RESULT__ += ' ';
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__proto_311) * 2);
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            var a = {
                a: 1
            };
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            var __i__proto_450 = 2;
            var ____I_PROTO___f4_template_44 = 1;
            ____I_PROTO___f4_template_44: while (____I_PROTO___f4_template_44--) {
                __RESULT__ += ' ';
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(a.a));
                __RESULT__ += ' ';
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__proto_450));
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['proto_index'] = this.proto_index; /* Snakeskin template. */ /* Snakeskin template: proto_index2.a['foo'];  */
        if (this.proto_index2 === void 0) {
            this.proto_index2 = {};
        }
        if (this.proto_index2.a === void 0) {
            this.proto_index2.a = {};
        }
        this.proto_index2.a['foo'] = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'proto_index2.a[\'foo\']',
                PARENT_TPL_NAME;
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            var __i__proto_691 = 1;
            var ____I_PROTO___begin_template_54 = 1;
            ____I_PROTO___begin_template_54: while (____I_PROTO___begin_template_54--) {
                __RESULT__ += ' ';
                var __i__proto_748 = 1;
                var ____I_PROTO___f1_template_54 = 1;
                ____I_PROTO___f1_template_54: while (____I_PROTO___f1_template_54--) {
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__proto_748));
                    __RESULT__ += ' ';
                }
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['proto_index2.a[\'foo\']'] = this.proto_index2.a['foo']; /* Snakeskin template. */ /* Snakeskin template: proto_recursive;  */
        this.proto_recursive = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'proto_recursive',
                PARENT_TPL_NAME;
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            var __i__proto_834 = 5;
            var ____I_PROTO___begin_template_48 = 1;
            ____I_PROTO___begin_template_48: while (____I_PROTO___begin_template_48--) {
                __RESULT__ += ' ';
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__proto_834));
                __RESULT__ += ' ';
                if (__i__proto_834) {
                    __RESULT__ += ' ';
                    var __i__proto_834 = --__i__proto_834;
                    ____I_PROTO___begin_template_48++;
                    __RESULT__ += ' ';
                }
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['proto_recursive'] = this.proto_recursive; /* Snakeskin template. */ /* Snakeskin template: proto_recursive2;  */
        this.proto_recursive2 = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'proto_recursive2',
                PARENT_TPL_NAME;
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            var __i__proto_967 = 5;
            var ____I_PROTO___begin_template_49 = 1;
            ____I_PROTO___begin_template_49: while (____I_PROTO___begin_template_49--) {
                __RESULT__ += ' ';
                __RESULT__ += ' ';
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__proto_967));
                __RESULT__ += ' ';
                if (__i__proto_967) {
                    __RESULT__ += ' ';
                    var __i__proto_985 = --__i__proto_967;
                    var ____I_PROTO___foo_template_49 = 1;
                    ____I_PROTO___foo_template_49: while (____I_PROTO___foo_template_49--) {
                        __RESULT__ += ' ';
                        if (__i__proto_985 === 2) {
                            __RESULT__ += ' ';
                            return __RESULT__;
                        }
                        __RESULT__ += ' ';
                        var __i__proto_967 = __i__proto_985;
                        ____I_PROTO___begin_template_49++;
                        __RESULT__ += ' ';
                    }
                    __RESULT__ += ' ';
                }
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['proto_recursive2'] = this.proto_recursive2; /* Snakeskin template. */
    }
}).call(this);