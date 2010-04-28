/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataSingleResourceRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/Detail.js"/>
/// <reference path="../../Format.js"/>
/// <reference path="../../Template.js"/>

Ext.namespace("Mobile.SalesLogix.Opportunity");

Mobile.SalesLogix.Opportunity.Detail = Ext.extend(Sage.Platform.Mobile.Detail, {       
    constructor: function(o) {
        Mobile.SalesLogix.Opportunity.Detail.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'opportunity_detail',
            title: 'Opportunity',
            expose: false
        });

        this.layout = [
            {name: 'Description', label: 'name'},
            {name: 'Account.AccountName', label: 'account'},
            {name: 'EstimatedClose', label: 'est. close'},
            {name: 'SalesPotential', label: 'potential'},
            {name: 'CloseProbability', label: 'probability'},
            {name: 'Weighted', label: 'weighted'},
            {name: 'Stage', label: 'stage'},
            {name: 'AccountManager.UserInfo', label: 'acct mgr', tpl: Mobile.SalesLogix.Template.nameLF},
            {name: 'Owner.OwnerDescription', label: 'owner'},
            {name: 'Status', label: 'status'},
            {name: 'CreateDate', label: 'create date'},
            {name: 'CreateUser', label: 'create user'}            
        ];
    },        
    init: function() {     
        Mobile.SalesLogix.Opportunity.Detail.superclass.init.call(this);   
    },
    createRequest: function() {
        return new Sage.SData.Client.SDataSingleResourceRequest(this.getService())            
            .setResourceKind('opportunities')
            .setQueryArgs({
                'include': 'Account,AccountManager,AccountManager/UserInfo',                
                'select': [
                    'Description',
                    'Account/AccountName',
                    'EstimatedClose',
                    'SalesPotential',
                    'CloseProbability',
                    'Weighted',
                    'Stage',
                    'AccountManager/UserInfo/FirstName',
                    'AccountManager/UserInfo/LastName',
                    'Owner/OwnerDescription',
                    'Status',
                    'CreateDate',
                    'CreateUser'
                ].join(',')             
            })
            .setResourceSelector("'" + this.context.key + "'");
    } 
});