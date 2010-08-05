/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

Sage.SData.Client.SDataResourceCollectionRequest = Sage.SData.Client.SDataApplicationRequest.extend({
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
