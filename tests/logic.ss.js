/* Snakeskin v3.4.0, generated at <1404300112665> Wed Jul 02 2014 15:21:52 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() { /* Snakeskin template: logic_index; i */
        this.logic_index = function(i) {
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'logic_index',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            if (i == 1) {
                __RESULT__ += ' 1 ';
            } else if (i == 2) {
                __RESULT__ += '2 ';
            } else {
                __RESULT__ += '3 ';
            }
            switch (i) {
                case 1:
                    {
                        __RESULT__ += '1 ';
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
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['logic_index'] = this.logic_index;
        } /* Snakeskin template. */ /* Snakeskin template: logic_base;  */
        this.logic_base = function() {
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'logic_base',
                PARENT_TPL_NAME;
            __RESULT__ += '<span class=""></span> ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['logic_base'] = this.logic_base;
        } /* Snakeskin template. */ /* Snakeskin template: logic_sub;  */
        this.logic_sub = function() {
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
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['logic_sub'] = this.logic_sub;
        } /* Snakeskin template. */
    }
}).call(this);