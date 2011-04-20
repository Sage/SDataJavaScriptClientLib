(function() {
    var nameToPathCache = {};
    var nameToPath = function(name) {
            if (typeof name !== 'string' || name === '.' || name === '') return []; // '', for compatibility
            if (nameToPathCache[name]) return nameToPathCache[name];
            var parts = name.split('.');
            var path = [];
            for (var i = 0; i < parts.length; i++)
            {
                var match = parts[i].match(/([a-zA-Z0-9_$]+)\[([^\]]+)\]/);
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
        },
        getValue =function(o, name, defaultValue) {
            var path = nameToPath(name).slice(0);
            var current = o;
            while (current && path.length > 0)
            {
                var key = path.pop();
                if (typeof current[key] !== 'undefined')
                    current = current[key];
                else
                    return typeof defaultValue !== 'undefined' ? defaultValue : null;
            }
            return current;
        };

    beforeEach(function() {
        this.addMatchers({
            toHaveProperty: function(name, value) {
                var empty = {},
                    actual = getValue(this.actual, name, empty);
                return value === undefined
                    ? actual !== empty
                    : actual == value;
            },
            toExist: function() {
                return !!this.actual;
            }
        });
    });
})();