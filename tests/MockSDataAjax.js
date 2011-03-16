(function(){
    var S = Sage,
        A = S.namespace('SData.Client.Ajax');    

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

    var expand = function(scope, expression) {
        if (typeof expression === 'function')
            return expression.apply(scope || this, Array.prototype.slice.call(arguments, 2));
        else
            return expression;
    };

    var request = A.request;
    var cancel = A.cancel;

    S.apply(A, {
        scopes: [],
        request: function(options) {
            var o = S.apply({}, options);

            o.params = S.apply({}, o.params);
            o.headers = S.apply({}, o.headers);

            if (o.cache !== false)
                o.params[o.cacheParam || '_t'] = (new Date()).getTime();

            o.method = o.method || 'GET';

            var parameters = buildParameters(o.params);
            if (parameters)
                o.requestUrl = o.url + (/\?/.test(o.url) ? '&' : '?') + parameters;
            else
                o.requestUrl = o.url;

            var rule = this._resolveMockRequestRule(o);
            if (rule)
            {
                if (rule.capture) rule.capture.call(rule.scope || this, options);
                
                if (rule.url)
                {
                    return request(S.apply(o, {
                        url: expand(rule.scope, rule.url),
                        method: 'GET'
                    }));
                }
                else if (rule.aborted)
                {
                    var handler = options.aborted || options.failure;
                    if (handler) return handler.call(options.scope || this, expand(rule.scope, rule.aborted), options);
                }
                else if (rule.failure)
                {
                    if (options.failure) return options.failure.call(options.scope || this, expand(rule.scope, rule.failure), options);
                }
                else if (rule.success && options.success)
                {
                    if (options.success) return options.success.call(options.scope || this, expand(rule.scope, rule.success), options);
                }

                throw 'The mock request rule does not have a result.';
            }
            else
            {
                throw 'The request did not match a mock request rule.';
            }
        },
        cancel: function(xhr) {

        },
        push: function(rules) {
            this.scopes.unshift(rules);
        },
        pop: function() {
            this.scopes.shift();
        },
        _resolveMockRequestRule: function(o) {
            for (var i = 0; i < this.scopes.length; i++)
            {
                var rules = this.scopes[i];

                for (var j = 0; j < rules.length; j++)
                {
                    var rule = rules[j],
                        predicate = rule && (rule['predicate'] || rule['p']);

                    if (predicate instanceof RegExp && predicate.test(o.url))
                        return rule;
                    else if (typeof predicate === 'function' && predicate(o))
                        return rule;
                }
            }

            return false;
        }    
    });
})();
