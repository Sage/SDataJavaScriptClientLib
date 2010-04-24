/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/List.js"/>

Ext.namespace("Mobile.AdventureWorks.SalesOrder");

Mobile.AdventureWorks.SalesOrder.List = Ext.extend(Sage.Platform.Mobile.List, {   
    itemTemplate: new Simplate([
        '<li>',
        '<a href="#" target="_none" sdata:key="{%= $key %}" sdata:url="{%= $url %}">',
        '<h3>{%= SalesOrderNumber %}</h3>',
        '<h4>{%= TotalDue %}</h4>',
        '</a>',
        '</li>'
    ]),    
    constructor: function(o) {
        Mobile.AdventureWorks.SalesOrder.List.superclass.constructor.call(this);        
               
        Ext.apply(this, o, {
            id: 'sales_order_list',
            title: 'Sales Orders',
            pageSize: 20
        });
    },   
    createRequest:function() {
        var pageSize = this.pageSize;
        var startIndex = this.feed && this.feed['$startIndex'] && this.feed['$itemsPerPage'] 
            ? this.feed['$startIndex'] + this.feed['$itemsPerPage']
            : 1;

        return new Sage.SData.Client.SDataResourceCollectionRequest(this.getService())            
            .setResourceKind('salesorderheaders') 
            .setQueryArgs({
                'select': 'SalesOrderNumber,TotalDue' 
            })                      
            .setCount(pageSize)
            .setStartIndex(startIndex); 
    }
});