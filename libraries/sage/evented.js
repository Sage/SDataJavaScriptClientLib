/*
    var Employee = Sage.Evented.extend({
        constructor: function(c) {
            this.name = c.name;
            this.events = {
                quit: true
            };
            this.base(c);
        }
    });

    var Dev = new Employee({
        name: "Rob",
        listeners: {
            quit: function() {console.log(this.name + ' has quit!'); }
        }
    });
*/

/*global Sage $ alert*/
if(Sage) {
    (function(S) {
        var SLICE = Array.prototype.slice,
            TRUE = true, FALSE = false,
            // do not include these
            FILTER = /^(?:scope|delay|buffer|single)$/,
            EACH = S.each;
        
        S.Evented = S.Class.define({
            constructor: function(config) {
                var that = this,
                e = that.events;
                if(config && config.listeners) {
                    that.addListener(config.listeners);
                }
                that.events = e || {};
            },
            fireEvent: function() {
                var that = this,
                args = SLICE.call(arguments, 0),
                eventName = args[0].toLowerCase(),
                result = TRUE,
                current = this.events[eventName],
                b,c,
                q = that.eventQueue || [];
                // TODO: evaluate use of deferring events
                if (that.eventsSuspended === TRUE) {
                    q.push(args);
                }
                if (typeof current === 'object') {
                    if(current.bubble) {
                        if(current.fire.apply(current, args.slice(1)) === FALSE) {
                            return FALSE;
                        }
                        b = that.getBubbleTarget && that.getBubbleTarget();
                        if(b && b.enableBubble) {
                            c = b.events[eventName];
                            if(!c || typeof c !== 'object' || !c.bubble) {
                                b.enableBubble(eventName);
                            }
                            return b.fireEvent.apply(b, args);
                        }
                    } else {
                        // remove the event name
                        args.shift();
                        result = current.fire.apply(current, args);
                    }
                }
                return result;
            },
            addListener : function(eventName, fn, scope, o){
                var that = this, e, oe, ce;
                if (typeof eventName === 'object') {
                    o = eventName;
                    for (e in o){
                        oe = o[e];
                        if (!FILTER.test(e)) {
                            that.addListener(e, oe.fn || oe, oe.scope || 
                                o.scope, oe.fn ? oe : o);
                        }
                    }
                } else {
                    eventName = eventName.toLowerCase();
                    ce = that.events[eventName] || TRUE;
                    if (typeof ce === 'boolean') {
                        that.events[eventName] = ce = new S.Utility.Event(that, eventName);
                    }
                    ce.addListener(fn, scope, typeof o === 'object' ? o : {});
                }
            },
            removeListener : function(eventName, fn, scope) {
                var ce = this.events[eventName.toLowerCase()];
                if (typeof ce === 'object') {
                    ce.removeListener(fn, scope);
                }
            },
            purgeListeners : function(){
                var events = this.events,evt,key;
                for(key in events) {
                    evt = events[key];
                    if(typeof evt === 'object') {
                        evt.clearListeners();
                    }
                }
            },
            addEvents : function(o){
                var that = this, arg, i;
                that.events = that.events || {};
                if (typeof o === 'string') {
                    arg = arguments;
                    i = arg.length;
                    while(i--) {
                        that.events[arg[i]] = that.events[arg[i]] || TRUE;
                    }
                } else {
                    Sage.apply(that.events, o);
                }
            },
            hasListener : function(eventName){
                var e = this.events[eventName.toLowerCase()];
                return typeof e === 'object' && e.listeners.length > 0;
            },
            suspendEvents : function(queueSuspended){
                this.eventsSuspended = TRUE;
                if(queueSuspended && !this.eventQueue){
                    this.eventQueue = [];
                }
            },
            resumeEvents : function(){
                var that = this,
                queued = that.eventQueue || [];
                that.eventsSuspended = FALSE;
                delete that.eventQueue;
                // use jquery's each method
                EACH(queued, function(e) {
                    that.fireEvent.apply(that, e);
                });
            }            
        }); //end S.Evented

        S.Evented.prototype.on = S.Evented.prototype.addListener;
        S.Evented.prototype.un = S.Evented.prototype.removeListener;
    }(Sage));
}