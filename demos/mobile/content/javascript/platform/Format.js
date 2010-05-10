/// <reference path="../ext/ext-core-debug.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.Format = (function() {
    function isEmpty(val) {
        if (typeof val !== 'string') return !val;
        
        return (val.length <= 0);
    };

    function encode(val) {
        if (typeof val !== 'string') return val;

        return val
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };

    function decode(val) {
        if (typeof val !== 'string') return val;

        return val
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"');
    };

    var nameToPathCache = {};
    var nameToPath = function(name) {
        if (typeof name !== 'string') return [];
        if (nameToPathCache[name]) return nameToPathCache[name];
        var parts = name.split(".");
        var path = [];
        for (var i = 0; i < parts.length; i++)
        {
            var match = parts[i].match(/([a-zA-Z0-9_]+)\[([^\]]+)\]/);
            if (match)
            {
                path.push(match[1]);
                if (/^\d+$/.test(match[2]))
                    path.push(parseInt(match[2]));
                else
                    path.push(match[2]);                    
            }
            else
            {
                path.push(parts[i]);
            }                    
        } 
        return (nameToPathCache[name] = path.reverse());
    };

    return {
        encode: encode,
        isEmpty: isEmpty,       
        link: function(val) {
            if (typeof val !== 'string')
                return val;

            return String.format('<a target="_blank" href="http://{0}">{0}</a>', val);
        },
        mail: function(val) {
            if (typeof val !== 'string')
                return val;

            return String.format('<a href="mailto:{0}">{0}</a>', val);            
        },
        dotValueProvider: function(o, name) {
            var path = nameToPath(name).slice(0);
            var current = o;
            while (current && path.length > 0)
            {
                var key = path.pop();
                if (current[key]) current = current[key]; else return null;
            }                                
            return current;
        },
        trim: function(val) {
            return val.replace(/^\s+|\s+$/g,'');
        }
    };
})();

