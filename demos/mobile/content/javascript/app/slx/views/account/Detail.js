/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataSingleResourceRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/Detail.js"/>

Ext.namespace("Mobile.SalesLogix.Account");

Mobile.SalesLogix.Account.Detail = Ext.extend(Sage.Platform.Mobile.Detail, {   
    formatAdress: function(address) {
        var lines = [];

        lines.push(address['Address1']);

        if (address['Address2']) lines.push(address['Address2']);
        if (address['Address3']) lines.push(address['Address3']);
        if (address['Address4']) lines.push(address['Address4']);

        lines.push(String.format('{0}, {1} {2}', 
            address['City'], 
            address['State'], 
            address['PostalCode']
        ));

        lines.push(address['Country']);

        return lines.join('<br />');
    },
    constructor: function(o) {
        Mobile.SalesLogix.Account.Detail.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'account_detail',
            title: 'Account',
            expose: false
        });

        this.layout = [
            {name: 'AccountName', label: 'name'},
            {name: 'MainPhone', label: 'phone'},
            {name: 'Address', label: 'address', renderer: this.formatAdress},
            {name: 'WebAddress', label: 'web'},
            {name: 'Type', label: 'type'},
            {name: 'SubType', label: 'sub-type'}, 
            {name: 'AccountManager.UserInfo', label: 'acct mgr', tpl: new Simplate([
                '{%= __v["FirstName"] %}, {%= __v["LastName"] %}'  
            ])},
            {name: 'Owner.OwnerDescription', label: 'owner'},
            {name: 'Status', label: 'status'},
            {name: 'CreateDate', label: 'create date'},
            {name: 'CreateUser', label: 'create user'}
        ];
    },
    init: function() {     
        Mobile.SalesLogix.Account.Detail.superclass.init.call(this);   
    },
    createRequest: function() {
        return new Sage.SData.Client.SDataSingleResourceRequest(this.getService())            
            .setResourceKind('accounts')
            .setQueryArgs({
                'include': 'Address,AccountManager,AccountManager/UserInfo,Owner'               
            })
            .setResourceSelector("'" + this.context.key + "'");
    } 
});