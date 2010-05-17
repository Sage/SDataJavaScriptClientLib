/*!
 * 
 */
﻿/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../ObjTree.js"/>
/// <reference path="SDataUri.js"/>

Ext.namespace("Sage.SData.Client");

Sage.SData.Client.SDataBaseRequest = Ext.extend(Ext.util.Observable, {   
    constructor: function(service) {        
        Sage.SData.Client.SDataBaseRequest.superclass.constructor.call(this);                                        

        this.service = service;
        this.uri = new Sage.SData.Client.SDataUri();

        if (this.service) 
        {            
            this.uri.setIncludeContent(this.service.getIncludeContent());
            this.uri.setServer(this.service.getVirtualDirectory() ? this.service.getVirtualDirectory() : 'sdata');
            this.uri.setScheme(this.service.getProtocol());
            this.uri.setHost(this.service.getServerName());
            this.uri.setPort(this.service.getPort());                        
        }
    },
    getService: function() {
        /// <returns type="Sage.SData.Client.SDataService" />
        return this.service;
    },
    getUri: function() {
        /// <returns type="Sage.SData.Client.SDataUri" />
        return this.uri;
    },
    setUri: function(val) {
        this.uri = val;
        return this;
    },
    getServerName: function() {
        return this.uri.getHost();
    },
    setServerName: function(val) {
        this.uri.setHost(val);
        return this;
    },
    getVirtualDirectory: function() {
        return this.uri.getServer();
    },    
    setVirtualDirectory: function(val) {
        this.uri.setServer(val);
        return this;
    },
    getProtocol: function() {
        return this.uri.getScheme();
    },
    setProtocol: function(val) {
        this.uri.setScheme(val);
        return this;
    },
    getPort: function() {
        return this.uri.getPort();
    },
    setPort: function(val) {
        this.uri.setPort(val);
        return this;
    },
    getQueryArgs: function() { 
        return this.uri.getQueryArgs();
    },
    setQueryArgs: function(val) {
        this.uri.setQueryArgs(val);
        return this;
    },
    getQueryArg: function(key) {
        return this.uri.getQueryArg(key);
    },
    setQueryArg: function(key, val) {
        this.uri.setQueryArg(key, val);
        return this;
    },
    buildUrl: function(uri) {

    },
    toString: function() {
        var uri = new Sage.SData.Client.SDataUri(this.uri);
        
        this.buildUrl(uri);

        return uri.toString();
    }
});

﻿/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>

Ext.namespace("Sage.SData.Client");

Sage.SData.Client.SDataApplicationRequest = Ext.extend(Sage.SData.Client.SDataBaseRequest, {   
    constructor: function() {        
        Sage.SData.Client.SDataApplicationRequest.superclass.constructor.apply(this, arguments);  
        
        if (this.service)
        {
            this.uri.setProduct(this.service.getApplicationName() ? this.service.getApplicationName() : '-');
            this.uri.setContract(this.service.getContractName() ? this.service.getContractName() : '-');
            this.uri.setCompanyDataset(this.service.getDataSet() ? this.service.getDataSet() : '-');
        }
    },
    getApplicationName: function() {
        return this.uri.getProduct();        
    },
    setApplicationName: function(val) {
        this.uri.setProduct(val);
        return this;
    },
    getContractName: function() {
        return this.uri.getContract();
    },
    setContractName: function(val) {
        this.uri.setContract(val);
        return this;
    },
    getDataSet: function() {
        return this.uri.getCompanyDataset(); 
    },
    setDataSet: function(val) {
        this.uri.setCompanyDataset(val); 
        return this;
    },
    getResourceKind: function() {
        return this.resourceKind;
    },
    setResourceKind: function(val) {
        this.resourceKind = val;
        return this;
    },
    buildUrl: function(uri) {
        /// <param name="uri" type="Sage.SData.Client.SDataUri" />

        Sage.SData.Client.SDataApplicationRequest.superclass.buildUrl.apply(this, arguments);

        uri.appendPath(this.getResourceKind());
    }
});
﻿/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

Ext.namespace("Sage.SData.Client");

