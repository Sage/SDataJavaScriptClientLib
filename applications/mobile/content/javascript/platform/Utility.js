/// <reference path="../ext/ext-core-debug.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.Utility = (function() {
    var nameToPathCache = {};
    var nameToPath = function(name) {
        if (typeof name !== 'string') return [];
        if (nameToPathCache[name]) return nameToPathCache[name];
        var parts = name.split('.');
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
        getValue: function(o, name) {
            var path = nameToPath(name).slice(0);
            var current = o;
            while (current && path.length > 0)
            {
                var key = path.pop();
                if (current[key]) current = current[key]; else return null;
            }                                
            return current;
        },
        setValue: function(o, name, val) {
            var current = o;
            var path = nameToPath(name).slice(0);         
            while ((typeof current !== "undefined") && path.length > 1)
            {
                var key = path.pop();                
                if (path.length > 0) 
                {
                    var next = path[path.length - 1];                                         
                    current = current[key] = (typeof current[key] !== "undefined") ? current[key] : (typeof next === "number") ? [] : {};
                }
            }  
            if (typeof path[0] !== "undefined")
                current[path[0]] = val;            
            return o;      
        }
    };
})();