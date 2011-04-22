/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

(function(){
    var S = Sage,
        C = Sage.namespace('Sage.SData.Client');

    Sage.SData.Client.SDataResourceCollectionRequest = Sage.SData.Client.SDataApplicationRequest.extend({
        constructor: function() {
            this.base.apply(this, arguments);
        },
        getCount: function() {
            return this.uri.getCount();
        },
        setCount: function(value) {
            this.uri.setCount(value);
            return this;
        },
        getStartIndex: function() {
            return this.uri.getStartIndex();
        },
        setStartIndex: function(value) {
            this.uri.setStartIndex(value);
            return this;
        },
        read: function(options) {
            return this.service.readFeed(this, options);
        }
    });
})();
