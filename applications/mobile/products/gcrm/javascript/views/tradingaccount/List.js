/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/List.js"/>

Ext.namespace("Mobile.GCRM.TradingAccount");

Mobile.GCRM.TradingAccount.List = Ext.extend(Sage.Platform.Mobile.List, {        
    itemTemplate: new Simplate([
        '<li>',
        '<a href="#gcrm_tradingaccount_detail" target="_detail" m:key="{%= $["$key"] || $["$uuid"] %}" m:descriptor="{%: $["name"] %}">',
        '<h3>{%= $["name"] %}</h3>',
        '<h4>{%= $["reference"] %} - {%= $["status"] %}</h4>',
        '</a>',
        '</li>'
    ]),  
    constructor: function(o) {
        Mobile.GCRM.TradingAccount.List.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'trading_account_list',
            title: 'Trading Accounts',
            resourceKind: 'tradingAccounts',            
            pageSize: 10,
            icon: 'products/slx/images/Accounts_24x24.gif',
            tools: {}
        });        
    },  
    formatSearchQuery: function(query) {
        return String.format('name like "%{0}%"', query);
    },
    createRequest: function() {
        var request = Mobile.GCRM.TradingAccount.List.superclass.createRequest.call(this);

        request
            .setQueryArgs({
                'orderby': 'name',
                'select': 'name,reference,status'                
            });

        return request;
    }
});