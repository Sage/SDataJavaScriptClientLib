/*!
 * 
 */
﻿/// <reference path="../../ext/ext-core-debug.js"/>
/// <reference path="../../platform/Application.js"/>
/// <reference path="../../sdata/SDataService.js"/>

Ext.namespace("Mobile.SalesLogix");

Mobile.SalesLogix.Application = Ext.extend(Sage.Platform.Mobile.Application, {
    constructor: function () {
        Mobile.SalesLogix.Application.superclass.constructor.call(this);

        this.enableCaching = true;
        this.service = new Sage.SData.Client.SDataService();
        this.service
            .setServerName(window.location.hostname)            
            .setVirtualDirectory('sdata')
            .setApplicationName('slx')
            .setContractName('dynamic')
            .setIncludeContent(false);

        if (window.location.port && window.location.port != 80)
            this.service.setPort(window.location.port);

        if (/https/i.test(window.location.protocol))
            this.service.setProtocol('https');

        this.context = {};
    },
    setup: function () {
        Mobile.SalesLogix.Application.superclass.setup.apply(this, arguments);

        this.registerToolbar(new Sage.Platform.Mobile.MainToolbar({
            name: 'tbar',
            title: 'Mobile Demo'
        }));

        /*
        this.registerToolbar(new Sage.Platform.Mobile.FloatToolbar({
            name: 'fbar' 
        }));
        */

        this.registerView(new Mobile.SalesLogix.LoginDialog());
        this.registerView(new Mobile.SalesLogix.SearchDialog());
        this.registerView(new Mobile.SalesLogix.Home());

        this.registerView(new Mobile.SalesLogix.Account.List());
        this.registerView(new Mobile.SalesLogix.Account.Detail());
        this.registerView(new Mobile.SalesLogix.Account.Edit());

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

        /*
        this.registerView(new Mobile.SalesLogix.Activity.List({
            title: 'My Activities',
            context: {
                where: function() { return String.format('UserId eq "{0}"', App.context['user']); }     
            }
        }));
        */
    }
});

// instantiate application instance

var App = new Mobile.SalesLogix.Application();﻿/// <reference path="../../ext/ext-core-debug.js"/>
/// <reference path="../../platform/Application.js"/>
/// <reference path="../../platform/Format.js"/>
/// <reference path="../../sdata/SDataService.js"/>

Ext.namespace("Mobile.SalesLogix");

Mobile.SalesLogix.Format = (function() {
    var F = Sage.Platform.Mobile.Format;   
   
    return Ext.apply({}, {
        address: function(val, nl) {
            var lines = [];

            if (!F.isEmpty(val['Address1'])) lines.push(F.encode(val['Address1']));
            if (!F.isEmpty(val['Address2'])) lines.push(F.encode(val['Address2']));
            if (!F.isEmpty(val['Address3'])) lines.push(F.encode(val['Address3']));
            if (!F.isEmpty(val['Address4'])) lines.push(F.encode(val['Address4']));

            var location = [];

            if (!F.isEmpty(val['City']) && !F.isEmpty(F.encode(val['State'])))
            {
                location.push(F.encode(val['City']) + ',');
                location.push(F.encode(val['State']));                                            
            }
            else
            {
                if (!F.isEmpty(val['City'])) location.push(F.encode(val['City']));
                if (!F.isEmpty(val['State'])) location.push(F.encode(val['State']));                
            }

            if (!F.isEmpty(val['PostalCode'])) location.push(F.encode(val['PostalCode']));
                   
            if (location.length > 0)
            {
                lines.push(location.join(' '));
            }

            if (!F.isEmpty(val['Country'])) lines.push(F.encode(val['Country']));
            
            return nl ? lines.join('\n') : lines.join('<br />');
        },
        phone: function(val) {
            if (typeof val !== 'string') 
                return val;
            
            if (val.length != 10)
                return String.format('<a href="tel:{0}">{0}</a>', val);

            return String.format('<a href="tel:{0}">({1}) {2}-{3}</a>', val, val.substring(0, 3), val.substring(3, 6), val.substring(6));
        },
        currency: function(val) {
            // todo: add localization support
            var v = Mobile.SalesLogix.Format.fixed(val); 
            var f = Math.floor(100 * (v - Math.floor(v)));
            
            return String.format('${0}.{1}',
                (Math.floor(v)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                (f.toString().length < 2)
                    ? '0' + f.toString()
                    : f.toString()
            );        
        },
        date: function(val, fmt) {
            // 2007-04-12T00:00:00-07:00
            var match = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|(-|\+)(\d{2}):(\d{2}))/.exec(val);
            if (match)
            {
                // new Date(year, month, date [, hour, minute, second, millisecond ])
                var utc = new Date(Date.UTC(
                    parseInt(match[1]),
                    parseInt(match[2]) - 1, // zero based
                    parseInt(match[3]),
                    parseInt(match[4]),
                    parseInt(match[5]),
                    parseInt(match[6])
                ));

                if (match[7] !== 'Z')
                {
                    // todo: add support for minutes
                    var h = parseInt(match[9]); 
                    var m = parseInt(match[10]);
                    if (match[8] === '-')
                        utc.addMinutes((h * 60) + m);
                    else
                        utc.addMinutes(-1 * ((h * 60) + m));
                }

                return utc.toString(fmt || 'M/d/yyyy');
            }
            else
            {
                return val;
            }                                    
        },
        fixed: function(val, d) {
            if (typeof d !== 'number')
                d = 2;

            var m = Math.pow(10, d);
            var v = Math.floor(parseFloat(val) * m) / m;
            return v;
        }             
    }, F);
})();﻿/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../platform/Application.js"/>
/// <reference path="../sdata/SDataService.js"/>

