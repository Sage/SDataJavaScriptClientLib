/// <reference path="../../ext/ext-core-debug.js"/>
/// <reference path="../../platform/Application.js"/>
/// <reference path="../../sdata/SDataService.js"/>

Ext.namespace("Mobile.SalesLogix");

Mobile.SalesLogix.Application = Ext.extend(Sage.Platform.Mobile.Application, {
    constructor: function() {
        Mobile.SalesLogix.Application.superclass.constructor.call(this);

        this.service = new Sage.SData.Client.SDataService();
        this.service
            .setServerName(window.location.hostname)      
            .setPort(3333)                        
            .setVirtualDirectory('sdata-slx')
            .setApplicationName('slx')
            .setContractName('dynamic')
            .setIncludeContent(false);
    },
    setup: function() {
        Mobile.SalesLogix.Application.superclass.setup.apply(this, arguments);       

        this.registerView(new Mobile.SalesLogix.LoginDialog());
        this.registerView(new Mobile.SalesLogix.Home());
        
        this.registerView(new Mobile.SalesLogix.Account.List());  
        this.registerView(new Mobile.SalesLogix.Account.Detail());
              
        this.registerView(new Mobile.SalesLogix.Contact.List());                     
        this.registerView(new Mobile.SalesLogix.Contact.Detail());  
        this.registerView(new Mobile.SalesLogix.Contact.List({
            id: 'contact_related',
            expose: false
        }));  

        this.registerView(new Mobile.SalesLogix.Opportunity.List());
        this.registerView(new Mobile.SalesLogix.Opportunity.Detail());
        this.registerView(new Mobile.SalesLogix.Opportunity.List({
            id: 'opportunity_related',
            expose: false
        })); 
    }    
});

// instantiate application instance

var App = new Mobile.SalesLogix.Application();