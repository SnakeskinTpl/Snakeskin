/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,true,,stringBuffer,true,true,true,,true,true,i18n>, label <1413886610363>, includes <>, generated at <1414827003311>.
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
        var $_ = __LOCAL__['$_3496e'];
        __VARS__.name = 'foo'; /* Snakeskin template: scope_index; obj */
        this.scope_index = function(obj) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.scope_index,
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
            var TPL_NAME = "scope_index",
                PARENT_TPL_NAME;
            name = 'bar';
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(obj.child.name), false, false));
            var __e__with_112 = 'test';
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(name) + ' ' + __FILTERS__.undef(name) + ' ' + __FILTERS__.undef(obj.child.name) + ' ' + __FILTERS__.undef(obj.child.name) + ' ' + __FILTERS__.undef(name) + ' ' + __FILTERS__.undef(__VARS__.name) + ' ' + __FILTERS__.undef(obj.child.child.name) + ' ' + __FILTERS__.undef(__e__with_112), false, false));
            __RESULT__.push(' ');
            var name;
            return __RESULT__.join('');
        };
        Snakeskin.cache["scope_index"] = this.scope_index; /* Snakeskin template. */
    }
}).call(this);
