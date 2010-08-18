/**
 * Created by IntelliJ IDEA.
 * User: mimorton
 * Date: Aug 9, 2010
 * Time: 12:40:44 PM
 * To change this template use File | Settings | File Templates.
 */
dojo.provide('Sage.Data.SDataStore');

(function() {
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

    var getValue = function(o, name) {
        var path = nameToPath(name).slice(0);
        var current = o;
        while (current && path.length > 0)
        {
            var key = path.pop();
            if (current[key]) current = current[key]; else return null;
        }
        return current;
    };
    var setValue = function(o, name, val) {
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
    };

    dojo.declare('Sage.Data.SDataStore', null, {  
        constructor: function(o) {
            dojo.mixin(this, o);

            this.features = {'dojo.data.api.Read':true};
        },
        fetch: function(context) {
            //console.log('context: %o', context);                     

            if (!this.isNewContext(context) && this.feed)
            {
                this.onSuccess(context, this.feed);
                return;
            }

            this.setContext(context);

            var request = new Sage.SData.Client.SDataResourceCollectionRequest(this.service)
                .setResourceKind(this.resourceKind)
                .setStartIndex(context.start)
                .setCount(context.count);

            if (this.select && this.select.length > 0)
                request.setQueryArg('select', this.select.join(','));

            if (this.include && this.include.length > 0)
                request.setQueryArg('include', this.include.join(','));

            if (context.sort && context.sort.length > 0)
            {
                var order = [];
                Sage.each(context.sort, function(i, v) {
                    if (v.descending)
                        this.push(v.attribute + ' desc');
                    else
                        this.push(v.attribute);
                }, order);
                request.setQueryArg('orderby', order.join(','));
            }

            var key = request.read({
                success: dojo.hitch(this, this.onSuccess, context),
                failure: dojo.hitch(this, this.onFailure, context)
            });

            return {
                abort: dojo.hitch(this, this.abortRequest, key)
            };
        },
        abortRequest: function(key) {
            this.service.abortRequest(key);
        },
        onSuccess: function(context, feed)
        {
            //console.log('success: %o, %o', context, feed);

            if (context.onBegin) context.onBegin.call(context.scope || this, feed.$totalResults, context);
            if (context.onComplete) context.onComplete.call(context.scope || this, feed.$resources, context);
        },
        onFailure: function(context, request, o)
        {
            //console.log('failure: %o, %o, %o', context, request, o);

            if (context.onError) context.onError.call(context.scope || this, request.responseText, context);
        },
        setContext: function(newContext) {
            this.feed = false;
            this.context = {
                start: newContext.start,
                count: newContext.count,
                query: newContext.query,
                queryOptions: newContext.queryOptions,
                sort: newContext.sort
            };
        },
        isNewContext: function(newContext) {
            if (typeof this.context !== 'object') return true;

            if (this.context.start !== newContext.start) return true;
            if (this.context.count !== newContext.count) return true;

            return false;
        },
        getValue: function(item, attribute, defaultValue)
        {
            return getValue(item, attribute);
        },
        getFeatures: function() {
            return this.features; 
        }
    });        
})();