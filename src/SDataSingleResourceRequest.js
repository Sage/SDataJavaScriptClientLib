/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

(function(){
    var S = Sage,
        C = S.namespace('SData.Client');

    C.SDataSingleResourceRequest = C.SDataApplicationRequest.extend({
        constructor: function() {
            this.base.apply(this, arguments);
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
        'delete': function(entry, options) {
            return this.service.deleteEntry(this, entry, options);
        },
        getResourceSelector: function() {
            return this.uri.getCollectionPredicate();
        },
        setResourceSelector: function(val) {
            this.uri.setCollectionPredicate(val);
            return this;
        }
    });
})();
