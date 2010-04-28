/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/List.js"/>

Ext.namespace("Mobile.SalesLogix.Opportunity");

Mobile.SalesLogix.Opportunity.List = Ext.extend(Sage.Platform.Mobile.List, {   
    itemTemplate: new Simplate([
        '<li>',
        '<a href="#opportunity_detail" target="_detail" m:key="{%= $key %}" m:url="{%= $url %}">',
        '<h3>{%= __v["Description"] %}</h3>',
        '<h4>{%= __v["Account"]["AccountName"] %}</h4>',
        '</a>',
        '</li>'
    ]),    
    constructor: function(o) {
        Mobile.SalesLogix.Opportunity.List.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'opportunity_list',
            title: 'Opportunities',
            pageSize: 10,
            icon: 'content/images/app/slx/Opportunity_List_24x24.gif'
        });
    },   
    createRequest: function() {
        var pageSize = this.pageSize;
        var startIndex = this.feed && this.feed['$startIndex'] && this.feed['$itemsPerPage'] 
            ? this.feed['$startIndex'] + this.feed['$itemsPerPage']
            : 1;

        var request = new Sage.SData.Client.SDataResourceCollectionRequest(this.getService())            
            .setResourceKind('opportunities')
            .setQueryArgs({
                'include': 'Account',
                'orderby': 'Description',
                'select': 'Description,Account/AccountName'                             
            })                    
            .setCount(pageSize)
            .setStartIndex(startIndex); 

        if (this.current && this.current.where)
            request.setQueryArgs({
                'where': this.current.where
            });        

        return request;
    }
});