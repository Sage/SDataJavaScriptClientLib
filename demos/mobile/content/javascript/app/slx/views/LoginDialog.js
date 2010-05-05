/// <reference path="../../../ext/ext-core-debug.js"/>
/// <reference path="../../../iui/iui.js"/>
/// <reference path="../../../platform/Application.js"/>
/// <reference path="../../../../sdata/SDataResourceCollectionRequest.js"/>
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
    constructor: function (o) {
        Mobile.SalesLogix.LoginDialog.superclass.constructor.call(this);

        Ext.apply(this, o, {
            id: 'login_dialog',
            title: 'Login',
            expose: false
        });
    },
    init: function () {
        Mobile.SalesLogix.LoginDialog.superclass.init.call(this);

        this.el.select('.blueButton')
            .on('click', function (evt, el, o) {
                this.login();
            }, this, { preventDefault: true, stopPropagation: true });
    },
    login: function () {
        // todo: get actual parameters and validate them by requesting a simple feed (i.e. $service)

        var userName = this.el
            .child('input[name="user"]')
            .getValue();
        var userPass = this.el
            .child('input[name="password"]')
            .getValue();

        this.getService()
            .setUserName(userName)
            .setPassword(userPass);

        this.checkCredentials(userName, userPass);

        //this.el.dom.removeAttribute('selected');
    },
    getService: function () {
        /// <returns type="Sage.SData.Client.SDataService" />
        return App.getService();
    },
    createRequest: function (userName, userPass) {
        /// <returns type="Sage.SData.Client.SDataResourceCollectionRequest" />
        var request = new Sage.SData.Client.SDataResourceCollectionRequest(this.getService())
            .setResourceKind('Users')
            //.setResourceKind('contacts')
            .setCount(10)
            .setStartIndex(1);

        request.setQueryArgs({
            'where': String.format(" UserName eq '{0}' ", userName)
        });

        return request;
    },
    credentialsSuccess: function (feed) {
        //        if (this.requestedFirstPage == false) {
        //            this.requestedFirstPage = true;
        //            this.el
        //                .select('.loading')
        //                .remove();
        //        }

        this.feed = feed;
        if (this.feed['$totalResults'] > 0) {
            var o = [];
            for (var i = 0; i < feed.$resources.length; i++)
                o.push(feed.$resources[i]);

            if (o.length > 0)
                App.context = o;
            else
                App.context = []
            //alert('User login OK: ' + o.join(' '));
        }

        // proceed to next page
        //this.loadingEl.hide();
        this.el.dom.removeAttribute('selected');
    },
    credentialsFailure: function (response, o) {
        //this.loadingEl.hide();
        // todo: show bad credentials dialog
        alert('User login failed: ' + o.url);
        //alert('User login failed');
    },
    checkCredentials: function (userName, userPass) {
        var request = this.createRequest(userName, userPass);
        request.read({
            success: function (feed) {
                this.credentialsSuccess(feed);
            },
            failure: function (response, o) {
                this.credentialsFailure(response, o);
            },
            scope: this
        });
        // todo: show busy icon
        //this.loadingEl.show();
    }
});