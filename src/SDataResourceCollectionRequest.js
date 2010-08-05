/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
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
