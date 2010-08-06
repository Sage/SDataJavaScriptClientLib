// The Top-Level Namespace
/*global Sage $ alert*/
Sage = (function() {
    var apply = function(a, b, c)
    {
        if (a && c) for (var n in c) a[n] = c[n];
        if (a && b) for (var n in b) a[n] = b[n];
        return a;
    };
    var namespace = function(name, scope)
    {
        var parts = name.split('.');
        var o = scope || (parts[0] !== 'Sage' ? this : window);
        for (var i = 0; i < parts.length; i++) o = (o[parts[i]] = o[parts[i]] || {__namespace: true});
        return o;
    };
    var iter = function(o, cb, scope)
    {
        if (isArray(o))
        {
            var l = o.length;
            for (var i = 0; i < l; i++)
                cb.call(scope || o[i], i, o[i]);
        }
        else
            for (var n in o)
                if (o.hasOwnProperty(n))
                    cb.call(scope || o[n], n, o[n]);
    };
    var isArray = function(o)
    {
        return Object.prototype.toString.call(o) == '[object Array]';
    };
    return {
        config: {
            win: window || {},
            doc: document
        },
        apply: apply,
        namespace: namespace,
        each: iter,
        isArray: isArray,
        __namespace: true
    };
}());