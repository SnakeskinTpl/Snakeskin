/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,false,,stringConcat,true,true,true,,true,true,i18n>, label <1413886610375>, includes <>, generated at <1414826997972>.
   This code is generated automatically, don't alter it. */
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
        var __APPEND__ = Snakeskin.appendChild,
            __FILTERS__ = Snakeskin.Filters,
            __VARS__ = Snakeskin.Vars,
            __LOCAL__ = Snakeskin.LocalVars,
            __STR__, __TMP__, __J__;
        var $_ = __LOCAL__['$_0d7fb']; /* Snakeskin template: template;  */
        this.template = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.template,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "template",
                PARENT_TPL_NAME;
            __RESULT__ += __FILTERS__.html(($_ = __FILTERS__['repeat'].call(this, 'foo')), false, false);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache["template"] = this.template; /* Snakeskin template. */ /* Snakeskin template: template.template.bar;  */
        if (this.template == null) {
            this.template = {};
        }
        if (this.template.template == null) {
            this.template.template = {};
        }
        this.template.template.bar = function bar() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.template.template.bar,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "template.template.bar",
                PARENT_TPL_NAME;
            __RESULT__ += __FILTERS__.html(($_ = __FILTERS__['repeat'].call(this, 'foo')), false, false);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache["template.template.bar"] = this.template.template.bar; /* Snakeskin template. */ /* Snakeskin template: ['template_' + 'template'];  */
        this['template_template'] = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__['template_template'],
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "['template_template']",
                PARENT_TPL_NAME;
            __RESULT__ += __FILTERS__.html(($_ = __FILTERS__['repeat'].call(this, 'foo')), false, false);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache["['template_template']"] = this['template_template']; /* Snakeskin template. */ /* Snakeskin template: template['template' + 1];  */
        if (this.template == null) {
            this.template = {};
        }
        this.template['template1'] = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.template['template1'],
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "template['template1']",
                PARENT_TPL_NAME;
            __RESULT__ += __FILTERS__.html(($_ = __FILTERS__['repeat'].call(this, 'foo')), false, false);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache["template['template1']"] = this.template['template1']; /* Snakeskin template. */
        __VARS__.template_foo = 'fooBar'; /* Snakeskin template: [@template_foo];  */
        this['fooBar'] = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__['fooBar'],
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "['fooBar']",
                PARENT_TPL_NAME;
            var __arguments__proto_409 = [];
            __arguments__proto_409.callee = __CALLEE__;
            var ____I_PROTO___bar_template_43 = 1;
            ____I_PROTO___bar_template_43: while (____I_PROTO___bar_template_43--) {
                __RESULT__ += 'fooBar ';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache["['fooBar']"] = this['fooBar']; /* Snakeskin template. */
    }
}).call(this);