Ext.namespace("Mobile.SalesLogix");

/// common frequently used templates
Mobile.SalesLogix.Template = (function() {
    return {
        nameLF: new Simplate([
            '{%= $["FirstName"] %}, {%= $["LastName"] %}'
        ])
    };
})();﻿/// <reference path="../../../ext/ext-core-debug.js"/>
/// <reference path="../../../iui/iui.js"/>
/// <reference path="../../../platform/View.js"/>
/// <reference path="Application.js"/>

Ext.namespace("Mobile.SalesLogix");

/// this is a very simple home view.
Mobile.SalesLogix.Home = Ext.extend(Sage.Platform.Mobile.View, {      
    itemTemplate: new Simplate([
        '<li>',
        '<a href="#{%= id %}" target="_view">',
        '{% if ($["icon"]) { %}',
        '<img src="{%= $["icon"] %}" alt="icon" class="icon" />',
        '{% } %}',
        '{%= title %}',
        '</a>',
        '</li>'
    ]),    
    constructor: function(o) {
        Mobile.SalesLogix.Home.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'home',
            title: 'Home',
            selected: true
        });        
    },
    render: function() {
        Mobile.SalesLogix.Home.superclass.render.call(this);

        var v = App.getViews();
        var o = [];        
        for (var i = 0; i < v.length; i++)
            if (v[i] != this && v[i].expose != false)
                o.push(this.itemTemplate.apply(v[i]));

        Ext.DomHelper.append(this.el, o.join(''));
    },
    init: function() {                                            
        Mobile.SalesLogix.Home.superclass.init.call(this);
        
        this.el
            .on('click', function(evt, el, o) {                                
                var source = Ext.get(el);
                var target;

                if (source.is('a[target="_view"]') || (target = source.up('a[target="_view"]')))
                    this.navigateToView(target || source, evt);

            }, this, { preventDefault: true, stopPropagation: true });                  

        App.on('registered', this.viewRegistered, this);
    },    
    navigateToView: function(el) {
        if (el) 
        {
            var id = el.dom.hash.substring(1);                       
            var view = App.getView(id);
            if (view)
                view.show();
        }
    },
    viewRegistered: function(view) {
        Ext.DomHelper.append(this.el, this.itemTemplate.apply(view));
    },
    load: function() {
        Mobile.SalesLogix.Home.superclass.load.call(this);

        if (App.isOnline() || !App.enableCaching)
        {
            var user = App.getService().getUserName();
            if (!user || !user.length)
                iui.showPageById("login_dialog");
        }
    }   
});﻿/// <reference path="../../../ext/ext-core-debug.js"/>
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
        '<a class="button blueButton" target="_none"><span>Login</span></a>',
        '<label>user:</label>',
        '<input id="{%= id %}_user" type="text" name="user" value="lee" /><br />',
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

        this.busy = false;
    },
    init: function () {
        Mobile.SalesLogix.LoginDialog.superclass.init.call(this);

        this.el.select('.blueButton')
            .on('click', function (evt, el, o) {
                this.login();
            }, this, { preventDefault: true, stopPropagation: true });
    },
    login: function () {
        if (this.busy) return;

        var username = this.el
            .child('input[name="user"]')
            .getValue();

        var password = this.el
            .child('input[name="password"]')
            .getValue();

        this.validateCredentials(username, password);
    },
    validateCredentials: function (username, password) {
        this.busy = true;
        this.el.addClass('dialog-busy');

        var service = App.getService()
            .setUserName(username)
            .setPassword(password);

        var request = new Sage.SData.Client.SDataResourceCollectionRequest(service)
            .setResourceKind('users')
            .setQueryArgs({
                'select': 'UserName',
                'where': String.format('UserName eq "{0}"', username)
            })
            .setCount(1)
            .setStartIndex(1);

        request.read({
            success: function (feed) {
                this.busy = false;
                this.el.removeClass('dialog-busy');

                if (feed['$resources'].length <= 0) {
                    service
                        .setUserName(false)
                        .setPassword(false);

                    alert('User does not exist.');
                }
                else {
                    App.context['user'] = feed['$resources'][0]['$key'];

                    this.el.dom.removeAttribute('selected');
                }
            },
            failure: function (response, o) {
                this.busy = false;
                this.el.removeClass('dialog-busy');

                service
                    .setUserName(false)
                    .setPassword(false);

                if (response.status == 403)
                    alert('Username or password is invalid.');
                else
                    alert('A problem occured on the server.');                                   
            },
            scope: this
        });
    }
});﻿/// <reference path="../../../ext/ext-core-debug.js"/>
/// <reference path="../../../iui/iui.js"/>
/// <reference path="../../../platform/Application.js"/>
/// <reference path="../../../platform/View.js"/>
/// <reference path="Application.js"/>

