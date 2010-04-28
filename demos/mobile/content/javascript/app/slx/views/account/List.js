/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/List.js"/>

Ext.namespace("Mobile.SalesLogix.Account");

Mobile.SalesLogix.Account.List = Ext.extend(Sage.Platform.Mobile.List, {   
    itemTemplate: new Simplate([
        '<li>',
        '<a href="#account_detail" target="_detail" m:key="{%= $key %}" m:url="{%= $url %}">',
        '<h3>{%= values["AccountName"] %}</h3>',
        '<h4>{%= values["Address"] ? values["Address"]["City"] : "" %}</h4>',
        '</a>',
        '</li>'
    ]),    
    constructor: function(o) {
        Mobile.SalesLogix.Account.List.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'account_list',
            title: 'Accounts',
            pageSize: 10,
            icon: 'content/images/app/slx/Accounts_24x24.gif'
        });
    },   
    createRequest:function() {
        var pageSize = this.pageSize;
        var startIndex = this.feed && this.feed['$startIndex'] && this.feed['$itemsPerPage'] 
            ? this.feed['$startIndex'] + this.feed['$itemsPerPage']
            : 1;

        return new Sage.SData.Client.SDataResourceCollectionRequest(this.getService())            
            .setResourceKind('accounts')
            .setQueryArgs({
                'include': 'Address',
                'orderby': 'AccountName',
                'select': 'AccountName,Address/City'                
            })                    
            .setCount(pageSize)
            .setStartIndex(startIndex); 
    }
});