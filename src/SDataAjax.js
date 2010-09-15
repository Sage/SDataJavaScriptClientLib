(function(){
    var S = Sage,
        A = S.namespace('SData.Client.Ajax');

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
                if (o.success)
                    o.success.call(o.scope || this, xhr, o);
            }
            else
            {
                if (o.failure)
                    o.failure.call(o.scope || this, xhr, o);
            }
        }
    };

    var bindOnReadyStateChange = function(xhr, o) {
        xhr.onreadystatechange = function() {
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

    S.apply(A, {
        request: function(o) {
            var o = S.apply({}, o);

            o.params = S.apply({}, o.params);
            o.headers = S.apply({}, o.headers);

            if (o.cache !== false)
                o.params[o.cacheParam || '_t'] = (new Date()).getTime();

            o.method = o.method || 'GET';

            var parameters = buildParameters(o.params);
            if (parameters)
                o.url = o.url + (/\?/.test(o.url) ? '&' : '?') + parameters;

            var xhr = new XMLHttpRequest();

            if (o.user)
            {
                xhr.open(o.method, o.url, o.async !== false, o.user, o.password);
                xhr.withCredentials = true;
            }
            else
                xhr.open(o.method, o.url, o.async !== false);

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