Ext.namespace("Mobile.SalesLogix");

/// this is a very simple home view.
Mobile.SalesLogix.SearchDialog = Ext.extend(Sage.Platform.Mobile.View, {   
    viewTemplate: new Simplate([
        '<form id="{%= id %}" class="dialog">',
        '<fieldset>',
        '<h1>{%= title %}</h1>',
        '<a type="cancel" class="button leftButton">Cancel</a>',
        '<a class="button blueButton" target="_none">Search</a>',
        '<label>query:</label>',
        '<input id="{%= id %}_query" type="text" name="query" />',
        '</fieldset>',
        '</form>'
    ]),    
    constructor: function(o) {
        Mobile.SalesLogix.SearchDialog.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'search_dialog',
            title: 'Search',
            expose: false
        });        
    },        
    init: function() {                                            
        Mobile.SalesLogix.SearchDialog.superclass.init.call(this);
        
        this.el
            .on('submit', function(evt, el, o) {
                return false;
            }, this, { preventDefault: true, stopPropagation: true })
            .dom.onsubmit = false; // fix for iui shenanigans

        this.el.select('.leftButton')
            .on('click', function(evt, el, o) {
                this.el.dom.removeAttribute('selected');
            }, this, { preventDefault: true, stopPropagation: true });    

        this.el.select('.blueButton')
            .on('click', function(evt, el, o) {    
                this.search();         
            }, this, { preventDefault: true, stopPropagation: true });    
        
        this.el.select('input[name="query"]')
            .on('keypress', function(evt, el, o) {
                if (evt.getKey() == 13 || evt.getKey() == 10)  
                {
                    evt.stopEvent();                    

                    /* fix to hide iphone keyboard when go is pressed */
                    if (/(iphone|ipad)/i.test(navigator.userAgent))
                        Ext.get('backButton').focus();
                    
                    this.search();                
                }
            }, this);            
    },    
    show: function(context) {
        this.context = context;
        this.el
            .child('input[name="query"]')
            .dom.value = typeof this.context.query === 'string' ? this.context.query : '';

        Mobile.SalesLogix.SearchDialog.superclass.show.call(this);

        this.el 
            .child('input[name="query"]')
            .focus();
    },
    search: function() {
        // todo: get actual parameters and validate them by requesting a simple feed (i.e. $service)

        var query = this.el
            .child('input[name="query"]')
            .getValue();

        if (this.context && this.context.fn)
            this.context.fn.call(this.context.scope || this, query);
     
        this.el.dom.removeAttribute('selected');
    }
});﻿/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataSingleResourceRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/Detail.js"/>
/// <reference path="../../Format.js"/>

