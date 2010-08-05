(function(){
    var ns = function(name, scope)
    {
        var o = scope || window;
        var parts = name.split('.');
        for (var i = 0; i < parts.length; i++) o = o[parts[i]] = o[parts[i]] || {};
        return o;
    };
    var apply = function(a, b, c)
    {
        if (a && c) for (var n in c) a[n] = c[n];
        if (a && b) for (var n in b) a[n] = b[n];
        return a;
    };

    var C = ns('Sage.SData.Client');

    apply(C, {
        ns: ns,
        apply: apply
    });

    var A = ns('Sage.SData.Client.Ajax');       

    var successful = function(code)
    {
        return ((code >= 200 && code < 300) || code === 304 || code === 0);
    };

    var onReadyStateChange = function(xhr, o)
    {
        if (xhr.readyState == 4)
        {
            if (successful(xhr.status))
            {
                console.log('success: %d %o', xhr.status, xhr);
                if (o.success)
                    o.success.call(o.scope || this, xhr, o);
            }
            else
            {
                console.log('failure: %d %o', xhr.status, xhr);
                if (o.failure)
                    o.failure.call(o.scope || this, xhr, o);
            }            
        }
    };

    var bindOnReadyStateChange = function(xhr, o) {
        xhr.onreadystatechange = function() {
            console.log('readystatechange: %d %o', xhr.readyState, xhr);
            onReadyStateChange.call(xhr, xhr, o);
        };
    };

    var buildParameters = function(params) {
        var query = [];
        for (var n in params)
        {
            query.push(
                encodeURIComponent(n) +
                '=' +
                encodeURIComponent(params[n])
            );
        }
        return query.join('&');
    };

    apply(A, {       
        request: function(o) {
            var o = apply({}, o);

            o.params = apply({}, o.params);
            o.headers = apply({}, o.headers);

            if (o.cache !== false)
                o.params['_d'] = (new Date()).getTime();

            o.method = o.method || 'GET';

            var parameters = buildParameters(o.params);
            if (parameters)
                o.url = o.url + (/\?/.test(o.url) ? '&' : '?') + parameters;

            var xhr = new XMLHttpRequest();

            if (o.user)
            {
                xhr.open(o.method, o.url, true, o.user, o.password);
                xhr.withCredentials = true;
            }
            else
                xhr.open(o.method, o.url, true);

            try
            {
                xhr.setRequestHeader('Accept', o.accept || '*/*');
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

                if (o.contentType)
                    xhr.setRequestHeader('Content-Type', o.contentType);

                for (var n in o.headers)
                    xhr.setRequestHeader(n, o.headers[n]);
            }
            catch (headerException)
            {
            }

            bindOnReadyStateChange(xhr, o);

            xhr.send(o.body || null);

            return xhr;
        },
        cancel: function(xhr) {
            xhr.abort();
        }
    });
})();

(function(){
    var C = Sage.SData.Client,
        INITIALIZING = false,
        // straight outta base2
        OVERRIDE = /xyz/.test(function(){xyz;}) ? /\bbase\b/ : /.*/;

    // The base Class placeholder
    C.Class = function(){};
    // Create a new Class that inherits from this class
    C.Class.define = function(prop) {
        var base = this.prototype;
        // Instantiate a base class (but only create the instance)
        INITIALIZING = true;
        var prototype = new this();
        INITIALIZING = false;
        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] === "function" &&
            typeof base[name] === "function" &&
            OVERRIDE.test(prop[name]) ?
            (function(name, fn) {
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
            }(name, prop[name])) :
            prop[name];
        }
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
})();