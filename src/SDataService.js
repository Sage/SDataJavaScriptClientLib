/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="../libraries/Base64.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>
/// <reference path="SDataResourceCollectionRequest.js"/>
/// <reference path="SDataUri.js"/>

(function(){
    var S = Sage,
        C = S.namespace('SData.Client');

    C.SDataService = S.Evented.extend({        
        uri: null,
        userAgent: 'Sage',
        userName: false,
        password: '',
        constructor: function(options) {
            /// <field name="uri" type="Sage.SData.Client.SDataUri" />
            S.apply(this, options);

            this.base.apply(this, arguments);

            if (!this.uri) this.uri = new Sage.SData.Client.SDataUri();            

            if (options)
            {
                if (options.version) this.uri.setVersion(options.version);
                if (options.serverName) this.uri.setHost(options.serverName);
                if (options.virtualDirectory) this.uri.setServer(options.virtualDirectory);
                if (options.applicationName) this.uri.setProduct(options.applicationName);
                if (options.contractName) this.uri.setContract(options.contractName);
                if (options.port) this.uri.setPort(options.port);
                if (options.protocol) this.uri.setScheme(options.protocol);

                if (typeof options.includeContent === 'boolean') this.uri.setIncludeContent(options.includeContent);

                if (options.userName) this.userName = options.userName;
                if (options.password) this.password = options.password;
                if (options.json) this.json = true;
            }

            this.addEvents(
                'beforerequest',
                'requestcomplete',
                'requestexception'
            );
        },
        isJsonEnabled: function() {
            return this.json;
        },
        enableJson: function() {
            this.json = true;
            return this;
        },
        disableJson: function() {
            this.json = false;
            return this;
        },
        getVersion: function() {
            return this.uri.getVersion();
        },
        setVersion: function(val) {
            this.uri.setVersion(val);
            return this;
        },
        getUri: function() {
            /// <returns type="Sage.SData.Client.SDataUri" />
            return this.uri;
        },
        getUserName: function() {
            /// <returns type="String" />
            return this.userName;
        },
        setUserName: function(val) {
            this.userName = val;
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
            return 'Basic ' + Base64.encode(this.userName + ":" + this.password);
        },
        createHeadersForRequest: function(request) {
            var headers = {
                /* 'User-Agent': this.userAgent */ /* 'User-Agent' cannot be set on XmlHttpRequest */
                'X-Authorization-Mode': 'no-challenge'
            };

            if (this.userName !== false)
                headers['Authorization'] = headers['X-Authorization'] = this.createBasicAuthToken();

            return headers;
        },
        executeRequest: function(request, options, ajax) {
            /// <param name="request" type="Sage.SData.Client.SDataBaseRequest">request object</param>
            var o = S.apply({
                headers: {},
                method: 'GET',
                async: options.async
            }, {
                scope: this,
                success: function(response, opt) {
                    var feed = this.processFeed(response);

                    this.fireEvent('requestcomplete', request, opt, feed);

                    if (options.success)
                        options.success.call(options.scope || this, feed);
                },
                failure: function(response, opt) {
                    this.fireEvent('requestexception', request, opt, response);

                    if (options.failure)
                        options.failure.call(options.scope || this, response, opt);
                }
            }, ajax);

            S.apply(o.headers, this.createHeadersForRequest(request));

            // todo: temporary fix for SalesLogix Dynamic Adapter only supporting json selector in format parameter
            if (this.json) request.setQueryArg('format', 'json');

            o.url = request.build();

            this.fireEvent('beforerequest', request, o);

            /* if the event provied its own result, do not execute the ajax call */
            if (typeof o.result !== 'undefined')
            {
                if (options.success)
                    options.success.call(options.scope || this, o.result);

                return;
            }

            return C.Ajax.request(o);
        },
        abortRequest: function(id) {
            C.Ajax.abort(id);
        },
        readFeed: function(request, options) {
            /// <param name="request" type="Sage.SData.Client.SDataResourceCollectionRequest">request object</param>
            return this.executeRequest(request, options, {
                headers: {
                    'Accept': this.json
                        ? 'application/json'
                        : 'application/atom+xml;type=feed,*/*'
                }
            });
        },
        readEntry: function(request, options) {
            /// <param name="request" type="Sage.SData.Client.SDataSingleResourceRequest">request object</param>
            var o = S.apply({}, {
                success: function(feed) {
                    var entry = feed['$resources'][0] || false;

                    if (options.success)
                        options.success.call(options.scope || this, entry);
                }
            }, options);

            return this.executeRequest(request, o, {
                headers: {
                    'Accept': this.json
                        ? 'application/json'
                        : 'application/atom+xml;type=entry,*/*'
                }
            });
        },
        createEntry: function(request, entry, options) {
            var o = S.apply({}, {
                success: function(feed) {
                    var entry = feed['$resources'][0] || false;

                    if (options.success)
                        options.success.call(options.scope || this, entry);
                }
            }, options);

            var ajax = S.apply({}, {
                method: 'POST'
            });

            if (this.isJsonEnabled())
            {
                S.apply(ajax, {
                    body: JSON.stringify(entry),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            else
            {
                var xml = new XML.ObjTree();
                xml.attr_prefix = '@';

                S.apply(ajax, {
                    body: xml.writeXML(this.formatEntry(entry)),
                    headers: {
                        'Content-Type': 'application/atom+xml;type=entry',
                        'Accept': 'application/atom+xml;type=entry,*/*'
                    }
                });
            }

            return this.executeRequest(request, o, ajax);
        },
        updateEntry: function(request, entry, options) {
            /// <param name="request" type="Sage.SData.Client.SDataSingleResourceRequest">request object</param>
            var o = S.apply({}, {
                success: function(feed) {
                    var entry = feed['$resources'][0] || false;

                    if (options.success)
                        options.success.call(options.scope || this, entry);
                }
            }, options);

            var ajax = S.apply({}, {
                method: 'PUT'
            });

            if (this.isJsonEnabled())
            {
                S.apply(ajax, {
                    body: JSON.stringify(entry),
                    headers: {
                        'Content-Type': 'application/json',
                        'If-Match': entry['$etag']
                    }
                });
            }
            else
            {
                var xml = new XML.ObjTree();
                xml.attr_prefix = '@';

                S.apply(ajax, {
                    body: xml.writeXML(this.formatEntry(entry)),
                    headers: {
                        'Content-Type': 'application/atom+xml;type=entry',
                        'Accept': 'application/atom+xml;type=entry,*/*',
                        'If-Match': entry['$etag']
                    }
                });
            }

            return this.executeRequest(request, o, ajax);
        },
        deleteEntry: function(request, entry, options) {
            /// <param name="request" type="Sage.SData.Client.SDataSingleResourceRequest">request object</param>
            var ajax = S.apply({}, {
                method: 'DELETE',
                headers: {
                    'If-Match': entry['$etag']
                }
            });

            return this.executeRequest(request, options, ajax);
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
            applyTo['$uuid'] = entity['@sdata:uuid'];

            var prefix = ns + ':';

            for (var fqPropertyName in entity)
            {
                if (fqPropertyName.indexOf(prefix) === 0)
                {
                    var propertyName = fqPropertyName.substring(prefix.length),
                        value = entity[fqPropertyName];

                    if (typeof value === 'object')
                    {
                        if (value.hasOwnProperty('@xsi:nil')) // null
                        {
                            var converted = null;
                        }
                        else if (value.hasOwnProperty('@sdata:key')) // included reference
                        {
                            var converted = this.convertEntity(ns, propertyName, value);
                        }
                        else if (value.hasOwnProperty('@sdata:uri')) // included collection
                        {
                            var converted = this.convertEntityCollection(ns, propertyName, value);
                        }
                        else // no conversion, read only
                        {                            
                            converted = this.convertCustomEntityProperty(ns, propertyName, value);
                        }

                        value = converted;
                    }

                    applyTo[propertyName] = value;
                }
            }

            return applyTo;
        },
        convertEntityCollection: function(ns, name, collection) {
            var prefix = ns + ':';

            for (var fqPropertyName in collection)
            {
                var propertyName = fqPropertyName.substring(prefix.length),
                    value = collection[fqPropertyName];
                
                if (S.isArray(value))
                {
                    var converted = [];

                    for (var i = 0; i < value.length; i++)
                        converted.push(this.convertEntity(ns, propertyName, value[i]));

                    return {
                        '$resources': converted
                    };
                }
                else
                {
                    return {
                        '$resources': [
                            this.convertEntity(ns, propertyName, value)
                        ]
                    };
                }

                break; // will always ever be one property, either an entity, or an array of
            }

            return null;
        },
        convertCustomEntityProperty: function(ns, name, value) {
            return value;
        },
        formatEntity: function(ns, entity, applyTo) {
            applyTo = applyTo || {};

            if (entity['$key']) applyTo['@sdata:key'] = entity['$key'];
            if (entity['$url']) applyTo['@sdata:uri'] = entity['$url'];

            // note: not using namespaces at this time

            for (var propertyName in entity)
            {
                if (/^\$/.test(propertyName)) continue;

                var value = entity[propertyName];

                if (value == null)
                {
                    value = {'@xsi:nil': 'true'};
                }
                else if (typeof value === 'object' && value.hasOwnProperty('$resources'))
                {
                    // todo: add resource collection support
                    value = this.formatEntityCollection(ns, value);
                }
                else if (typeof value === 'object')
                {
                    value = this.formatEntity(ns, value);
                }

                applyTo[propertyName] = value;
            }

            return applyTo;
        },
        formatEntityCollection: function(ns, value) {
            var result = {};

            for (var i = 0; i < value['$resources'].length; i++)
            {
                var item = value['$resources'][i],
                    name = item['$name'],
                    target = (result[name] = result[name] || []);

                target.push(this.formatEntity(ns, value['$resources'][i]));
            }

            return result;
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

            if (entry['$etag']) result['http:etag'] = entry['$etag'];

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

            if (S.isArray(feed['entry']))
                for (var i = 0; i < feed['entry'].length; i++)
                    result['$resources'].push(this.convertEntry(feed['entry'][i]));
            else if (typeof feed['entry'] === 'object')
                result['$resources'].push(this.convertEntry(feed['entry']));

            return result;
        },
        processFeed: function(response) {
            if (!response.responseText) return null;

            var contentType = typeof response.getResponseHeader === 'function'
                ? response.getResponseHeader('Content-Type')
                : false;
            
            if ((contentType === 'application/json') || (!contentType && this.isJsonEnabled()))
            {
                var doc = JSON.parse(response.responseText);

                // doing this for parity with below, since with JSON, SData will always
                // adhere to the format, regardless of the User-Agent.
                if (doc.hasOwnProperty('$resources'))
                {
                    return doc;
                }
                else
                {
                    return {
                        '$resources': [doc]
                    };
                }
            }
            else
            {
                var doc = this.parseFeedXml(response.responseText);

                // depending on the User-Agent the SIF will either send back a feed, or a single entry
                // todo: is this the right way to handle this? should there be better detection?
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
        }
    });
})();
