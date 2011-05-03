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
        C = Sage.namespace('Sage.SData.Client');

    Sage.SData.Client.SDataBaseRequest = Sage.Class.define({
        service: null,
        uri: null,
        completeHeaders: null,
        extendedHeaders: null,
        constructor: function(service) {
            this.base.apply(this, arguments);

            this.service = service;

            this.completeHeaders = {};
            this.extendedHeaders = {};
            this.uri = new Sage.SData.Client.SDataUri();

            if (this.service)
            {
                this.uri.setVersion(this.service.getVersion());
                this.uri.setIncludeContent(this.service.getIncludeContent());
                this.uri.setServer(this.service.getVirtualDirectory() ? this.service.getVirtualDirectory() : 'sdata');
                this.uri.setScheme(this.service.getProtocol());
                this.uri.setHost(this.service.getServerName());
                this.uri.setPort(this.service.getPort());
            }
        },
        setRequestHeader: function(name, value) {
            this.completeHeaders[name] = value;
        },
        /**
         * Sets an extension for a request header to be handled appropriately by the service.  For example, extending
         * the `Accept` header, will append the values to the existing `Accept` headers value.
         *
         * @param name
         * @param value
         */
        extendRequestHeader: function(name, value) {
            this.extendedHeaders[name] = value;
        },
        clearRequestHeader: function(name) {
            delete this.completeHeaders[name];
            delete this.extendedHeaders[name];
        },
        getAccept: function() {
            return this.extendedHeaders['Accept'];
        },
        setAccept: function(value) {
            this.extendRequestHeader('Accept', value);
            return this;
        },
        getService: function() {
            /// <returns type="Sage.SData.Client.SDataService" />
            return this.service;
        },
        getUri: function() {
            /// <returns type="Sage.SData.Client.SDataUri" />
            return this.uri;
        },
        setUri: function(value) {
            this.uri = value;
            return this;
        },
        getServerName: function() {
            return this.uri.getHost();
        },
        setServerName: function(value) {
            this.uri.setHost(value);
            return this;
        },
        getVirtualDirectory: function() {
            return this.uri.getServer();
        },
        setVirtualDirectory: function(value) {
            this.uri.setServer(value);
            return this;
        },
        getProtocol: function() {
            return this.uri.getScheme();
        },
        setProtocol: function(value) {
            this.uri.setScheme(value);
            return this;
        },
        getPort: function() {
            return this.uri.getPort();
        },
        setPort: function(value) {
            this.uri.setPort(value);
            return this;
        },
        getQueryArgs: function() {
            return this.uri.getQueryArgs();
        },
        setQueryArgs: function(value, replace) {
            this.uri.setQueryArgs(value, replace);
            return this;
        },
        getQueryArg: function(key) {
            return this.uri.getQueryArg(key);
        },
        setQueryArg: function(key, value) {
            this.uri.setQueryArg(key, value);
            return this;
        },
        build: function(excludeQuery) {
            return this.uri.build(excludeQuery);
        }
    });
})();
