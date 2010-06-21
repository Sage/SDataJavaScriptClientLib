/// <reference path="../dependencies/ext/ext-core-debug.js"/>

Ext.namespace("Sage.SData.Client");

Sage.SData.Client.SDataUri = Ext.extend(Ext.util.Observable, {   
    constructor: function(uri) {
        /// <field name="scheme" type="String"></field>        

        Sage.SData.Client.SDataUri.superclass.constructor.call(this);     
        
        this.scheme = Sage.SData.Client.SDataUri.Http;
        this.host = '';
        this.server = '';
        this.port = Sage.SData.Client.SDataUri.UnspecifiedPort;
        this.queryArgs = {};
        this.pathSegments = [];
        this.startIndex = false;
        this.count = false;
        this.version = {
            major: 1,
            minor: 0
        };

        Ext.apply(this, uri);                                     
    },
    getVersion: function() {
        return this.version;
    },
    setVersion: function(val) {
        this.version = Ext.apply({ 
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
            ? Ext.apply(this.queryArgs, val) 
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
        this.pathSegments[i] = Ext.apply(this.pathSegments[i] || {}, segment);        
        return this;
    },      
    getStartIndex: function() {
        return this.queryArgs[Sage.SData.Client.SDataUri.QueryArgNames.StartIndex]
            ? parseInt(this.queryArgs[Sage.SData.Client.SDataUri.QueryArgNames.StartIndex])
            : false;         
    },
    setStartIndex: function(val) {
        this.queryArgs[Sage.SData.Client.SDataUri.QueryArgNames.StartIndex] = val;
        return this;
    },
    getCount: function() {
        return this.queryArgs[Sage.SData.Client.SDataUri.QueryArgNames.Count]
            ? parseInt(this.queryArgs[Sage.SData.Client.SDataUri.QueryArgNames.Count])
            : false;   
    },
    setCount: function(val) {
        this.queryArgs[Sage.SData.Client.SDataUri.QueryArgNames.Count] = val;
        return this;
    },
    getIncludeContent: function() {
        if (this.version.major >= 1)        
            return this.queryArgs[Sage.SData.Client.SDataUri.QueryArgNames.IncludeContent] == 'true';
        else
            return this.queryArgs[Sage.SData.Client.SDataUri.QueryArgNames.LegacyIncludeContent] == 'true';
    },
    setIncludeContent: function(val) {
        if (this.version.major >= 1)
            this.queryArgs[Sage.SData.Client.SDataUri.QueryArgNames.IncludeContent] = val ? 'true' : 'false';
        else
            this.queryArgs[Sage.SData.Client.SDataUri.QueryArgNames.LegacyIncludeContent] = val ? 'true' : 'false';
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
    toString: function() {
        var url = [];

        url.push(this.getScheme());
        url.push(Sage.SData.Client.SDataUri.SchemeSuffix);
        url.push(Sage.SData.Client.SDataUri.PathSegmentPrefix);
        url.push(Sage.SData.Client.SDataUri.PathSegmentPrefix);
        url.push(this.getHost());

        if (this.getPort() !== Sage.SData.Client.SDataUri.UnspecifiedPort)
        {
            url.push(Sage.SData.Client.SDataUri.PortPrefix);
            url.push(this.getPort());
        }

        url.push(Sage.SData.Client.SDataUri.PathSegmentPrefix);

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

        url.push(path.join(Sage.SData.Client.SDataUri.PathSegmentPrefix));

        var queryArgs = this.getQueryArgs();
        var query = [];

        for (var key in queryArgs)
        {
            query.push(
                encodeURIComponent(key) + 
                Sage.SData.Client.SDataUri.QueryArgValuePrefix + 
                encodeURIComponent(queryArgs[key])
            );
        }

        if (query.length > 0)
        {
            url.push(Sage.SData.Client.SDataUri.QueryPrefix);
            url.push(query.join(Sage.SData.Client.SDataUri.QueryArgPrefix));
        }

        return url.join('');
    },   
    getProduct: function() {
        return this.getPathSegment(Sage.SData.Client.SDataUri.ProductPathIndex);                 
    },
    setProduct: function(val) {
        return this.setPathSegment(Sage.SData.Client.SDataUri.ProductPathIndex, val);
    },
    getContract: function() {
        return this.getPathSegment(Sage.SData.Client.SDataUri.ContractTypePathIndex);                 
    },
    setContract: function(val) {
        return this.setPathSegment(Sage.SData.Client.SDataUri.ContractTypePathIndex, val);
    },
    getCompanyDataset: function() {
        return this.getPathSegment(Sage.SData.Client.SDataUri.CompanyDatasetPathIndex);                 
    },
    setCompanyDataset: function(val) {
        return this.setPathSegment(Sage.SData.Client.SDataUri.CompanyDatasetPathIndex, val);        
    },
    getCollectionType: function() {
        return this.getPathSegment(Sage.SData.Client.SDataUri.CollectionTypePathIndex);                 
    },
    setCollectionType: function(val) {
        return this.setPathSegment(Sage.SData.Client.SDataUri.CollectionTypePathIndex, val);
    },
    getCollectionPredicate: function() {
        var segment = this.getPathSegment(Sage.SData.Client.SDataUri.CollectionTypePathIndex);
        return segment && segment['predicate']
            ? segment['predicate']
            : false           
    },
    setCollectionPredicate: function(val) {
        return this.setPathSegment(Sage.SData.Client.SDataUri.CollectionTypePathIndex, {
            predicate: val
        });
    }
});

Ext.apply(Sage.SData.Client.SDataUri, {
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
    ServiceMethodSegment: '$service'
});
