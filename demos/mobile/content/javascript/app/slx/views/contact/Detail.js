/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataSingleResourceRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/Detail.js"/>
/// <reference path="../../Format.js"/>
/// <reference path="../../Template.js"/>

Ext.namespace("Mobile.SalesLogix.Contact");

Mobile.SalesLogix.Contact.Detail = Ext.extend(Sage.Platform.Mobile.Detail, {       
    constructor: function(o) {
        Mobile.SalesLogix.Contact.Detail.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'contact_detail',
            title: 'Contact',
            expose: false
        });

        this.layout = [
            {label: 'name', tpl: Mobile.SalesLogix.Template.nameLF},
            {name: 'AccountName', label: 'account'},
            {name: 'WorkPhone', label: 'work', renderer: Mobile.SalesLogix.Format.phone},
            {name: 'MobilePhone', label: 'mobile', renderer: Mobile.SalesLogix.Format.phone},
            {name: 'Email', label: 'email', renderer: Mobile.SalesLogix.Format.mail},
            {name: 'Address', label: 'address', renderer: Mobile.SalesLogix.Format.address},
            {name: 'WebAddress', label: 'web', renderer: Mobile.SalesLogix.Format.link},
            {name: 'AccountManager.UserInfo', label: 'acct mgr', tpl: Mobile.SalesLogix.Template.nameLF},
            {name: 'Owner.OwnerDescription', label: 'owner'},
            {name: 'CreateDate', label: 'create date'},
            {name: 'CreateUser', label: 'create user'}
        ];
    },
    init: function() {     
        Mobile.SalesLogix.Contact.Detail.superclass.init.call(this);   
    },
    createRequest: function() {
        return new Sage.SData.Client.SDataSingleResourceRequest(this.getService())            
            .setResourceKind('contacts')
            .setQueryArgs({
                'include': 'Address,AccountManager,AccountManager/UserInfo',                
                'select': [
                    'FirstName',
                    'LastName',
                    'AccountName',
                    'WorkPhone',
                    'Mobile',
                    'Email',
                    'Address/*',
                    'WebAddress',
                    'AccountManager/UserInfo/FirstName',
                    'AccountManager/UserInfo/LastName',
                    'Owner/OwnerDescription',
                    'CreateDate',
                    'CreateUser'
                ].join(',')             
            })
            .setResourceSelector("'" + this.context.key + "'");
    } 
});