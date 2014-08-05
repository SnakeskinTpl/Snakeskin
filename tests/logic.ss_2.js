/* Snakeskin v4.0.0, generated at <1407214263737> Tue Aug 05 2014 08:51:03 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_ab1c0']; /* Snakeskin template: logic_index; i */
        this.logic_index = function(i) {
            var __THIS__ = this,
                callee = __ROOT__.logic_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'logic_index',
                PARENT_TPL_NAME;
            switch (i) {
                case 1:
                    {
                        __RESULT__ += ' 1 ';
                    }
                    break;
                case 2:
                    {
                        __RESULT__ += '2 ';
                    }
                    break;
                default:
                    {
                        __RESULT__ += '3 ';
                    }
            }
            if (i == 1) {
                __RESULT__ += '1 ';
            } else if (i == 2) {
                __RESULT__ += '2 ';
            } else {
                __RESULT__ += '3 ';
            } if (!(i == 1)) {
                __RESULT__ += '1 ';
            } else if (i == 2) {
                __RESULT__ += '2 ';
            } else {
                __RESULT__ += '3 ';
            }
            return __RESULT__;
        };
        Snakeskin.cache['logic_index'] = this.logic_index; /* Snakeskin template. */ /* Snakeskin template: logic_base;  */
        this.logic_base = function() {
            var __THIS__ = this,
                callee = __ROOT__.logic_base;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'logic_base',
                PARENT_TPL_NAME;
            __RESULT__ += '<span class=""></span> ';
            return __RESULT__;
        };
        Snakeskin.cache['logic_base'] = this.logic_base; /* Snakeskin template. */ /* Snakeskin template: logic_sub;  */
        this.logic_sub = function() {
            var __THIS__ = this,
                callee = __ROOT__.logic_sub;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'logic_sub',
                PARENT_TPL_NAME = 'logic_base';
            __RESULT__ += '<span class=""></span> ';
            __RESULT__ += ' ';
            switch (1) {
                case 1:
                    {
                        __RESULT__ += ' 1 ';
                    }
                    break;
            }
            return __RESULT__;
        };
        Snakeskin.cache['logic_sub'] = this.logic_sub; /* Snakeskin template. */
    }
}).call(this);