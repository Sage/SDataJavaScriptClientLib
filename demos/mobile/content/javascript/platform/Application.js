/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="Format.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.Application = Ext.extend(Ext.util.Observable, {
    constructor: function() {
        Sage.Platform.Mobile.Application.superclass.constructor.call(this);

        this.initialized = false;
        this.context = {};
        this.views = [];        
        this.viewsById = {};
        this.addEvents(
            'registered',
            'search',
            'edit'
        );
    },
    setup: function() {
        
    },
    init: function() {        
        this.setup();

        if (this.tbar)
            this.tbar.init();

        for (var i = 0; i < this.views.length; i++) 
            this.views[i].init();

        this.initialized = true;
    },
    registerView: function(view) {
        this.views.push(view);
        this.viewsById[view.id] = view;

        if (this.initialized) view.init();

        this.fireEvent('registered', view);
    },
    getViews: function() {
        return this.views;
    },
    getView: function(id) {
        if (typeof id === 'string') 
            return this.viewsById[id];
        else if (typeof id.id !== 'undefined')
            return this.viewsById[id.id];
        else return null;
    },
    getService: function() {
        return this.service;
    },
    allowSearch: function(allow, has) {
        if (this.tbar && this.tbar.allowSearch)
            this.tbar.allowSearch(allow, has);
    },
    allowEdit: function(allow) {
        if (this.tbar && this.tbar.allowEdit)
            this.tbar.allowEdit(allow);
    }
});

