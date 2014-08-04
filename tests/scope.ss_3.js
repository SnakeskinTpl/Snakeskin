/* Snakeskin v4.0.0, generated at <1407142912780> Mon Aug 04 2014 13:01:52 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_e16dd'];
        __VARS__.name = 'foo'; /* Snakeskin template: scope_index; obj */
        this.scope_index = function(obj) {
            var __THIS__ = this,
                callee = __ROOT__.scope_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = new Snakeskin.StringBuffer(),
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'scope_index',
                PARENT_TPL_NAME;
            name = 'bar';
            __RESULT__.push(' ');
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(obj.child.name)));
            var __e__with_112 = 'test';
            __RESULT__.push(' ');
            __RESULT__.push(' ');
            __RESULT__.push(__FILTERS__.html(__FILTERS__.undef(name) + ' ' + __FILTERS__.undef(name) + ' ' + __FILTERS__.undef(obj.child.name) + ' ' + __FILTERS__.undef(obj.child.name) + ' ' + __FILTERS__.undef(name) + ' ' + __FILTERS__.undef(__VARS__.name) + ' ' + __FILTERS__.undef(obj.child.child.name) + ' ' + __FILTERS__.undef(__e__with_112)));
            __RESULT__.push(' ');
            __RESULT__.push(' ');
            __RESULT__.push(' ');
            var name;
            return __RESULT__.join('');
        };
        Snakeskin.cache['scope_index'] = this.scope_index; /* Snakeskin template. */
    }
}).call(this);