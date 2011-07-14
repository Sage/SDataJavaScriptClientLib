/* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(){
    var S = Sage,
        C = Sage.namespace('Sage.SData.Client'),
        isDefined = function(value) { return typeof value !== 'undefined' },
        nsRE = /^(.+?):(.*)$/;

    Sage.SData.Client.SDataService = Sage.Evented.extend({
        uri: null,
        useCredentialedRequest: false,
        userAgent: 'Sage',
        userName: false,
        password: '',
        batchScope: null,
        constructor: function(options) {
            /// <field name="uri" type="Sage.SData.Client.SDataUri" />
            this.base.apply(this, arguments);   
            
            this.uri = new Sage.SData.Client.SDataUri();

            if (options)
            {
                if (isDefined(options.uri)) this.uri = new Sage.SData.Client.SDataUri(options.uri);
                if (isDefined(options.version)) this.uri.setVersion(options.version);
                if (isDefined(options.serverName)) this.uri.setHost(options.serverName);
                if (isDefined(options.virtualDirectory)) this.uri.setServer(options.virtualDirectory);
                if (isDefined(options.applicationName)) this.uri.setProduct(options.applicationName);
                if (isDefined(options.contractName)) this.uri.setContract(options.contractName);
                if (isDefined(options.dataSet)) this.uri.setCompanyDataset(options.dataSet);
                if (isDefined(options.port)) this.uri.setPort(options.port);
                if (isDefined(options.protocol)) this.uri.setScheme(options.protocol);
                if (isDefined(options.includeContent)) this.uri.setIncludeContent(options.includeContent);

                if (isDefined(options.json)) this.json = options.json;
                if (isDefined(options.userName)) this.userName = options.userName;
                if (isDefined(options.password)) this.password = options.password;
                if (isDefined(options.useCredentialedRequest)) this.useCredentialedRequest = options.useCredentialedRequest;
            }

            this.addEvents(
                'beforerequest',
                'requestcomplete',
                'requestexception',
                'requestaborted'
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
        setUserName: function(value) {
            this.userName = value;
            return this;
        },
        getPassword: function() {
            return this.password;
        },
        setPassword: function(value) {
            this.password = value;
            return this;
        },
        getProtocol: function() {
            return this.uri.getScheme();
        },
        setProtocol: function(value) {
            this.uri.setScheme(value);
            return this;
        },
        getServerName: function() {
            return this.uri.getHost();
        },
        setServerName: function(value) {
            this.uri.setHost(value);
            return this;
        },
        getPort: function() {
            return this.uri.getPort();
        },
        setPort: function(value) {
            this.uri.setPort(value);
            return this;
        },
        getVirtualDirectory: function() {
            return this.uri.getServer();
        },
        setVirtualDirectory: function(value) {
            this.uri.setServer(value);
            return this;
        },
        getApplicationName: function() {
            return this.uri.getProduct();
        },
        setApplicationName: function(value) {
            this.uri.setProduct(value);
            return this;
        },
        getContractName: function() {
            return this.uri.getContract();
        },
        setContractName: function(value) {
            this.uri.setContract(value);
            return this;
        },
        getDataSet: function() {
            return this.uri.getCompanyDataset();
        },
        setDataSet: function(value) {
            this.uri.setCompanyDataset(value);
            return this;
        },
        getIncludeContent: function() {
            return this.uri.getIncludeContent();
        },
        setIncludeContent: function(value) {
            this.uri.setIncludeContent(value);
            return this;
        },
        getUserAgent: function() {
            return this.userAgent;
        },
        setUserAgent: function(value) {
            this.userAgent = value;
            return this;
        },
        registerBatchScope: function(scope) {
            this.batchScope = scope;
        },
        clearBatchScope: function(scope) {
            this.batchScope = null;
        },
        createBasicAuthToken: function() {
            return 'Basic ' + Base64.encode(this.userName + ":" + this.password);
        },
        createHeadersForRequest: function(request) {
            var headers = {
                /* 'User-Agent': this.userAgent */ /* 'User-Agent' cannot be set on XmlHttpRequest */
                'X-Authorization-Mode': 'no-challenge'
            };
            
            if (this.userName && !this.useCredentialedRequest)
                headers['Authorization'] = headers['X-Authorization'] = this.createBasicAuthToken();

            return headers;
        },
        extendAcceptRequestHeader: function(value, extension) {
            if (value) return value.split(/\s*,\s*/).join(';' + extension + ',') + ';' + extension;
            return value;
        },
        executeRequest: function(request, options, ajax) {
            /// <param name="request" type="Sage.SData.Client.SDataBaseRequest">request object</param>
            
            // todo: temporary fix for SalesLogix Dynamic Adapter only supporting json selector in format parameter
            if (this.json) request.setQueryArg('format', 'json');

            var o = S.apply({
                async: options.async,
                headers: {},
                method: 'GET',
                url: request.build()
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
                },
                aborted: function(response, opt) {
                    this.fireEvent('requestaborted', request, opt, response);

                    if (options.aborted)
                        options.aborted.call(options.scope || this, response, opt);
                }
            }, ajax);

            S.apply(o.headers, this.createHeadersForRequest(request), request.completeHeaders);

            /* we only handle `Accept` for now */
            if (request.extendedHeaders['Accept'])
                o.headers['Accept'] = this.extendAcceptRequestHeader(o.headers['Accept'], request.extendedHeaders['Accept']);
            
            if (this.userName && this.useCredentialedRequest)
            {
                o.user = this.userName;
                o.password = this.password;
            }

            this.fireEvent('beforerequest', request, o);

            /* if the event provided its own result, do not execute the ajax call */
            if (typeof o.result !== 'undefined')
            {
                if (options.success)
                    options.success.call(options.scope || this, o.result);

                return;
            }

            return C.Ajax.request(o);
        },
        abortRequest: function(id) {
            C.Ajax.cancel(id);
        },
        readFeed: function(request, options) {
            /// <param name="request" type="Sage.SData.Client.SDataResourceCollectionRequest">request object</param>
            options = options || {};

            if (this.batchScope)
            {
                this.batchScope.add({
                    url: request.build(),
                    method: 'GET'
                });

                return;
            }

            var ajax = {
                headers: {
                    'Accept': this.json
                        ? 'application/json,*/*'
                        : 'application/atom+xml;type=feed,*/*'
                }
            };

            if (options.httpMethodOverride)
            {
                // todo: temporary fix for SalesLogix Dynamic Adapter only supporting json selector in format parameter
                // todo: temporary fix for `X-HTTP-Method-Override` and the SalesLogix Dynamic Adapter
                if (this.json) request.setQueryArg('format', 'json');

                ajax.headers['X-HTTP-Method-Override'] = 'GET';
                ajax.method = 'POST';
                ajax.body = request.build();
                ajax.url = request.build(true); // exclude query
            }

            return this.executeRequest(request, options, ajax);
        },
        readEntry: function(request, options) {
            /// <param name="request" type="Sage.SData.Client.SDataSingleResourceRequest">request object</param>
            options = options || {};

            if (this.batchScope)
            {
                this.batchScope.add({
                    url: request.build(),
                    method: 'GET'
                });

                return;
            }

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
                        ? 'application/json,*/*'
                        : 'application/atom+xml;type=entry,*/*'
                }
            });
        },
        createEntry: function(request, entry, options) {
            options = options || {};

            if (this.batchScope)
            {
                this.batchScope.add({
                    url: request.build(),
                    entry: entry,
                    method: 'POST'
                });

                return;
            }            
            
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
            options = options || {};

            if (this.batchScope)
            {
                this.batchScope.add({
                    url: request.build(),
                    entry: entry,
                    method: 'PUT',
                    etag: entry['$etag']
                });

                return;
            }

            var o = S.apply({}, {
                success: function(feed) {
                    var entry = feed['$resources'][0] || false;

                    if (options.success)
                        options.success.call(options.scope || this, entry);
                }
            }, options);

            var headers = {},
                ajax = {
                    method: 'PUT',
                    headers: headers
                };

            // per the spec, the 'If-Match' header MUST be present for PUT requests.
            // however, we are breaking with the spec here, on the consumer, to allow it to be OPTIONAL so
            // that the provider can decide if it wishes to break with the spec or not.
            if (entry['$etag'] && !(options && options.ignoreETag))
                headers['If-Match'] = entry['$etag'];

            if (this.isJsonEnabled())
            {
                headers['Content-Type'] = 'application/json';

                ajax.body = JSON.stringify(entry);
            }
            else
            {
                var xml = new XML.ObjTree();
                xml.attr_prefix = '@';

                headers['Content-Type'] = 'application/atom+xml;type=entry';
                headers['Accept'] = 'application/atom+xml;type=entry,*/*';

                ajax.body = xml.writeXML(this.formatEntry(entry));
            }

            return this.executeRequest(request, o, ajax);
        },
        deleteEntry: function(request, entry, options) {
            /// <param name="request" type="Sage.SData.Client.SDataSingleResourceRequest">request object</param>
            options = options || {};

            if (this.batchScope)
            {
                this.batchScope.add({
                    url: request.build(),
                    method: 'DELETE',
                    etag: !(options && options.ignoreETag) && entry['$etag']
                });

                return;
            }

            var headers = {},
                ajax = {
                    method: 'DELETE',
                    headers: headers
                };

            if (entry['$etag'] && !(options && options.ignoreETag))
                headers['If-Match'] = entry['$etag'];

            return this.executeRequest(request, options, ajax);
        },
        executeServiceOperation: function(request, entry, options) {
             var o = S.apply({}, {
                success: function(feed) {
                    var entry = feed['$resources'][0] || false,
                        response = entry && entry['response'],
                        resources = response && response['$resources'],
                        payload = resources && resources[0];

                    if (payload && payload['$name'])
                    {
                        entry['response'] = {};
                        entry['response'][payload['$name']] = payload;
                    }

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
        commitBatch: function(request, options) {
            options = options || {};

            var items = request.getItems(),
                item,
                entry,
                feed = {
                    '$resources': []
                };

            for (var i = 0; i < items.length; i++)
            {
                item = items[i];
                entry = S.apply({}, item.entry); /* only need a shallow copy as only top-level properties will be modified */

                if (item.url) entry['$url'] = item.url;
                if (item.etag) entry['$ifMatch'] = item.etag;
                if (item.method) entry['$httpMethod'] = item.method;

                delete entry['$etag'];

                feed['$resources'].push(entry);
            }

            var ajax = S.apply({}, {
                method: 'POST'
            });

            if (this.isJsonEnabled())
            {
                S.apply(ajax, {
                    body: JSON.stringify(feed),
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
                    body: xml.writeXML(this.formatFeed(feed)),
                    headers: {
                        'Content-Type': 'application/atom+xml;type=feed',
                        'Accept': 'application/atom+xml;type=feed,*/*'
                    }
                });
            }

            return this.executeRequest(request, options, ajax);
        },
        parseFeedXml: function(text) {
            var xml = new XML.ObjTree();
            xml.attr_prefix = '@';

            return xml.parseXML(text);
        },
        isIncludedReference: function(ns, name, value) {
            return value.hasOwnProperty('@sdata:key');
        },
        isIncludedCollection: function(ns, name, value) {
            if (value.hasOwnProperty('@sdata:key')) return false;
            if (value.hasOwnProperty('@sdata:uri') || value.hasOwnProperty('@sdata:url')) return true;

            // attempt to detect if we are dealing with an included relationship collection
            var firstChild,
                firstValue;

            for (var fqPropertyName in value)
            {
                if (fqPropertyName[0] === '@') continue;
                
                firstChild = value[fqPropertyName];
                break; // will always ever be one property, either an entity, or an array of
            }

            if (firstChild)
            {
                if (S.isArray(firstChild))
                    firstValue = firstChild[0];
                else
                    firstValue = firstChild;
                
                if (firstValue && firstValue.hasOwnProperty('@sdata:key')) return true;
            }

            return false;
        },
        convertEntity: function(ns, name, entity, applyTo) {
            applyTo = applyTo || {};

            applyTo['$name'] = name;
            applyTo['$key'] = entity['@sdata:key'];
            applyTo['$url'] = entity['@sdata:uri'];
            applyTo['$uuid'] = entity['@sdata:uuid'];

            for (var fqPropertyName in entity)
            {
                if (fqPropertyName[0] === '@') continue;

                var hasNS = nsRE.exec(fqPropertyName),
                    propertyNS = hasNS ? hasNS[1] : false,
                    propertyName = hasNS ? hasNS[2] : fqPropertyName,
                    value = entity[fqPropertyName];

                if (typeof value === 'object')
                {
                    if (value.hasOwnProperty('@xsi:nil')) // null
                    {
                        var converted = null;
                    }
                    else if (this.isIncludedReference(propertyNS, propertyName, value)) // included reference
                    {
                        var converted = this.convertEntity(propertyNS, propertyName, value);
                    }
                    else if (this.isIncludedCollection(propertyNS, propertyName, value)) // included collection
                    {
                        var converted = this.convertEntityCollection(propertyNS, propertyName, value);
                    }
                    else // no conversion, read only
                    {
                        converted = this.convertCustomEntityProperty(propertyNS, propertyName, value);
                    }

                    value = converted;
                }

                applyTo[propertyName] = value;
            }

            return applyTo;
        },
        convertEntityCollection: function(ns, name, collection) {
            for (var fqPropertyName in collection)
            {
                if (fqPropertyName[0] === '@') continue;

                var hasNS = nsRE.exec(fqPropertyName),
                    propertyNS = hasNS ? hasNS[1] : false,
                    propertyName = hasNS ? hasNS[2] : fqPropertyName,
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
       
            // todo: is this necessary? does not appear to be looking at the spec
            // if (entity['$url']) applyTo['@sdata:uri'] = entity['$url'];

            // note: not using explicit namespaces at this time

            for (var propertyName in entity)
            {
                if (propertyName[0] === '$') continue;

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

                var parts = key.split(':'),
                    ns,
                    name,
                    entity = payload[key];

                if (parts.length == 2)
                {
                    ns = parts[0];
                    name = parts[1];
                }
                else if (parts.length < 2)
                {
                    ns = false;
                    name = key;
                }
                else
                {
                    continue;
                }   

                this.convertEntity(ns, name, entity, result);
            }

            return result;
        },
        formatEntry: function(entry, excludeNS) {
            var result = {};

            if (!excludeNS)
            {
                result['@xmlns:sdata'] = 'http://schemas.sage.com/sdata/2008/1';
                result['@xmlns:xsi'] = 'http://www.w3.org/2001/XMLSchema-instance';
                result['@xmlns:http'] = 'http://schemas.sage.com/sdata/http/2008/1';
                result['@xmlns'] = 'http://www.w3.org/2005/Atom';
            }

            if (entry['$httpMethod']) result['http:httpMethod'] = entry['$httpMethod'];
            if (entry['$ifMatch']) result['http:ifMatch'] = entry['$ifMatch'];
            if (entry['$etag']) result['http:etag'] = entry['$etag'];
            if (entry['$url']) result['id'] = entry['$url'];

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
        formatFeed: function(feed) {
            var result = {};

            result['@xmlns:sdata'] = 'http://schemas.sage.com/sdata/2008/1';
            result['@xmlns:xsi'] = 'http://www.w3.org/2001/XMLSchema-instance';
            result['@xmlns:http'] = 'http://schemas.sage.com/sdata/http/2008/1';
            result['@xmlns'] = 'http://www.w3.org/2005/Atom';

            if (feed['$url']) result['id'] = feed['$url'];

            result['entry'] = [];

            for (var i = 0; i < feed['$resources'].length; i++)
            {
                result['entry'].push(this.formatEntry(feed['$resources'][i], true)['entry']);
            }

            return {'feed': result};
        },
        processFeed: function(response) {
            if (!response.responseText) return null;

            var contentType = response.getResponseHeader && response.getResponseHeader('Content-Type');
            
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
