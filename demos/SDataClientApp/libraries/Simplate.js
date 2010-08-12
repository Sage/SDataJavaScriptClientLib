/*!
 * simplate-js v1.1 
 * Copyright 2010, Michael Morton 
 * 
 * MIT Licensed - See LICENSE.txt
 */
(function() {
    var options = {
        tags: {
            begin: "{%",
            end: "%}"
        }
    };
    var cache = {};
    var merge = function(a, b, c) {
        if (c)
            for (var n in c) a[n] = c[n];
        if (b)
            for (var n in b) a[n] = b[n];
        return a;
    };
    function encode(val) {
        if (typeof val !== 'string') return val;

        return val
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };
    var make = function(markup, o) {
        if (markup.join) markup = markup.join("");
        if (cache[markup]) return cache[markup];

        var o = merge({}, o, options);
       
        if ('is,ie'.split(/(,)/).length !== 3)
        {
            var fragments = [];
            var a = markup.split(o.tags.begin);
            for (var i = 0; i < a.length; i++)
                fragments.push.apply(fragments, a[i].split(o.tags.end));
        }
        else
        {
            var regex = new RegExp(o.tags.begin + "(.*?)" + o.tags.end);
            var fragments = markup.split(regex);
        }
       
        /* code fragments */
        for (var i = 1; i < fragments.length; i += 2)
        {
            if (fragments[i].length > 0)
            {
                var control = fragments[i].charAt(0);
                switch (control)
                {
                    case "#":
                        /* comment */
                        fragments[i] = "";
                        break;
                    case "=":
                        fragments[i] = "__p(" + fragments[i].substr(1) + ");";
                        break;
                    case ":":
                        fragments[i] = "__p(__s.encode(" + fragments[i].substr(1) + "));";
                        break;
                    case "$":
                        fragments[i] = "try {" + "__p(" + fragments[i].substr(1) + ");" + "} catch (__e) {}";
                        break;
                    case "!":
                        fragments[i] = "__p(" + fragments[i].substr(1).replace(/^\s+|\s+$/g,'') + ".apply(__v));";
                        break;
                    default:
                        /* as is */
                        break;
                }
            }
        }
       
        for (var i = 0; i < fragments.length; i += 2)
            fragments[i] = "__p('" + fragments[i].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "');";
           
        var source = [
            'var __r = [], $ = __v, __s = Simplate, __p = function() { __r.push.apply(__r, arguments); };',
            'with ($ || {}) {',
            fragments.join(''),
            '}',
            'return __r.join(\'\');'
        ];
        
        var fn;

        try
        {
            fn = new Function("__v", source.join(''));
        }
        catch (e)
        {
            fn = function(values) { return e.message; };
        }
       
        return (cache[markup] = fn);
    };

    Simplate = window.Simplate = function(markup, o) {
        this.fn = make(markup, o);
    };

    Simplate.prototype = {
        apply: function(data, scope) {
            return this.fn.call(scope || this, data);
        }
    };
    
    Simplate.options = options;
    Simplate.encode = encode;
})();