/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>

(function(){
    var S = Sage,
        C = S.namespace('SData.Client');

    C.SDataBaseRequest = S.Class.define({
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
        setQueryArgs: function(val, replace) {
            this.uri.setQueryArgs(val, replace);
            return this;
        },
        getQueryArg: function(key) {
            return this.uri.getQueryArg(key);
        },
        setQueryArg: function(key, val) {
            this.uri.setQueryArg(key, val);
            return this;
        },
        build: function() {
            return this.uri.build();
        }
    });
})();
