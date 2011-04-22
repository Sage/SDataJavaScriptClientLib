/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

(function(){
    var S = Sage,
        C = Sage.namespace('Sage.SData.Client');

    Sage.SData.Client.SDataResourcePropertyRequest = Sage.SData.Client.SDataSingleResourceRequest.extend({
        constructor: function() {
            this.base.apply(this, arguments);
        },       
        readFeed: function(options) {
            return this.service.readFeed(this, options);
        },
        getResourceProperty: function() {
            return this.uri.getPathSegment(Sage.SData.Client.SDataUri.ResourcePropertyIndex);
        },
        setResourceProperty: function(value) {
            this.uri.setPathSegment(Sage.SData.Client.SDataUri.ResourcePropertyIndex, value);
            return this;
        }
    });
})();
