/// <reference path="../../../ext/ext-core-debug.js"/>
/// <reference path="../../../iui/iui.js"/>
/// <reference path="../../../platform/Application.js"/>
/// <reference path="../../../platform/View.js"/>
/// <reference path="Application.js"/>

Ext.namespace("Mobile.AdventureWorks");

/// this is a very simple home view.
Mobile.AdventureWorks.Login = Ext.extend(Sage.Platform.Mobile.View, {   
    viewTemplate: new Simplate([
        '<fieldset class="loading">',
        '<div class="row"><div class="loading-indicator">loading...</div></div>',        
        '</fieldset>',  
        '<a href="#" target="_none" class="whiteButton"><span>Login</span></a>'
    ]),    
    constructor: function(o) {
        Mobile.AdventureWorks.Login.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'login',
            expose: false,
            selected: true
        });        
    },    
    render: function() {
        Mobile.AdventureWorks.Login.superclass.render.call(this);

        this.el.update(this.viewTemplate.apply(this));
    },
    init: function() {                                            
        Mobile.AdventureWorks.Login.superclass.init.call(this);
        
        this.el.select(".whiteButton")
            .on('click', function(evt, el, o) {    
                    this.login();         
                }, this, { preventDefault: true, stopPropagation: true });                        
    },    
    login: function() {
        // todo: get actual parameters and validate them by requesting a simple feed (i.e. $service)

        var userName = document.getElementById('login_dialog_user').value;
        var userPass = document.getElementById('login_dialog_pass').value;
        App.getService()
            //.setUserName('kim2@adventure-works.com')
            //.setPassword('')
            .setUserName(userName)
            .setPassword(userPass)

        iui.showPageById("home");

        // todo: remove the ability to navigate to the login page via back
    }
});