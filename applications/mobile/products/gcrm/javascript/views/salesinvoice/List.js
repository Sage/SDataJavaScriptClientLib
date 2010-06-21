/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/List.js"/>

Ext.namespace("Mobile.GCRM.SalesInvoice");

Mobile.GCRM.SalesInvoice.List = Ext.extend(Sage.Platform.Mobile.List, {        
    itemTemplate: new Simplate([
        '<li>',
        '<a href="#gcrm_salesinvoice_detail" target="_detail" m:key="{%= $["$key"] || $["$uuid"] %}" m:descriptor="{%= $["type"] %}">',
        '<h3>{%= $["type"] %} ({%= $["dueDate"] %})</h3>',
        '<h4>{%= $["netTotal"] %} - {%= $["currency"] %}</h4>',
        '</a>',
        '</li>'
    ]),  
    constructor: function(o) {
        Mobile.GCRM.SalesInvoice.List.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'gcrm_salesinvoice_list',
            title: 'ERP - Sales Invoices',
            resourceKind: 'salesInvoices',            
            pageSize: 10,
            icon: 'products/slx/images/Accounts_24x24.gif',
            tools: {}
        });        
    },  
    /* todo: find out why search queries do not work */
    formatSearchQuery: function(query) {
        return String.format('name like "%{0}%"', query);
    },
    createRequest: function() {
        var request = Mobile.GCRM.SalesInvoice.List.superclass.createRequest.call(this);

        request
            .setQueryArgs({
                'orderby': 'dueDate asc',
                'select': 'type,status,dueDate,netTotal,currency'                
            });

        return request;
    }
});