Ext.namespace("Mobile.SalesLogix.Account");

Mobile.SalesLogix.Account.Detail = Ext.extend(Sage.Platform.Mobile.Detail, {       
    constructor: function(o) {
        Mobile.SalesLogix.Account.Detail.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'account_detail',
            title: 'Account',
            editor: 'account_edit',
            resourceKind: 'accounts'
        });

        this.layout = [
            {name: 'AccountName', label: 'name'},
            {name: 'MainPhone', label: 'phone', renderer: Mobile.SalesLogix.Format.phone},
            {name: 'Address', label: 'address', renderer: Mobile.SalesLogix.Format.address},
            {name: 'WebAddress', label: 'web', renderer: Mobile.SalesLogix.Format.link},
            {name: 'Type', label: 'type'},
            {name: 'SubType', label: 'sub-type'}, 
            {name: 'AccountManager.UserInfo', label: 'acct mgr', tpl: Mobile.SalesLogix.Template.nameLF},
            {name: 'Owner.OwnerDescription', label: 'owner'},
            {name: 'Status', label: 'status'},
            {name: 'CreateDate', label: 'create date', renderer: Mobile.SalesLogix.Format.date},
            {name: 'CreateUser', label: 'create user'},
            {options: {title: 'Related Items', list: true}, as: [
                {
                    view: 'contact_related', 
                    where: this.formatRelatedQuery.createDelegate(this, ['Account.id eq "{0}"'], true),
                    label: 'Contacts',
                    icon: 'products/slx/images/Contacts_24x24.gif'
                },
                {
                    view: 'opportunity_related', 
                    where: this.formatRelatedQuery.createDelegate(this, ['Account.id eq "{0}"'], true),
                    label: 'Opportunities',
                    icon: 'products/slx/images/Opportunity_List_24x24.gif'
                }
            ]}
        ];
    },
    init: function() {     
        Mobile.SalesLogix.Account.Detail.superclass.init.call(this);   
    },
    createRequest: function() {
        var request = Mobile.SalesLogix.Account.Detail.superclass.createRequest.call(this);
        
        request                     
            .setQueryArgs({
                'include': 'Address,AccountManager,AccountManager/UserInfo,Owner',
                'select': [
                    'AccountName',
                    'MainPhone',
                    'Address/*',
                    'WebAddress',
                    'Type',
                    'SubType',
                    'AccountManager/UserInfo/FirstName',
                    'AccountManager/UserInfo/LastName',
                    'Owner/OwnerDescription',
                    'Status',
                    'CreateDate',
                    'CreateUser'
                ].join(',')                  
            });     
        
        return request;                   
    } 
});﻿/// <reference path="../../../../ext/ext-core-debug.js"/>
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
            resourceKind: 'accounts'
        });

        this.layout = [
            {name: 'AccountName', label: 'name', type: 'text'},
            {name: 'Type', label: 'type', type: 'text'}           
        ];
    },
    init: function() {     
        Mobile.SalesLogix.Account.Edit.superclass.init.call(this);   
    },
    createRequest: function() {
        return new Sage.SData.Client.SDataSingleResourceRequest(this.getService())            
            .setResourceKind(this.resourceKind)
            .setQueryArgs({
                'include': 'Address,AccountManager,AccountManager/UserInfo,Owner',
                'select': [
                    'AccountName',
                    'MainPhone',
                    'Address/*',
                    'WebAddress',
                    'Type',
                    'SubType',
                    'AccountManager/UserInfo/FirstName',
                    'AccountManager/UserInfo/LastName',
                    'Owner/OwnerDescription',
                    'Status',
                    'CreateDate',
                    'CreateUser'
                ].join(',')                  
            })
            .setResourceSelector(String.format("'{0}'", this.entry['$key']));
    }
});﻿/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/List.js"/>

