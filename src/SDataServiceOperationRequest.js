/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

(function(){
    var S = Sage,
        C = S.namespace('SData.Client');

    C.SDataServiceOperationRequest = C.SDataApplicationRequest.extend({
        constructor: function() {
            this.base.apply(this, arguments);

            this.uri.setPathSegment(
                C.SDataUri.ResourcePropertyIndex,
                C.SDataUri.ServiceMethodSegment
            );
        },
        execute: function(entry, options) {
            return this.service.executeServiceOperation(this, entry, options);
        },
        getOperationName: function() {
            return this.uri.getPathSegment(C.SDataUri.ResourcePropertyIndex + 1);
        },
        setOperationName: function(name) {
            this.uri.setPathSegment(C.SDataUri.ResourcePropertyIndex + 1, name);
            return this;
        }
    });
})();
