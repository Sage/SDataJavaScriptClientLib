/// <reference path="../libraries/ext/ext-core-debug.js"/>

(function(){
    var S = Sage,
        C = Sage.namespace('Sage.SData.Client'),
        trueRE = /^true$/i;

    Sage.SData.Client.SDataUri = Sage.Class.define({
        scheme: 'http',
        host: '',
        server: '',
        port: -1,
        version: null,
        queryArgs: null,
        pathSegments: null,
        startIndex: false,
        count: false,
        constructor: function(uri) {
            /// <field name="scheme" type="String"></field>

            this.base.apply(this, arguments);

            S.apply(this, uri);

            /* create copies; segments only needs a shallow copy, as elements are replaced, not modified. */
            this.queryArgs = S.apply({}, uri && uri.queryArgs);
            this.pathSegments = (uri && uri.pathSegments && uri.pathSegments.slice(0)) || [];
            this.version = (uri && uri.version && S.apply({}, uri.version)) || { major: 1, minor: 0 };
        },
        getVersion: function() {
            return this.version;
        },
        setVersion: function(value) {
            this.version = S.apply({
                major: 0,
                minor: 0
            }, value);
            
            return this;
        },
        getScheme: function() {
            /// <returns type="String">The scheme component of the URI.</returns>
            return this.scheme;
        },
        setScheme: function(value) {
            /// <param name="val" type="String">The new scheme for the URI</param>
            this.scheme = value;

            return this;
        },
        getHost: function() {
            /// <returns type="String">The host component of the URI.</returns>
            return this.host;
        },
        setHost: function(value) {
            /// <param name="val" type="String">The new host for the URI</param>
            this.host = value;

            return this;
        },
        getPort: function() {
            /// <returns type="Number">The port component of the URI.</returns>
            return this.port;
        },
        setPort: function(value) {
            /// <param name="val" type="String">The new port for the URI</param>
            this.port = value;

            return this;
        },
        getServer: function() {
            /// <summary>
            ///     Access the SData "server" component of the URI.  This is the first path segment in the URI.
            ///
            ///     i.e. [scheme]://[host]/[server]
            /// </summary>
            /// <returns type="String">The SData "server" component of URI.</returns>
            return this.server;
        },
        setServer: function(value) {
            /// <param name="val" type="String">The new SData "server" for the URI</param>
            this.server = value;

            return this;
        },
        getQueryArgs: function() {
            /// <returns type="Object">The query arguments of the URI.</returns>
            return this.queryArgs;
        },
        setQueryArgs: function(value, replace) {
            /// <param name="val" type="Object">
            ///     The query arguments that will either be merged with the existing values, or replace
            ///     them entirely.
            /// <param>
            /// <param name="replace" type="Boolean" optional="true">True if you want to replace the existing query arguments.</param>
            this.queryArgs = replace ? value : S.apply(this.queryArgs, value);

            return this;
        },
        getQueryArg: function(key) {
            /// <summary>Returns the requested query argument.</summary>
            /// <param name="key" type="String">The name of the query argument to be returned.</param>
            /// <returns type="String">The value of the requested query argument.</returns>
            return this.queryArgs[key];
        },
        setQueryArg: function(key, value) {
            /// <summary>Sets a requested query argument.</summary>
            /// <param name="key" type="String">The name of the query argument to be set.</param>
            /// <param name="val" type="String">The new value for the query argument.</param>
            this.queryArgs[key] = value;

            return this;
        },
        getPathSegments: function() {
            /// <returns elementType="String">The path segments of the URI.</returns>
            return this.pathSegments;
        },
        setPathSegments: function(value) {
            this.pathSegments = value;

            return this;
        },
        getPathSegment: function(i) {
            return this.pathSegments.length > i
                ? this.pathSegments[i]
                : false;
        },
        setPathSegment: function(i, value, predicate) {
            var segment = this.pathSegments[i] = typeof value === 'string' ? {text: value} : S.apply({}, value);

            if (predicate) segment['predicate'] = predicate;

            return this;
        },
        applyPathSegment: function(i, value, predicate) {
            var segment = typeof value === 'string' ? {text: value} : S.apply({}, value);

            if (predicate) segment['predicate'] = predicate;

            /* copy existing segment values, then apply new values */
            this.pathSegments[i] = S.apply({}, segment, this.pathSegments[i]);

            return this;
        },
        getStartIndex: function() {
            return this.queryArgs[C.SDataUri.QueryArgNames.StartIndex]
                ? parseInt(this.queryArgs[C.SDataUri.QueryArgNames.StartIndex])
                : false;
        },
        setStartIndex: function(value) {
            this.queryArgs[C.SDataUri.QueryArgNames.StartIndex] = value;

            return this;
        },
        getCount: function() {
            return this.queryArgs[C.SDataUri.QueryArgNames.Count]
                ? parseInt(this.queryArgs[C.SDataUri.QueryArgNames.Count])
                : false;
        },
        setCount: function(value) {
            this.queryArgs[C.SDataUri.QueryArgNames.Count] = value;

            return this;
        },
        getIncludeContent: function() {
            var name = this.version.major >= 1
                ? C.SDataUri.QueryArgNames.IncludeContent
                : C.SDataUri.QueryArgNames.LegacyIncludeContent;

            return trueRE.test(this.queryArgs[name]);
        },
        setIncludeContent: function(value) {
            var name = this.version.major >= 1
                ? C.SDataUri.QueryArgNames.IncludeContent
                : C.SDataUri.QueryArgNames.LegacyIncludeContent;

            this.queryArgs[name] = "" + value;

            return this;
        },
        appendPath: function(value) {
            var segment = typeof value === 'string' ? {text: value} : value;

            this.pathSegments.push(segment);

            return this;
        },
        build: function() {
            var url = [];

            url.push(this.getScheme());
            url.push(C.SDataUri.SchemeSuffix);
            url.push(C.SDataUri.PathSegmentPrefix);
            url.push(C.SDataUri.PathSegmentPrefix);
            url.push(this.getHost());

            if (this.getPort() !== C.SDataUri.UnspecifiedPort)
            {
                url.push(C.SDataUri.PortPrefix);
                url.push(this.getPort());
            }

            url.push(C.SDataUri.PathSegmentPrefix);

            var segments = this.getPathSegments();
            var path = [];

            var server = this.getServer();
            if (server && server.length > 0)
                path = path.concat(server.split('/'));

            for (var i = 0; i < segments.length; i++)
            {
                var segment = segments[i];

                if (typeof segment === 'undefined') continue;

                // need to check predicate for beginning and end parenthesis and strip them
                if (segment['predicate'])
                    path.push(encodeURIComponent(segment['text'] + '(' + segment['predicate'] + ')'));
                else
                    path.push(encodeURIComponent(segment['text']));
            }

            url.push(path.join(C.SDataUri.PathSegmentPrefix));

            var queryArgs = this.getQueryArgs();
            var query = [];

            for (var key in queryArgs)
            {
                query.push(
                    encodeURIComponent(key) +
                    C.SDataUri.QueryArgValuePrefix +
                    encodeURIComponent(queryArgs[key])
                );
            }

            if (query.length > 0)
            {
                url.push(C.SDataUri.QueryPrefix);
                url.push(query.join(C.SDataUri.QueryArgPrefix));
            }

            return url.join('');
        },
        getProduct: function() {
            return this.getPathSegment(C.SDataUri.ProductPathIndex);
        },
        setProduct: function(val) {
            return this.setPathSegment(C.SDataUri.ProductPathIndex, val);
        },
        getContract: function() {
            return this.getPathSegment(C.SDataUri.ContractTypePathIndex);
        },
        setContract: function(val) {
            return this.setPathSegment(C.SDataUri.ContractTypePathIndex, val);
        },
        getCompanyDataset: function() {
            return this.getPathSegment(C.SDataUri.CompanyDatasetPathIndex);
        },
        setCompanyDataset: function(val) {
            return this.setPathSegment(C.SDataUri.CompanyDatasetPathIndex, val);
        },
        getCollectionType: function() {
            return this.getPathSegment(C.SDataUri.CollectionTypePathIndex);
        },
        setCollectionType: function(val) {
            return this.setPathSegment(C.SDataUri.CollectionTypePathIndex, val);
        },
        getCollectionPredicate: function() {
            var segment = this.getPathSegment(C.SDataUri.CollectionTypePathIndex);
            return (segment && segment['predicate']) || false;
        },
        setCollectionPredicate: function(value) {
            return this.applyPathSegment(C.SDataUri.CollectionTypePathIndex, {
                predicate: value
            });
        }
    });

    Sage.apply(Sage.SData.Client.SDataUri, {
        Http: 'http',
        Https: 'https',
        PathSegmentPrefix: '/',
        PortPrefix: ':',
        QueryArgPrefix: '&',
        QueryArgValuePrefix: '=',
        QueryPrefix: '?',
        SchemeSuffix: ':',
        UnspecifiedPort: -1,
        UriName: 'uri',
        QueryArgNames: {
            Count: 'count',
            Exclude: 'exclude',
            Format: 'format',
            Include: 'include',
            IncludeContent: '_includeContent',
            LegacyIncludeContent: 'includeContent',
            IncludeSchema: 'includeSchema',
            Language: 'language',
            OrderBy: 'orderby',
            Precedence: 'precedence',
            ReturnDelta: 'returnDelta',
            Search: 'search',
            Select: 'select',
            StartIndex: 'startIndex',
            Thumbnail: 'thumbnail',
            TrackingID: 'trackingID',
            Where: 'where'
        },
        ProductPathIndex: 0,
        ContractTypePathIndex: 1,
        CompanyDatasetPathIndex: 2,
        CollectionTypePathIndex: 3,
        ResourcePropertyIndex: 4,
        ServiceMethodSegment: '$service',
        TemplateSegment: '$template',
        SystemSegment: '$system',
        NamedQuerySegment: '$queries',
        BatchSegment: '$batch'
    });
})();
