/// <reference path="../libraries/ext/ext-core-debug.js"/>
/// <reference path="../libraries/ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>

(function(){
    var S = Sage,
        C = Sage.namespace('Sage.SData.Client');

    Sage.SData.Client.SDataApplicationRequest = Sage.SData.Client.SDataBaseRequest.extend({
        constructor: function() {
            this.base.apply(this, arguments);

            if (this.service)
            {
                this.uri.setProduct(this.service.getApplicationName() ? this.service.getApplicationName() : '-');
                this.uri.setContract(this.service.getContractName() ? this.service.getContractName() : '-');
                this.uri.setCompanyDataset(this.service.getDataSet() ? this.service.getDataSet() : '-');
            }
        },
        getApplicationName: function() {
            return this.uri.getProduct();
        },
        setApplicationName: function(value) {
            this.uri.setProduct(value);
            return this;
        },
        getContractName: function() {
            return this.uri.getContract();
        },
        setContractName: function(value) {
            this.uri.setContract(value);
            return this;
        },
        getDataSet: function() {
            return this.uri.getCompanyDataset();
        },
        setDataSet: function(value) {
            this.uri.setCompanyDataset(value);
            return this;
        },
        getResourceKind: function() {
            return this.uri.getCollectionType();
        },
        setResourceKind: function(value) {
            this.uri.setCollectionType(value);
            return this;
        }
    });
})();