Ext.namespace("Mobile.SalesLogix.Account");

Mobile.SalesLogix.Account.List = Ext.extend(Sage.Platform.Mobile.List, {   
    itemTemplate: new Simplate([
        '<li>',
        '<a href="#account_detail" target="_detail" m:key="{%= $key %}" m:descriptor="{%: $descriptor %}">',
        '<h3>{%= $["AccountName"] %}</h3>',
        '<h4>{%= $["Address"] ? $["Address"]["City"] : "" %}</h4>',
        '</a>',
        '</li>'
    ]),    
    constructor: function(o) {
        Mobile.SalesLogix.Account.List.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'account_list',
            title: 'Accounts',
            resourceKind: 'accounts',
            pageSize: 10,
            icon: 'products/slx/images/Accounts_24x24.gif'
        });

        Ext.apply(this.tools || {}, {            
            fbar: [{
                name: 'test',
                title: 'note',                        
                cls: 'tool-note',  
                icon: 'products/slx/images/Note_32x32.gif',               
                fn: function() { alert("one"); },
                scope: this                
            },{
                name: 'test2',
                title: 'note',                        
                icon: 'products/slx/images/Whats_New_3D_Files_32x32.gif',             
                fn: function() { alert("two");},
                scope: this                
            }]            
        })
    },  
    formatSearchQuery: function(query) {
        return String.format('AccountName like "%{0}%"', query);
    },
    createRequest: function() {
        var request = Mobile.SalesLogix.Account.List.superclass.createRequest.call(this);

        request
            .setQueryArgs({
                'include': 'Address',
                'orderby': 'AccountName',
                'select': 'AccountName,Address/City'                
            });

        return request;
    }
});﻿/// <reference path="../../../../ext/ext-core-debug.js"/>
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
            resourceKind: 'contacts'
        });

        this.layout = [
            {label: 'name', tpl: Mobile.SalesLogix.Template.nameLF},
            {name: 'AccountName', label: 'account', view: 'account_detail', key: 'Account.$key', property: true},
            {name: 'WorkPhone', label: 'work', renderer: Mobile.SalesLogix.Format.phone},
            {name: 'Mobile', label: 'mobile', renderer: Mobile.SalesLogix.Format.phone},
            {name: 'Email', label: 'email', renderer: Mobile.SalesLogix.Format.mail},
            {name: 'Address', label: 'address', renderer: Mobile.SalesLogix.Format.address},
            {name: 'WebAddress', label: 'web', renderer: Mobile.SalesLogix.Format.link},
            {name: 'AccountManager.UserInfo', label: 'acct mgr', tpl: Mobile.SalesLogix.Template.nameLF},
            {name: 'Owner.OwnerDescription', label: 'owner'},
            {name: 'CreateDate', label: 'create date', renderer: Mobile.SalesLogix.Format.date},
            {name: 'CreateUser', label: 'create user'},
            {options: {title: 'Related Items', list: true}, as: [                
                {
                    view: 'opportunity_related', 
                    where: this.formatAccountRelatedQuery.createDelegate(this, ['Account.id eq "{0}"'], true),
                    label: 'Opportunities',
                    icon: 'products/slx/images/Opportunity_List_24x24.gif'
                }
            ]}           
        ];
    },        
    formatAccountRelatedQuery: function(entry, fmt) {
        return String.format(fmt, entry['Account']['$key']);
    },
    init: function() {     
        Mobile.SalesLogix.Contact.Detail.superclass.init.call(this);   
    },
    createRequest: function() {
        var request = Mobile.SalesLogix.Contact.Detail.superclass.createRequest.call(this);
        
        request         
            .setQueryArgs({
                'include': 'Account,Address,AccountManager,AccountManager/UserInfo',                
                'select': [
                    'Account/AccountName',
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
            });
        
        return request;            
    } 
});﻿/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/List.js"/>

Ext.namespace("Mobile.SalesLogix.Contact");

