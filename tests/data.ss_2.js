/* Snakeskin v4.0.0, generated at <1407218973605> Tue Aug 05 2014 10:09:33 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_27c08']; /* Snakeskin template: data_index;  */
        this.data_index = function() {
            var __THIS__ = this,
                callee = __ROOT__.data_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'data_index',
                PARENT_TPL_NAME;
            a = ' foo ';
            __RESULT__ += ' ';
            __RESULT__ += '{a: \"' + __FILTERS__.html(($_ = __FILTERS__['ucfirst'].call(this, ($_ = __FILTERS__['trim'].call(this, __FILTERS__.undef(a)))))) + '\"}';
            __RESULT__ += ' ';
            __RESULT__ += '{{' + __FILTERS__.html(($_ = __FILTERS__['ucfirst'].call(this, ($_ = __FILTERS__['trim'].call(this, __FILTERS__.undef(a)))))) + '}}';
            __RESULT__ += ' ';
            __RESULT__ += '{= {a: "${a|trim|ucfirst}"}}{{${a|trim|ucfirst}}} ';
            var a;
            return __RESULT__;
        };
        Snakeskin.cache['data_index'] = this.data_index; /* Snakeskin template. */ /* Snakeskin template: data_decl;  */
        this.data_decl = function() {
            var __THIS__ = this,
                callee = __ROOT__.data_decl;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'data_decl',
                PARENT_TPL_NAME;
            foo = 'bar';
            __RESULT__ += ' ';
            __RESULT__ += '{{foo}}';
            __RESULT__ += ' ';
            __RESULT__ += '{{' + __FILTERS__.html(__FILTERS__.undef(foo)) + '}}';
            __RESULT__ += ' ';
            __RESULT__ += '{{' + __FILTERS__.html(__FILTERS__.undef(foo)) + '}}';
            __RESULT__ += ' ';
            var foo;
            return __RESULT__;
        };
        Snakeskin.cache['data_decl'] = this.data_decl; /* Snakeskin template. */
    }
}).call(this);