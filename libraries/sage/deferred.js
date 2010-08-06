/*global Sage $ alert*/
if(Sage) {
    (function(S) {
        // place the Deferred class into Sage.Utility
        S.namespace('Utility');
        
        S.Utility.Deferred = function(fn, args, scope) {
            var that = this, id,
            c = function() {
                clearInterval(id);
                id = null;
                fn.apply(scope, args || []);
            };
            that.delay = function(n) {
                that.cancel();
                // an named interval that can be cancelled
                id = setInterval(c, n);
            };
            that.cancel = function() {
                if(id) {
                    clearInterval(id);
                    id = null;
                }
            };
        };
    }(Sage));
}