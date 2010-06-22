/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataSingleResourceRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/Detail.js"/>
/// <reference path="../../Format.js"/>

Ext.namespace("Mobile.GCRM.TradingAccount");

Mobile.GCRM.TradingAccount.Detail = Ext.extend(Sage.Platform.Mobile.Detail, {       
    constructor: function(o) {
        Mobile.GCRM.TradingAccount.Detail.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'gcrm_tradingaccount_detail',
            title: 'Trading Account',            
            resourceKind: 'tradingAccounts'
        });

        this.layout = [
            {name: 'name', label: 'name'},
            {name: 'status', label: 'status'},
            {name: 'website', label: 'web', renderer: Sage.Platform.Mobile.Format.link},
            {name: 'financeBalance', label: 'balance'},
            {name: 'financeLimit', label: 'limit'},
            {name: 'lastInvoiceDate', label: 'last inv'},
            {name: 'lastPaymentDate', label: 'last pay'},
            {options: {title: 'CRM Related Items', list: true}, as: [
                {
                    view: 'account_related', 
                    where: this.formatRelatedQuery.createDelegate(this, ["GlobalSyncID eq '{0}'", '$uuid'], true), 
                    label: 'Account(s)',
                    icon: 'products/slx/images/Accounts_24x24.gif'
                }
            ]}
        ];
    },
    init: function() {     
        Mobile.GCRM.TradingAccount.Detail.superclass.init.call(this);   
    },
    createRequest: function() {
        var request = Mobile.GCRM.TradingAccount.Detail.superclass.createRequest.call(this);
        
        request                     
            .setQueryArgs({                
                'select': [
                    'name',
                    'status',
                    'website',
                    'financeBalance',
                    'financeLimit',
                    'lastInvoiceDate',
                    'lastPaymentDate'
                ].join(',')                  
            });     
        
        return request;                   
    } 
});