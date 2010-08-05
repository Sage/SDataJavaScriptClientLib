/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
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
