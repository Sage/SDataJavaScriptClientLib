/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataSingleResourceRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/Detail.js"/>
/// <reference path="../../Format.js"/>

Ext.namespace("Mobile.GCRM.SalesInvoice");

Mobile.GCRM.SalesInvoice.Detail = Ext.extend(Sage.Platform.Mobile.Detail, {       
    constructor: function(o) {
        Mobile.GCRM.SalesInvoice.Detail.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'gcrm_salesinvoice_detail',
            title: 'ERP - Sales Invoice',
            resourceKind: 'salesInvoices'
        });

        this.layout = [
            {name: 'type', label: 'type'},
            {name: 'status', label: 'status'},
            {name: 'dueDate', label: 'due'},
            {name: 'netTotal', label: 'total'},
            {name: 'currency', label: 'currency'}
        ];
    },
    init: function() {     
        Mobile.GCRM.SalesInvoice.Detail.superclass.init.call(this);   
    },
    createRequest: function() {
        var request = Mobile.GCRM.SalesInvoice.Detail.superclass.createRequest.call(this);
        
        request                     
            .setQueryArgs({                
                'select': [
                    'type',
                    'status',
                    'dueDate',
                    'netTotal',
                    'currency'     
                ].join(',')                  
            });     
        
        return request;                   
    } 
});