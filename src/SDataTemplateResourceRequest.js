/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

Ext.namespace("Sage.SData.Client");

Sage.SData.Client.SDataTemplateResourceRequest = Ext.extend(Sage.SData.Client.SDataApplicationRequest, {   
    constructor: function() {        
        Sage.SData.Client.SDataTemplateResourceRequest.superclass.constructor.apply(this, arguments);                                                      

        this.uri.setPathSegment(
            Sage.SData.Client.SDataUri.ResourcePropertyIndex, 
            Sage.SData.Client.SDataUri.TemplateSegment
        );
    },
    read: function(options) {
        return this.service.readEntry(this, options);
    }    
});
