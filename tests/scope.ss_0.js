/* Snakeskin v4.0.0, generated at <1405420931660> Tue Jul 15 2014 14:42:11 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_;
        Snakeskin.Vars.name = 'foo'; /* Snakeskin template: scope_index; obj */
        this.scope_index = function(obj) {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'scope_index',
                PARENT_TPL_NAME;
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            var name = 'bar';
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(obj.child.name));
            var __e__with_112 = 'test';
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name) + ' ' + __FILTERS__.undef(name) + ' ' + __FILTERS__.undef(obj.child.name) + ' ' + __FILTERS__.undef(obj.child.name) + ' ' + __FILTERS__.undef(name) + ' ' + __FILTERS__.undef(__VARS__.name) + ' ' + __FILTERS__.undef(obj.child.child.name) + ' ' + __FILTERS__.undef(__e__with_112));
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['scope_index'] = this.scope_index; /* Snakeskin template. */
    }
}).call(this);