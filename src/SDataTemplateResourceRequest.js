/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

Sage.SData.Client.SDataTemplateResourceRequest = Sage.SData.Client.SDataApplicationRequest.extend({   
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
