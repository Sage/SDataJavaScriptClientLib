/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

Ext.namespace("Sage.SData.Client");

Sage.SData.Client.SDataSingleResourceRequest = Ext.extend(Sage.SData.Client.SDataApplicationRequest, {   
    constructor: function() {        
        Sage.SData.Client.SDataSingleResourceRequest.superclass.constructor.apply(this, arguments);                                                 
    },       
    read: function(options) {
        return this.service.readEntry(this, options);
    },
    update: function(entry, options) {
        return this.service.updateEntry(this, entry, options);
    },
    create: function(entry, options) {
        return this.service.createEntry(this, entry, options);
    },
    getResourceSelector: function() {
        return this.uri.getCollectionPredicate();
    },
    setResourceSelector: function(val) {        
        this.uri.setCollectionPredicate(val);
        return this;
    }
});