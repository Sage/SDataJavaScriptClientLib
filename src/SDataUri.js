/// <reference path="../libraries/ext/ext-core-debug.js"/>

(function(){
    var S = Sage,
        C = S.namespace('SData.Client');

    C.SDataUri = S.Class.define({
        constructor: function(uri) {
            /// <field name="scheme" type="String"></field>

            this.base.apply(this, arguments);

            this.scheme = C.SDataUri.Http;
            this.host = '';
            this.server = '';
            this.port = C.SDataUri.UnspecifiedPort;
            this.queryArgs = {};
            this.pathSegments = [];
            this.startIndex = false;
            this.count = false;
            this.version = {
                major: 1,
                minor: 0
            };

            S.apply(this, uri);
        },
        getVersion: function() {
            return this.version;
        },
        setVersion: function(val) {
            this.version = S.apply({
                major: 0,
                minor: 0
            }, val);
            return this;
        },
        getScheme: function() {
            /// <returns type="String">The scheme component of the URI.</returns>
            return this.scheme;
        },
        setScheme: function(val) {
            /// <param name="val" type="String">The new scheme for the URI</param>
            this.scheme = val;
            return this;
        },
        getHost: function() {
            /// <returns type="String">The host component of the URI.</returns>
            return this.host;
        },
        setHost: function(val) {
            /// <param name="val" type="String">The new host for the URI</param>
            this.host = val;
            return this;
        },
        getPort: function() {
            /// <returns type="Number">The port component of the URI.</returns>
            return this.port;
        },
        setPort: function(val) {
            /// <param name="val" type="String">The new port for the URI</param>
            this.port = val;
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
        setServer: function(val) {
            /// <param name="val" type="String">The new SData "server" for the URI</param>
            this.server = val;
            return this;
        },
        getQueryArgs: function() {
            /// <returns type="Object">The query arguments of the URI.</returns>
            return this.queryArgs;
        },
        setQueryArgs: function(val, replace) {
            /// <param name="val" type="Object">
            ///     The query arguments that will either be merged with the existing values, or replace
            ///     them entirely.
            /// <param>
            /// <param name="replace" type="Boolean" optional="true">True if you want to replace the existing query arguments.</param>
            this.queryArgs = replace !== true
                ? S.apply(this.queryArgs, val)
                : val;
            return this;
        },
        getQueryArg: function(key) {
            /// <summary>Returns the requested query argument.</summary>
            /// <param name="key" type="String">The name of the query argument to be returned.</param>
            /// <returns type="String">The value of the requested query argument.</returns>
            return this.queryArgs[key];
        },
        setQueryArg: function(key, val) {
            /// <summary>Sets a requested query argument.</summary>
            /// <param name="key" type="String">The name of the query argument to be set.</param>
            /// <param name="val" type="String">The new value for the query argument.</param>
            this.queryArgs[key] = val;
            return this;
        },
        getPathSegments: function() {
            /// <returns elementType="String">The path segments of the URI.</returns>
            return this.pathSegments;
        },
        setPathSegments: function(val) {
            this.pathSegments = val;
            return this;
        },
        getPathSegment: function(i) {
            return this.pathSegments.length > i
                ? this.pathSegments[i]
                : false;
        },
        setPathSegment: function(i, segment, predicate) {
            if (typeof segment === 'string')
            {
                var segment = {
                    'text': segment
                };
                if (predicate) segment['predicate'] = predicate;
            }
            this.pathSegments[i] = S.apply(this.pathSegments[i] || {}, segment);
            return this;
        },
        getStartIndex: function() {
            return this.queryArgs[C.SDataUri.QueryArgNames.StartIndex]
                ? parseInt(this.queryArgs[C.SDataUri.QueryArgNames.StartIndex])
                : false;
        },
        setStartIndex: function(val) {
            this.queryArgs[C.SDataUri.QueryArgNames.StartIndex] = val;
            return this;
        },
        getCount: function() {
            return this.queryArgs[C.SDataUri.QueryArgNames.Count]
                ? parseInt(this.queryArgs[C.SDataUri.QueryArgNames.Count])
                : false;
        },
        setCount: function(val) {
            this.queryArgs[C.SDataUri.QueryArgNames.Count] = val;
            return this;
        },
        getIncludeContent: function() {
            if (this.version.major >= 1)
                return this.queryArgs[C.SDataUri.QueryArgNames.IncludeContent] == 'true';
            else
                return this.queryArgs[C.SDataUri.QueryArgNames.LegacyIncludeContent] == 'true';
        },
        setIncludeContent: function(val) {
            if (this.version.major >= 1)
                this.queryArgs[C.SDataUri.QueryArgNames.IncludeContent] = val ? 'true' : 'false';
            else
                this.queryArgs[C.SDataUri.QueryArgNames.LegacyIncludeContent] = val ? 'true' : 'false';
            return this;
        },
        appendPath: function(val) {
            this.pathSegments.push(
                typeof val === 'string'
                    ? {text: val}
                    : val
            );
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
            return segment && segment['predicate']
                ? segment['predicate']
                : false
        },
        setCollectionPredicate: function(val) {
            return this.setPathSegment(C.SDataUri.CollectionTypePathIndex, {
                predicate: val
            });
        }
    });

    S.apply(C.SDataUri, {
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
        NamedQuerySegment: '$queries'
    });
})();
