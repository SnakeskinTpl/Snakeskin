/* Snakeskin v4.0.0, label <1407660751462>, generated at <1407744454503> Mon Aug 11 2014 12:07:34 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_1d6e6']; /* Snakeskin template: doctype_index;  */
        this.doctype_index = function() {
            var __THIS__ = this,
                callee = __ROOT__.doctype_index;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'doctype_index',
                PARENT_TPL_NAME;
            __RESULT__ += '<!DOCTYPE html>';
            __RESULT__ += '<!DOCTYPE html>';
            __RESULT__ += '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
            return __RESULT__;
        };
        Snakeskin.cache['doctype_index'] = this.doctype_index; /* Snakeskin template. */
    }
}).call(this);