/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>

if (Sage)
{
    (function(S){
        var C = S.namespace('SData.Client');

        C.SDataSystemRequest = C.SDataBaseRequest.extend({
            constructor: function() {
                this.base.apply(this, arguments);

                this.category = false;
            },
            getCategory: function() {
                return this.category;
            },
            setCategory: function(val) {
                this.category = val;
                return this;
            },
            buildUrl: function(uri) {
                /// <param name="uri" type="Sage.SData.Client.SDataUri" />

                this.base.apply(this, arguments);

                uri.appendPath('$system');

                if (this.category) uri.appendPath(this.category);
            },
            read: function(options) {
                return this.service.readFeed(this, options);
            }
        });
    })(Sage);
}