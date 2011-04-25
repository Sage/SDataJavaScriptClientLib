/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>
/// <reference path="SDataApplicationRequest.js"/>

(function(){
    var S = Sage,
        C = Sage.namespace('Sage.SData.Client');

    Sage.SData.Client.SDataBatchRequest = Sage.SData.Client.SDataApplicationRequest.extend({
        items: null,
        constructor: function() {
            this.base.apply(this, arguments);

            this.items = [];
            this.uri.setPathSegment(
                Sage.SData.Client.SDataUri.ResourcePropertyIndex,
                Sage.SData.Client.SDataUri.BatchSegment
            );
        },
        using: function(fn, scope) {
            if (this.service)
                this.service.registerBatchScope(this);
            else
                throw "A service must be associated with the batch request.";

            try
            {
                fn.call(scope || this, this);
            }
            catch (e)
            {
                this.service.clearBatchScope(this);
                throw e;
            }

            this.service.clearBatchScope(this);
        },
        add: function(item) {
            this.items.push(item);
        },
        commit: function(options) {
            this.service.commitBatch(this, options);
        }
    });
})();