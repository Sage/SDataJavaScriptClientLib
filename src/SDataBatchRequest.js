/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

(function(){
    var S = Sage,
        C = Sage.namespace('Sage.SData.Client');

    var stack = [];

    Sage.SData.Client.SDataBatchRequest = Sage.SData.Client.SDataApplicationRequest.extend({
        constructor: function() {
            this.base.apply(this, arguments);

            this.uri.setPathSegment(
                Sage.SData.Client.SDataUri.ResourcePropertyIndex,
                Sage.SData.Client.SDataUri.BatchSegment
            );
        },
        using: function(fn, scope) {
               
        }
    });
})();