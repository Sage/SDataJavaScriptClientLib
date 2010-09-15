(function(){
    var S = Sage,
        C = S.namespace('SData.Client');

    C.SDataNamedQueryRequest = C.SDataResourceCollectionRequest.extend({
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
        setQueryName: function(val) {
            this.uri.setPathSegment(
                C.SDataUri.ResourcePropertyIndex + 1,
                val
            );
            return this;
        }
    });
})();