Mobile.SalesLogix.Contact.List = Ext.extend(Sage.Platform.Mobile.List, {   
    itemTemplate: new Simplate([
        '<li>',
        '<a href="#contact_detail" target="_detail" m:key="{%= $key %}" m:descriptor="{%: $descriptor %}">',
        '<h3>{%= LastName %}, {%= FirstName %}</h3>',
        '<h4>{%= AccountName %}</h4>',
        '</a>',
        '</li>'
    ]),    
    constructor: function(o) {
        Mobile.SalesLogix.Contact.List.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'contact_list',
            title: 'Contacts',
            resourceKind: 'contacts',
            pageSize: 10,
            icon: 'products/slx/images/Contacts_24x24.gif'
        });
    },   
    formatSearchQuery: function(query) {
        return String.format('(LastName like "%{0}%" or FirstName like "%{0}%")', query);
    },
    createRequest: function() {
        var request = Mobile.SalesLogix.Contact.List.superclass.createRequest.call(this);
       
        request
            .setResourceKind('contacts')
            .setQueryArgs({
                'orderby': 'LastName,FirstName',
                'select': 'LastName,FirstName,AccountName'                             
            });                       

        return request;
    }
});﻿/// <reference path="../../../../ext/ext-core-debug.js"/>
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
            resourceKind: 'opportunities'
        });

        this.layout = [
            {name: 'Description', label: 'name'},
            {name: 'Account.AccountName', label: 'account', view: 'account_detail', key: 'Account.$key', property: true},
            {name: 'EstimatedClose', label: 'est. close', renderer: Mobile.SalesLogix.Format.date},
            {name: 'SalesPotential', label: 'potential', renderer: Mobile.SalesLogix.Format.currency},
            {name: 'CloseProbability', label: 'probability'},
            {name: 'Weighted', label: 'weighted', renderer: Mobile.SalesLogix.Format.currency},
            {name: 'Stage', label: 'stage'},
            {name: 'AccountManager.UserInfo', label: 'acct mgr', tpl: Mobile.SalesLogix.Template.nameLF},
            {name: 'Owner.OwnerDescription', label: 'owner'},
            {name: 'Status', label: 'status'},
            {name: 'CreateDate', label: 'create date', renderer: Mobile.SalesLogix.Format.date},
            {name: 'CreateUser', label: 'create user'}            
        ];
    },        
    init: function() {     
        Mobile.SalesLogix.Opportunity.Detail.superclass.init.call(this);   
    },
    createRequest: function() {
        var request = Mobile.SalesLogix.Opportunity.Detail.superclass.createRequest.call(this); 

        request            
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
            });

        return request;
    } 
});﻿/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/List.js"/>

Ext.namespace("Mobile.SalesLogix.Opportunity");

Mobile.SalesLogix.Opportunity.List = Ext.extend(Sage.Platform.Mobile.List, {   
    itemTemplate: new Simplate([
        '<li>',
        '<a href="#opportunity_detail" target="_detail" m:key="{%= $key %}" m:descriptor="{%: $descriptor %}">',
        '<h3>{%= $["Description"] %}</h3>',
        '<h4>{%= $["Account"]["AccountName"] %}</h4>',
        '</a>',
        '</li>'
    ]),       
    constructor: function(o) {
        Mobile.SalesLogix.Opportunity.List.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'opportunity_list',
            title: 'Opportunities',
            resourceKind: 'opportunities',
            pageSize: 10,
            icon: 'products/slx/images/Opportunity_List_24x24.gif'
        });
    },   
    formatSearchQuery: function(query) {
        return String.format('(Description like "%{0}%")', query);

        // todo: The below does not currently work as the dynamic SData adapter does not support dotted notation for queries
        //       except in certain situations.  Support for general dotted notation is being worked on.
        //return String.format('(Description like "%{0}%" or Account.AccountName like "%{0}%")', query);
    },
    createRequest: function() {
        var request = Mobile.SalesLogix.Opportunity.List.superclass.createRequest.call(this);

        request           
            .setQueryArgs({
                'include': 'Account',
                'orderby': 'Description',
                'select': 'Description,Account/AccountName'                             
            });

        return request;
    }
});