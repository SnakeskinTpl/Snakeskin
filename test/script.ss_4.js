/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,true,,stringBuffer,true,true,true,,true,true,i18n>, label <1413886610367>, includes <>, generated at <1414827003328>.
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
        var $_ = __LOCAL__['$_aed10']; /* Snakeskin template: script_index;  */
        this.script_index = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.script_index,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__.join('');
                if (opt_clear) {
                    __RESULT__ = new Snakeskin.StringBuffer();
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = new Snakeskin.StringBuffer();
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "script_index",
                PARENT_TPL_NAME;
            __RESULT__.push('<script type="text/javascript"');
            __RESULT__.push('>');
            __RESULT__.push('var a = []; ');
            __RESULT__.push('</script>');
            __RESULT__.push('<script type="application/coffeescript"');
            __RESULT__.push('>');
            __RESULT__.push('var a = []; ');
            __RESULT__.push('</script>');
            __RESULT__.push('<script type="coffee2"');
            __RESULT__.push('>');
            __RESULT__.push('var a = []; ');
            __RESULT__.push('</script>');
            return __RESULT__.join('');
        };
        Snakeskin.cache["script_index"] = this.script_index; /* Snakeskin template. */ /* Snakeskin template: script_index2;  */
        this.script_index2 = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.script_index2,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__.join('');
                if (opt_clear) {
                    __RESULT__ = new Snakeskin.StringBuffer();
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = new Snakeskin.StringBuffer();
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "script_index2",
                PARENT_TPL_NAME;
            __RESULT__.push('<script type="application/typescript"');
            __STR__ = '';
            __J__ = 0;
            if (('foo') != null && ('foo') !== '') {
                __STR__ += __J__ ? ' ' + 'foo' : 'foo';
                __J__++;
            }
            if (('ng-class') != null && ('ng-class') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('ng-class', __STR__);
                } else {
                    __RESULT__.push(' ' + 'ng-class' + (__STR__ ? '="' + __STR__ + '"' : ''));
                }
            }
            __STR__ = '';
            __J__ = 0;
            if (('bar') != null && ('bar') !== '') {
                __STR__ += __J__ ? ' ' + 'bar' : 'bar';
                __J__++;
            }
            if (('ng-id') != null && ('ng-id') != '' && (__STR__ || false)) {
                if (__NODE__) {
                    __NODE__.setAttribute('ng-id', __STR__);
                } else {
                    __RESULT__.push(' ' + 'ng-id' + (__STR__ ? '="' + __STR__ + '"' : ''));
                }
            }
            __RESULT__.push('>');
            __RESULT__.push('var a = []; ');
            __RESULT__.push('</script>');
            return __RESULT__.join('');
        };
        Snakeskin.cache["script_index2"] = this.script_index2; /* Snakeskin template. */
    }
}).call(this);
