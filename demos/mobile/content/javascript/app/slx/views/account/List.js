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
        '<a href="#account_detail" target="_detail" m:key="{%= $key %}" m:descriptor="{%: $descriptor %}">',
        '<h3>{%= $["AccountName"] %}</h3>',
        '<h4>{%= $["Address"] ? $["Address"]["City"] : "" %}</h4>',
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
    formatSearchQuery: function(query) {
        return String.format('AccountName like "%{0}%"', query);
    },
    createRequest: function() {
        var request = Mobile.SalesLogix.Account.List.superclass.createRequest.call(this);

        request
            .setResourceKind('accounts')
            .setQueryArgs({
                'include': 'Address',
                'orderby': 'AccountName',
                'select': 'AccountName,Address/City'                
            });

        return request;
    }
});