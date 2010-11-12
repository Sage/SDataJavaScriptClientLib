/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

(function(){
    var S = Sage,
        C = S.namespace('SData.Client');

    C.SDataResourcePropertyRequest = C.SDataSingleResourceRequest.extend({
        constructor: function() {
            this.base.apply(this, arguments);
        },       
        readFeed: function(options) {
            return this.service.readFeed(this, options);
        },
        getResourceProperty: function() {
            return this.uri.getPathSegment(Sage.SData.Client.SDataUri.ResourcePropertyIndex);
        },
        setResourceProperty: function(val) {
            this.uri.setPathSegment(Sage.SData.Client.SDataUri.ResourcePropertyIndex, val);
            return this;
        }
    });
})();
