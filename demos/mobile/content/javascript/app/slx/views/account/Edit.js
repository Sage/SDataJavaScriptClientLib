/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataSingleResourceRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/Detail.js"/>
/// <reference path="../../Format.js"/>

Ext.namespace("Mobile.SalesLogix.Account");

Mobile.SalesLogix.Account.Edit = Ext.extend(Sage.Platform.Mobile.Edit, {       
    constructor: function(o) {
        Mobile.SalesLogix.Account.Edit.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'account_edit',
            title: 'Account',
            expose: false
        });

        this.layout = [
            {name: 'AccountName', label: 'name', type: 'text'},
            {name: 'Type', label: 'type', type: 'text'}           
        ];
    },
    init: function() {     
        Mobile.SalesLogix.Account.Edit.superclass.init.call(this);   
    }   
});