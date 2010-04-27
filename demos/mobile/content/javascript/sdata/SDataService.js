/// <reference path="../ext/ext-core-debug.js"/>
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
            'User-Agent': this.userAgent /* 'User-Agent' cannot be set on XmlHttpRequest */
        };
        
        if (this.username !== false)
            headers['Authorization'] = headers['X-Authorization'] = this.createBasicAuthToken();
            
        return headers;        
    },
    executeRequest: function(request, options) {
        /// <param name="request" type="Sage.SData.Client.SDataBaseRequest">request object</param>     
        var self = this;

        if (typeof options === 'function')
        {
            var options = {
                success: options
            };
        }     
        
        /* temporary fix for iphone authentication issue */
        if (/(iphone|ipad)/.test(navigator.userAgent.toLowerCase()))           
        if (true)
        {
            var old = request.getUri();
            var uri = new Sage.SData.Client.SDataUri(old)
                .setHost(
                    String.format("{0}:{1}@{2}", 
                        encodeURIComponent(this.getUserName()), 
                        encodeURIComponent(this.getPassword()), 
                        old.getHost())
                );
                
            request.setUri(uri);   
        }        

        Ext.Ajax.request({
            url: request.toString(),
            success: function(response, o) {
                var feed = this.processFeed(response.responseText);
                if (options.success)
                    options.success.call(options.scope || this, feed);
            },
            failure: function(response, o) {  
                console.dir(response);
                if (options.failure)
                    options.failure.call(options.scope || this, response, o);
            },
            headers: this.createHeadersForRequest(request),
            scope: this           
        });
    },
    readFeed: function(request, options) {  
        /// <param name="request" type="Sage.SData.Client.SDataResourceCollectionRequest">request object</param>          
        this.executeRequest(request, options);
    },   
    readEntry: function(request, options) {
        /// <param name="request" type="Sage.SData.Client.SDataSingleResourceRequest">request object</param>

        var o = Ext.apply({}, {
            success: function(feed) {
                if (options.success) 
                {
                    var entry = feed['$resources'][0] || false;
                    
                    options.success.call(options.scope || this, entry);
                }                
            },  
            scope: this
        }, options);

        this.executeRequest(request, o);
    },
    parseFeedXml: function(text) {
        var xml = new XML.ObjTree();
        xml.attr_prefix = '@';

        return xml.parseXML(text);
    }, 
    convertEntity: function(ns, entity, applyTo) {
        applyTo = applyTo || {};

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
                    /*
                    // no longer an indicator of a pure-linked entry
                    else if (value.hasOwnProperty('@sdata:uri')) // linked
                    {
                        var converted = {
                            '$key': value['@sdata:key'],
                            '$url': value['@sdata:uri']
                            // should be a descriptor as well 
                        };
                    }
                    */
                    else if (value.hasOwnProperty('@sdata:key')) // included
                    {
                        var converted = this.convertEntity(ns, value);
                    }

                    value = converted;
                }                                                      

                applyTo[propertyName] = value;                   
            }
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
            var entity = payload[key];

            this.convertEntity(ns, entity, result);
        }

        return result;
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
        else
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