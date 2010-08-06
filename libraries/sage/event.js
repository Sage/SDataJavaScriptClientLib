// Event class is instantiated by the Evented class. Probably no need
// to call this directly

/*global Sage $ alert*/
if(Sage) {
    (function(S) {
        var SLICE = Array.prototype.slice,
            TRUE = true, FALSE = false,
            WIN = S.config.win,
            TARGETED = function(f,o,scope) {
                return function() {
                    if(o.target === arguments[0]){
                        f.apply(scope, SLICE.call(arguments, 0));
                    }
                };
            },
            BUFFERED = function(f,o,l,scope) {
                l.task = new S.Utility.Deferred();
                return function(){
                    l.task.delay(o.buffer, f, scope, SLICE.call(arguments, 0));
                };
            },
            SINGLE = function(f,ev,fn,scope) {
                return function(){
                    ev.removeListener(fn, scope);
                    return f.apply(scope, arguments);
                };
            },
            DELAYED = function(f,o,l,scope) {
                return function() {
                    var task = new S.Utility.Deferred();
                    if(!l.tasks) {
                        l.tasks = [];
                    }
                    l.tasks.push(task);
                    task.delay(o.delay || 10, f, scope, SLICE.call(arguments, 0));
                };
            };
        // place the Event class in Utility
        S.namespace('Utility');
        
        S.Utility.Event = Sage.Class.define({
            constructor: function(obj, name) {
                this.name = name;
                this.obj = obj;
                this.listeners = [];
            },
            addListener: function(fn, scope, options){
                var that = this,l;
                scope = scope || that.obj;
                if(!that.isListening(fn, scope)) {
                    l = that.createListener(fn, scope, options);
                    if(that.firing) {
                        that.listeners = that.listeners.slice(0);
                    }
                    that.listeners.push(l);
                }
            },
            createListener: function(fn, scope, o) {
                o = o || {}; 
                scope = scope || this.obj;
                var l = {
                    fn: fn,
                    scope: scope,
                    options: o
                }, h = fn;
                if(o.target){
                    h = TARGETED(h, o, scope);
                }
                if(o.delay){
                    h = DELAYED(h, o, l, scope);
                }
                if(o.single){
                    h = SINGLE(h, this, fn, scope);
                }
                if(o.buffer){
                    h = BUFFERED(h, o, l, scope);
                }
                l.fireFn = h;
                return l;
            },
            findListener: function(fn, scope){
                var list = this.listeners,
                i = list.length,l;
                scope = scope || this.obj;
                while(i--) {
                    l = list[i];
                    if(l) {
                        if(l.fn === fn && l.scope === scope){
                            return i;
                        }
                    }
                }
                return -1;
            },
            isListening: function(fn, scope){
                return this.findListener(fn, scope) !== -1;
            },
            removeListener: function(fn, scope){
                var that = this, index, l, k,
                result = FALSE;
                if((index = that.findListener(fn, scope)) !== -1) {
                    if (that.firing) {
                        that.listeners = that.listeners.slice(0);
                    }
                    l = that.listeners[index];
                    if(l.task) {
                        l.task.cancel();
                        delete l.task;
                    }
                    k = l.tasks && l.tasks.length;
                    if(k) {
                        while(k--) {
                            l.tasks[k].cancel();
                        }
                        delete l.tasks;
                    }
                    that.listeners.splice(index, 1);
                    result = TRUE;
                }
                return result;
            },
            // Iterate to stop any buffered/delayed events
            clearListeners: function() {
                var that = this,
                l = that.listeners,
                i = l.length;
                while(i--) {
                    that.removeListener(l[i].fn, l[i].scope);
                }
            },
            fire: function(){
                var that = this,
                listeners = that.listeners,
                len = listeners.length,
                i = 0, l, args;
                if(len > 0) {
                    that.firing = TRUE;
                    args = SLICE.call(arguments, 0);
                    for (; i < len; i++) {
                        l = listeners[i];
                        if(l && l.fireFn.apply(l.scope || that.obj || 
                            WIN, args) === FALSE) {
                            return (that.firing = FALSE);
                        }
                    }
                }
                that.firing = FALSE;
                return TRUE;
            }
        }); // end S.Event class
    }(Sage));
}