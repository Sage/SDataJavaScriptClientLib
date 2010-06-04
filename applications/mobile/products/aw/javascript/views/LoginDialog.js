/// <reference path="../../../ext/ext-core-debug.js"/>
/// <reference path="../../../reui/reui.js"/>
/// <reference path="../../../platform/Application.js"/>
/// <reference path="../../../platform/View.js"/>
/// <reference path="Application.js"/>

Ext.namespace("Mobile.AdventureWorks");

/// this is a very simple home view.
Mobile.AdventureWorks.LoginDialog = Ext.extend(Sage.Platform.Mobile.View, {
    viewTemplate: new Simplate([
        '<form id="{%= id %}" class="dialog">',
        '<fieldset>',
        '<h1>{%= title %}</h1>',
        '<a class="button blueButton" target="_none">Login</a>',
        '<label>User:</label>',
        '<input id="{%= id %}_user" type="text" name="user" /><br />',
        '<label>Pass:</label>',
        '<input id="{%= id %}_pass" type="text" name="password" />',
        '</fieldset>',
        '</form>'
    ]),
    constructor: function (o) {
        Mobile.AdventureWorks.LoginDialog.superclass.constructor.call(this);

        Ext.apply(this, o, {
            id: 'login_dialog',
            title: 'Login',
            expose: false
        });
    },
    init: function () {
        Mobile.AdventureWorks.LoginDialog.superclass.init.call(this);

        this.el.select(".blueButton")
            .on('click', function (evt, el, o) {
                this.login();
            }, this, { preventDefault: true, stopPropagation: true });
    },
    login: function () {
        // todo: get actual parameters and validate them by requesting a simple feed (i.e. $service)

        //var userName = document.getElementById('login_dialog_user').value;
        //var userPass = document.getElementById('login_dialog_pass').value;
        var userName = this.el
            .child('input[name="user"]')
            .getValue();
        var userPass = this.el
            .child('input[name="password"]')
            .getValue();
        App.getService()
            .setUserName(userName)
            .setPassword(userPass);

        this.el.dom.removeAttribute("selected");
    }
});