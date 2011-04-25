/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>

(function(){
    var S = Sage,
        C = Sage.namespace('Sage.SData.Client');

    Sage.SData.Client.SDataBaseRequest = Sage.Class.define({
        constructor: function(service) {
            this.base.apply(this, arguments);

            this.service = service;
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
