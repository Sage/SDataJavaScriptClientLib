/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>

(function(){
    var S = Sage,
        C = Sage.namespace('Sage.SData.Client');

    Sage.SData.Client.SDataSystemRequest = Sage.SData.Client.SDataBaseRequest.extend({
        constructor: function() {
            this.base.apply(this, arguments);

            this.uri.setPathSegment(
                Sage.SData.Client.SDataUri.ProductPathIndex,
                Sage.SData.Client.SDataUri.SystemSegment
            );
        },
        getCategory: function() {
            this.uri.getPathSegment(Sage.SData.Client.SDataUri.ContractTypePathIndex);
        },
        setCategory: function(value) {
            this.uri.setPathSegment(Sage.SData.Client.SDataUri.ContractTypePathIndex, value);
            return this;
        },
        read: function(options) {
            return this.service.readFeed(this, options);
        }
    });
})();
