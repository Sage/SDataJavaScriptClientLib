/*
    Make a new Class:
    var Person = Sage.Class.define({
		constructor: function(str) {
	    	this.name = str;
		},
		iAm: function() {
	    	return this.name;
		}
	});

	To create a class which inherits from an already existing one
	just call the already-existing class' extend() method: **
	var Knight = Person.extend({
		iAm: function() {
			return 'Sir ' + this.base();
		},
		joust: function() {
		    return 'Yaaaaaa!';
		}
	});
	Notice the Knight's iAm() method has access to it's 'super'
	via this.base();

	** differs from the Ext method of having to pass in the parent,
	** ours defines the extend() method directly on every defined class
*/
/*global Sage $ alert*/
if(Sage) {
    (function(S) {
        var INITIALIZING = false,
            // straight outta base2
            OVERRIDE = /xyz/.test(function(){xyz;}) ? /\bbase\b/ : /.*/;

        // The base Class placeholder
        S.Class = function(){};
        // Create a new Class that inherits from this class
        S.Class.define = function(prop) {
            var base = this.prototype;
            // Instantiate a base class (but only create the instance)
            INITIALIZING = true;
            var prototype = new this();
            INITIALIZING = false;

            var wrap = function(name, fn) {
                return function() {
                    var tmp = this.base;
                    // Add a new .base() method that is the same method
                    // but on the base class
                    this.base = base[name];
                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this.base = tmp;
                    return ret;
                };
            };

            // Copy the properties over onto the new prototype
            var hidden = ['constructor'],
                i = 0,
                name;

            for (name in prop) {
                // Check if we're overwriting an existing function
                prototype[name] = typeof prop[name] === "function" &&
                typeof base[name] === "function" &&
                OVERRIDE.test(prop[name]) ? wrap(name, prop[name]) : prop[name];
            }

            while (name = hidden[i++])
                if (prop[name] != base[name])
                    prototype[name] = typeof prop[name] === "function" &&
                        typeof base[name] === "function" &&
                        OVERRIDE.test(prop[name]) ? wrap(name, prop[name]) : prop[name];

            // The dummy class constructor
            function Class() {
                // All construction is actually done in the initialize method
                if ( !INITIALIZING && this.constructor ) {
                    this.constructor.apply(this, arguments);
                }
            }
            // Populate the constructed prototype object
            Class.prototype = prototype;
            // Enforce the constructor to be what we expect
            Class.constructor = Class;
            // And make this class 'define-able'
            Class.define = arguments.callee;
            Class.extend = Class.define; // sounds better for inherited classes
            return Class;
        };
    }(Sage));
}