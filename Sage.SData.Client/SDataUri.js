/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../ObjTree.js"/>

Ext.namespace("Sage.SData.Client");

Sage.SData.Client.SDataUri = Ext.extend(Ext.util.Observable, {   
    constructor: function(uri) {
        /// <field name="scheme" type="String"></field>
        /// <field name="scheme" type="String"></field>
        /// <field name="scheme" type="String"></field>
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

        Ext.apply(this, uri);                                     
    },
    getScheme: function() {             
        return this.scheme; 
    },
    setScheme: function(val) { 
        this.scheme = val; 
        return this;
    },
    getHost: function() { 
        return this.host; 
    },
    setHost: function(val) {
        this.host = val;
        return this;
    },
    getPort: function() {
        return this.port;
    },
    setPort: function(val) {
        this.port = val;
        return this;
    },
    getServer: function() {
        return this.server;
    },
    setServer: function(val) {
        this.server = val;
        return this;
    },
    getQueryArgs: function() { 
        return this.queryArgs;
    },
    setQueryArgs: function(val, replace) {       
        this.queryArgs = replace !== true 
            ? Ext.apply(this.queryArgs, val) 
            : val;
        return this;
    },
    getQueryArg: function(key) {
        return this.queryArgs[key];
    },
    setQueryArg: function(key, val) {
        this.queryArgs[key] = val;
        return this;
    },
    getPathSegments: function() {
        /// <returns elementType="String"></returns>
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
    setPathSegment: function(i, val) {
        this.pathSegments[i] = typeof val === 'string'
            ? {text: val}
            : val;
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
        return this.queryArgs[Sage.SData.Client.SDataUri.QueryArgNames.IncludeContent] == 'true';
    },
    setIncludeContent: function(val) {
        this.queryArgs[Sage.SData.Client.SDataUri.QueryArgNames.IncludeContent] = val ? 'true' : 'false';
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
            // need to check predicate for beginning and end parenthesis and strip them
            if (segments[i]['predicate'])
                path.push(encodeURIComponent(segments[i]['text'] + '(' + segments[i]['predicate'] + ')'));
            else
                path.push(encodeURIComponent(segments[i]['text']));
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
        var segment = this.getPathSegment(Sage.SData.Client.SDataUri.CollectionTypePathIndex);
        if (segment)
            segment['predicate'] = val;
        return this;
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
    ServiceMethodSegment: '$service'
});
