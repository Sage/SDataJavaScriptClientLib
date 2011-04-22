(function(){
    var S = Sage,
        C = Sage.namespace('Sage.SData.Client');

    Sage.SData.Client.SDataNamedQueryRequest = Sage.SData.Client.SDataResourceCollectionRequest.extend({
        constructor: function() {
            this.base.apply(this, arguments);

            this.uri.setPathSegment(
                C.SDataUri.ResourcePropertyIndex,
                C.SDataUri.NamedQuerySegment
            );
        },
        getQueryName: function() {
            return this.uri.getPathSegment(C.SDataUri.ResourcePropertyIndex + 1);
        },
        setQueryName: function(value) {
            this.uri.setPathSegment(
                C.SDataUri.ResourcePropertyIndex + 1,
                value
            );
            return this;
        }
    });
})();
