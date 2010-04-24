/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../platform/Application.js"/>
/// <reference path="../sdata/SDataService.js"/>
/// <reference path="app/views/contact/list.js"/>

Ext.namespace("Mobile.AdventureWorks");

Mobile.AdventureWorks.Application = Ext.extend(Sage.Platform.Mobile.Application, {
    constructor: function() {
        Mobile.AdventureWorks.Application.superclass.constructor.call(this);

        this.service = new Sage.SData.Client.SDataService();
        this.service
            .setServerName('10.40.112.24')      
            .setPort(3333)                        
            .setVirtualDirectory('sdata')
            .setApplicationName('aw')
            .setContractName('dynamic')
            .setIncludeContent(false);
    },
    setup: function() {
        Mobile.AdventureWorks.Application.superclass.setup.apply(this, arguments);       

        this.registerView(new Mobile.AdventureWorks.LoginDialog());
        this.registerView(new Mobile.AdventureWorks.Home());
        this.registerView(new Mobile.AdventureWorks.Contact.List());
        this.registerView(new Mobile.AdventureWorks.Contact.Detail());
        this.registerView(new Mobile.AdventureWorks.SalesOrder.List());        
    }    
});

// instantiate application instance

var App = new Mobile.AdventureWorks.Application();