Sage.SData.Client.SDataResourceCollectionRequest = Ext.extend(Sage.SData.Client.SDataApplicationRequest, {   
    constructor: function() {        
        Sage.SData.Client.SDataResourceCollectionRequest.superclass.constructor.apply(this, arguments);                                                      
    },
    getCount: function() {
        return this.uri.getCount();         
    },
    setCount: function(val) {
        this.uri.setCount(val);
        return this;
    },
    getStartIndex: function() {
        return this.uri.getStartIndex();        
    },
    setStartIndex: function(val) {
        this.uri.setStartIndex(val);
        return this;
    },
    read: function(options) {
        return this.service.readFeed(this, options);
    } 
});
﻿/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

Ext.namespace("Sage.SData.Client");

Sage.SData.Client.SDataSingleResourceRequest = Ext.extend(Sage.SData.Client.SDataApplicationRequest, {   
    constructor: function() {        
        Sage.SData.Client.SDataSingleResourceRequest.superclass.constructor.apply(this, arguments);
        
        this.resourceSelector = false;                                                   
    },       
    read: function(options) {
        return this.service.readEntry(this, options);
    },
    update: function(entry, options) {
        return this.service.updateEntry(this, entry, options);
    },
    getResourceSelector: function() {
        return this.resourceSelector;
    },
    setResourceSelector: function(val) {
        this.resourceSelector = val;
        return this;
    },
    buildUrl: function(uri) {
        /// <param name="uri" type="Sage.SData.Client.SDataUri" />

        Sage.SData.Client.SDataSingleResourceRequest.superclass.buildUrl.apply(this, arguments);

        if (this.resourceSelector) uri.setCollectionPredicate(this.resourceSelector);
    }
});﻿/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>

Ext.namespace("Sage.SData.Client");

Sage.SData.Client.SDataSystemRequest = Ext.extend(Sage.SData.Client.SDataBaseRequest, {   
    constructor: function() {        
        Sage.SData.Client.SDataSystemRequest.superclass.constructor.apply(this, arguments);          
        
        this.category = false;
    },    
    getCategory: function() {
        return this.category;
    },
    setCategory: function(val) {
        this.category = val;
        return this;
    },
    buildUrl: function(uri) {
        /// <param name="uri" type="Sage.SData.Client.SDataUri" />

        Sage.SData.Client.SDataSystemRequest.superclass.buildUrl.apply(this, arguments);

        uri.appendPath('$system');

        if (this.category) uri.appendPath(this.category);
    },
    read: function(options) {
        return this.service.readFeed(this, options);
    } 
});
﻿/// <reference path="../ext/ext-core-debug.js"/>

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

        Ext.apply(this, uri);                                     
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
            if (typeof segments[i] === 'undefined') continue;

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
﻿/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../ObjTree.js"/>
/// <reference path="../Base64.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>
/// <reference path="SDataResourceCollectionRequest.js"/>
/// <reference path="SDataUri.js"/>

Ext.namespace("Sage.SData.Client");

