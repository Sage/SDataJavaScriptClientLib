/// <reference path="../dependencies/ext/ext-core-debug.js"/>
/// <reference path="../dependencies/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

Ext.namespace("Sage.SData.Client");

Sage.SData.Client.SDataSingleResourceRequest = Ext.extend(Sage.SData.Client.SDataApplicationRequest, {   
    constructor: function() {        
        Sage.SData.Client.SDataSingleResourceRequest.superclass.constructor.apply(this, arguments);
        
        this.resourceSelector = false;                                                   
    },       
    read: function(options) {
        return this.service.readEntry(this, options);
    },
    update: function(entry, options) {
        return this.service.updateEntry(this, entry, options);
    },
    getResourceSelector: function() {
        return this.resourceSelector;
    },
    setResourceSelector: function(val) {
        this.resourceSelector = val;
        return this;
    },
    buildUrl: function(uri) {
        /// <param name="uri" type="Sage.SData.Client.SDataUri" />

        Sage.SData.Client.SDataSingleResourceRequest.superclass.buildUrl.apply(this, arguments);

        if (this.resourceSelector) uri.setCollectionPredicate(this.resourceSelector);
    }
});