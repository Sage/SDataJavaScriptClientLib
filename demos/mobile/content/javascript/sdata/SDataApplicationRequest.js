/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../ObjTree.js"/>
/// <reference path="SDataUri.js"/>
/// <reference path="SDataBaseRequest.js"/>

Ext.namespace("Sage.SData.Client");

Sage.SData.Client.SDataApplicationRequest = Ext.extend(Sage.SData.Client.SDataBaseRequest, {   
    constructor: function() {        
        Sage.SData.Client.SDataApplicationRequest.superclass.constructor.apply(this, arguments);  
        
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
    setApplicationName: function(val) {
        this.uri.setProduct(val);
        return this;
    },
    getContractName: function() {
        return this.uri.getContract();
    },
    setContractName: function(val) {
        this.uri.setContract(val);
        return this;
    },
    getDataSet: function() {
        return this.uri.getCompanyDataset(); 
    },
    setDataSet: function(val) {
        this.uri.setCompanyDataset(val); 
        return this;
    },
    getResourceKind: function() {
        return this.resourceKind;
    },
    setResourceKind: function(val) {
        this.resourceKind = val;
        return this;
    },
    buildUrl: function(uri) {
        /// <param name="uri" type="Sage.SData.Client.SDataUri" />

        Sage.SData.Client.SDataApplicationRequest.superclass.buildUrl.apply(this, arguments);

        uri.appendPath(this.getResourceKind());
    }
});