Sage.SData.Client.SDataService = Ext.extend(Ext.util.Observable, {  
    constructor: function() {
        /// <field name="uri" type="Sage.SData.Client.SDataUri" />

        Sage.SData.Client.SDataService.superclass.constructor.apply(this, arguments);

        this.uri = new Sage.SData.Client.SDataUri();
        this.userAgent = 'Sage';
        this.username = false;
        this.password = '';
    },
    getUri: function() {
        /// <returns type="Sage.SData.Client.SDataUri" />
        return this.uri;
    },
    getUserName: function() {
        /// <returns type="String" />
        return this.username;
    },
    setUserName: function(val) {
        this.username = val;
        return this;
    },
    getPassword: function() {
        return this.password;
    },
    setPassword: function(val) {
        this.password = val;
        return this;
    },
    getProtocol: function() {
        return this.uri.getScheme();
    },
    setProtocol: function(val) {
        this.uri.setScheme(val);
        return this;
    },
    getServerName: function() {
        return this.uri.getHost();
    },
    setServerName: function(val) {
        this.uri.setHost(val);
        return this;
    },
    getPort: function() {
        return this.uri.getPort();
    },
    setPort: function(val) {
        this.uri.setPort(val);
        return this;
    },
    getVirtualDirectory: function() {
        return this.uri.getServer();  
    },
    setVirtualDirectory: function(val) {        
        this.uri.setServer(val);
        return this;
    },
    getApplicationName: function() {
        return this.uri.getProduct();
    },
    setApplicationName: function(val) { 
        this.uri.setProduct(val);
        return this;
    },
    getContractName: function() {    
        return this.uri.getContract();
    },
    setContractName: function(val) {
        this.uri.setContract(val);
        return this;
    },
    getDataSet: function() {
        return this.uri.getCompanyDataset();
    },
    setDataSet: function(val) {
        this.uri.setCompanyDataset(val);
        return this;
    },
    getIncludeContent: function() {
        return this.uri.getIncludeContent();
    },
    setIncludeContent: function(val) {
        this.uri.setIncludeContent(val);
        return this;
    },
    getUserAgent: function() {
        return this.userAgent;
    },
    setUserAgent: function(val) {
        this.userAgent = val;
        return this;
    },
    createBasicAuthToken: function() {
        return 'Basic ' + Base64.encode(this.username + ":" + this.password);
    },
    createHeadersForRequest: function(request) {
        var headers = {
            /* 'User-Agent': this.userAgent */ /* 'User-Agent' cannot be set on XmlHttpRequest */
            'X-Authorization-Mode': 'no-challenge'
        };
        
        if (this.username !== false)
            headers['Authorization'] = headers['X-Authorization'] = this.createBasicAuthToken();
            
        return headers;        
    },        
    executeRequest: function(request, options, ajax) {
        var o = Ext.apply({
            headers: {},
            method: 'GET'
        }, {
            url: request.toString(),
            scope: this,
            success: function(response, opt) {                
                var feed = this.processFeed(response.responseText);

                if (options.success)
                    options.success.call(options.scope || this, feed);
            },
            failure: function(response, opt) {
                if (options.failure)
                    options.failure.call(options.scope || this, response, opt);
            }                            
        }, ajax);

        Ext.apply(o.headers, this.createHeadersForRequest(request));

        Ext.Ajax.request(o);
    },    
    readFeed: function(request, options) {  
        /// <param name="request" type="Sage.SData.Client.SDataResourceCollectionRequest">request object</param>          
        this.executeRequest(request, options, {
            headers: {
                'Accept': 'application/atom+xml;type=feed'
            }
        });
    },   
    readEntry: function(request, options) {
        /// <param name="request" type="Sage.SData.Client.SDataSingleResourceRequest">request object</param>      
        var o = Ext.apply({}, {
            success: function(feed) {
                var entry = feed['$resources'][0] || false;                 

                if (options.success)                 
                    options.success.call(options.scope || this, entry);                                
            }
        }, options);

        this.executeRequest(request, o, {
            headers: {
                'Accept': 'application/atom+xml;type=entry'
            }
        });
    },
    updateEntry: function(request, entry, options) {
        /// <param name="request" type="Sage.SData.Client.SDataSingleResourceRequest">request object</param>
        var xml = new XML.ObjTree();
        xml.attr_prefix = '@';

        var body = xml.writeXML(this.formatEntry(entry));

        this.executeRequest(request, Ext.apply({}, {
            success: function(feed) {
                var entry = feed['$resources'][0] || false;                 

                if (options.success)                 
                    options.success.call(options.scope || this, entry);                                
            }
        }, options), {
            method: 'PUT',
            xmlData: body,
            headers: {
                'Content-Type': 'application/atom+xml;type=entry',
                'Accept': 'application/atom+xml;type=entry',
                'If-Match': entry['$etag']
            }
        });
    },
    parseFeedXml: function(text) {
        var xml = new XML.ObjTree();
        xml.attr_prefix = '@';

        return xml.parseXML(text);
    }, 
    convertEntity: function(ns, name, entity, applyTo) {
        applyTo = applyTo || {};

        applyTo['$name'] = name;
        applyTo['$key'] = entity['@sdata:key'];
        applyTo['$url'] = entity['@sdata:uri'];        
        
        var prefix = ns + ':'; 

        for (var fqPropertyName in entity)
        {
            if (fqPropertyName.indexOf(prefix) === 0)
            {
                var propertyName = fqPropertyName.substring(prefix.length);
                var value = entity[fqPropertyName];     
                    
                if (typeof value === 'object')
                {
                    if (value.hasOwnProperty('@xsi:nil')) // null
                    {
                        var converted = null;
                    }                    
                    else if (value.hasOwnProperty('@sdata:key')) // included
                    {
                        var converted = this.convertEntity(ns, propertyName, value);
                    }

                    value = converted;
                }                                                      

                applyTo[propertyName] = value;                   
            }
        }

        return applyTo;
    },
    formatEntity: function(ns, entity, applyTo) {
        applyTo = applyTo || {};

        applyTo['@sdata:key'] = entity['$key'];
        applyTo['@sdata:uri'] = entity['$url'];

        // note: not using namespaces at this time

        for (var propertyName in entity)
        {
            if (/^\$/.test(propertyName)) continue;

            var value = entity[propertyName];

            if (value == null)
            {
                value = {'@xsi:nil': 'true'};
            }
            else if (typeof value === 'object')
            {
                value = this.formatEntity(ns, value);
            }

            applyTo[propertyName] = value;
        }

        return applyTo;
    },
    convertEntry: function(entry) {
        var result = {};

        result['$descriptor'] = entry['title'];
        result['$etag'] = entry['http:etag'];
        result['$httpStatus'] = entry['http:httpStatus'];

        var payload = entry['sdata:payload'];

        for (var key in payload)
        {
            if (payload.hasOwnProperty(key) == false) continue;

            var parts = key.split(':');
            if (parts.length < 2) continue;

            var ns = parts[0];
            var name = parts[1];                     
            var entity = payload[key];

            this.convertEntity(ns, name, entity, result);
        }

        return result;
    },
    formatEntry: function(entry) {
        var result = {};
        
        result['@xmlns:sdata'] = 'http://schemas.sage.com/sdata/2008/1';
        result['@xmlns:xsi'] = 'http://www.w3.org/2001/XMLSchema-instance';
        result['@xmlns:http'] = 'http://schemas.sage.com/sdata/http/2008/1';
        result['@xmlns'] = 'http://www.w3.org/2005/Atom';

        result['http:etag'] = entry['$etag'];
        result['sdata:payload'] = {};
        result['sdata:payload'][entry['$name']] = {
            '@xmlns': 'http://schemas.sage.com/dynamic/2007'
        };
  
        this.formatEntity(false, entry, result['sdata:payload'][entry['$name']]);

        return {'entry': result};
    },
    convertFeed: function(feed) {
        var result = {};

        if (feed['opensearch:totalResults'])
            result['$totalResults'] = parseInt(feed['opensearch:totalResults']);

        if (feed['opensearch:startIndex'])
            result['$startIndex'] = parseInt(feed['opensearch:startIndex']);

        if (feed['opensearch:itemsPerPage'])
            result['$itemsPerPage'] = parseInt(feed['opensearch:itemsPerPage']);

        if (feed['link']) 
        {
            result['$link'] = {};
            for (var i = 0; i < feed['link'].length; i++)
                result['$link'][feed['link'][i]['@rel']] = feed['link'][i]['@href'];

            if (result['$link']['self']) 
                result['$url'] = result['$link']['self'];
        }

        result['$resources'] = [];

        if (Ext.isArray(feed['entry']))
            for (var i = 0; i < feed['entry'].length; i++)
                result['$resources'].push(this.convertEntry(feed['entry'][i]));
        else if (typeof feed['entry'] === 'object')
            result['$resources'].push(this.convertEntry(feed['entry']));

        return result;
    },
    processFeed: function(text) {
        var doc = this.parseFeedXml(text);

        // depending on the User-Agent the SIF will either send back a feed, or a single entry
        if (doc.hasOwnProperty('feed'))
            return this.convertFeed(doc['feed']);
        else if (doc.hasOwnProperty('entry'))
            return {
                '$resources': [
                    this.convertEntry(doc['entry'])
                ]
            };
        else
            return false;
    }
});