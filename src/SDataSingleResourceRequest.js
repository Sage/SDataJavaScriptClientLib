/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

Sage.SData.Client.SDataSingleResourceRequest = Sage.SData.Client.SDataApplicationRequest.extend({
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