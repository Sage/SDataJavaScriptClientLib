/// <reference path="../../../ext/ext-core-debug.js"/>
/// <reference path="../../../iui/iui.js"/>
/// <reference path="../../../platform/Application.js"/>
/// <reference path="../../../platform/View.js"/>
/// <reference path="Application.js"/>

Ext.namespace("Mobile.SalesLogix");

/// this is a very simple home view.
Mobile.SalesLogix.LoginDialog = Ext.extend(Sage.Platform.Mobile.View, {   
    viewTemplate: new Simplate([
        '<form id="{%= id %}" class="dialog">',
        '<fieldset>',
        '<h1>{%= title %}</h1>',
        '<a class="button blueButton" target="_none">Login</a>',
        '<label>user:</label>',
        '<input id="{%= id %}_user" type="text" name="user" /><br />',
        '<label>pass:</label>',
        '<input id="{%= id %}_pass" type="text" name="password" />',
        '</fieldset>',
        '</form>'
    ]),    
    constructor: function(o) {
        Mobile.SalesLogix.LoginDialog.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'login_dialog',
            title: 'Login',
            expose: false
        });        
    },        
    init: function() {                                            
        Mobile.SalesLogix.LoginDialog.superclass.init.call(this);
        
        this.el.select('.blueButton')
            .on('click', function(evt, el, o) {    
                    this.login();         
                }, this, { preventDefault: true, stopPropagation: true });                        
    },    
    login: function() {
        // todo: get actual parameters and validate them by requesting a simple feed (i.e. $service)

        App.getService()
            .setUserName('lee')
            .setPassword('')    
     
        this.el.dom.removeAttribute('selected');
    }
});