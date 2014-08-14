/* Snakeskin v4.0.9, label <1407503300938>, generated at <1408025277478> Thu Aug 14 2014 18:07:57 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
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
        var $_ = __LOCAL__['$_a86e7']; /* Snakeskin template: helloWorld; name  */
        this.helloWorld = function(name) {
            var __THIS__ = this,
                callee = __ROOT__.helloWorld;
            if (!callee.Blocks) {
                var __BLOCKS__ = callee.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                $_;

            function getTplResult() {
                return __RESULT__;
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'helloWorld',
                PARENT_TPL_NAME;
            name = arguments[0] = name != null ? name : 'world';
            __RESULT__ += '<h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name), false);
            __RESULT__ += '!</h1> ';
            return __RESULT__;
        };
        Snakeskin.cache['helloWorld'] = this.helloWorld; /* Snakeskin template. */
    }
}).call(this);