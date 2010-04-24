/// <reference path="../ext/ext-core-debug.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.Application = Ext.extend(Ext.util.Observable, {
    constructor: function() {
        Sage.Platform.Mobile.Application.superclass.constructor.call(this);

        this.initialized = false;
        this.views = [];
        this.viewsById = {};
        this.addEvents(
            'registered'
        );
    },
    setup: function() {
        
    },
    init: function() {        
        this.setup();

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
        return this.viewsById[id];
    },
    getService: function() {
        return this.service;
    }
});

