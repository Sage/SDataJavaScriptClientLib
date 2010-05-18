/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../iui/iui.js"/>
/// <reference path="../../../packages/sdata-client-debug.js"/>
/// <reference path="Format.js"/>
/// <reference path="Utility.js"/>

Ext.namespace('Sage.Platform.Mobile');
Ext.USE_NATIVE_JSON = true;

Sage.Platform.Mobile.Application = Ext.extend(Ext.util.Observable, {
    constructor: function() {
        /// <field name="initialized" type="Boolean">True if the application has been initialized; False otherwise.</field>
        /// <field name="context" type="Object">A general store for global context data.</field>
        /// <field name="views" elementType="Sage.Platform.Mobile.View">A list of registered views.</field>
        /// <field name="viewsById" type="Object">A map for looking up a view by its ID.</field>

        Sage.Platform.Mobile.Application.superclass.constructor.call(this);

        this.initialized = false;
        this.enableCaching = false;
        this.context = {};
        this.views = [];        
        this.viewsById = {};
        this.addEvents(
            'registered',
            'search',
            'edit',
            'save',
            'refresh'
        );
    },
    setup: function() {
        /// <summary>
        ///     Sets up the handling for transition events from iUI.
        /// </summary>
        Ext.getBody().on('beforetransition', function(evt, el, o) {
            var view = this.getView(el);
            if (view)
            {
                if (evt.browserEvent.out)
                    this.beforeViewTransitionAway(view);
                else
                    this.beforeViewTransitionTo(view);               
            }
        }, this);
        Ext.getBody().on('aftertransition', function(evt, el, o) {
            var view = this.getView(el);
            if (view)
            {
                if (evt.browserEvent.out)
                    this.viewTransitionAway(view);
                else
                    this.viewTransitionTo(view);
            }
        }, this);  
        
        if (this.service && this.enableCaching)
        {
            this.service.on('beforerequest', this.loadSDataRequest, this);
            this.service.on('requestcomplete', this.cacheSDataRequest, this);
        }      
    },   
    isOnline: function() {
        return navigator.onLine;
    },
    loadSDataRequest: function(request, o) {
        /// <param name="request" type="Sage.SData.Client.SDataBaseRequest" />   
        if (this.isOnline()) return;
        
        var key = request.toString();  
        var feed = window.localStorage.getItem(key);   
        if (feed)
        {
            console.log("cache hit: %s", key);

            o.result = Ext.decode(feed);
        }                    
    },
    cacheSDataRequest: function(request, o, feed) {        
        if (typeof feed === 'object')
        {
            var key = request.toString();

            console.log("caching: %s", key);

            window.localStorage.removeItem(key);
            window.localStorage.setItem(key, Ext.encode(feed));            
        }
    },
    init: function() { 
        /// <summary>
        ///     Initializes this application as well as the toolbar and all currently registered views.
        /// </summary>
        this.setup();

        if (this.tbar)
            this.tbar.init();

        for (var i = 0; i < this.views.length; i++) 
            this.views[i].init();

        this.initialized = true;
    },
    registerView: function(view) {
        /// <summary>
        ///     Registers a view with the application.  If the application has already been 
        ///     initialized, the view is immediately initialized as well.
        /// </summary>
        /// <param name="view" type="Sage.Platform.Mobile.View">The view to be registered.</param>
        this.views.push(view);
        this.viewsById[view.id] = view;

        if (this.initialized) view.init();

        this.fireEvent('registered', view);
    },
    getViews: function() {
        /// <returns elementType="Sage.Platform.Mobile.View">An array containing the currently registered views.</returns>
        return this.views;
    },
    getActiveView: function() {
        /// <returns type="Sage.Platform.Mobile.View">The currently active view.</returns>
        var el = iui.getCurrentPage() || iui.getCurrentDialog();
        if (el)
            return this.getView(el);

        return null;
    },
    getPreviousView: function() {
        /// <returns type="Sage.Platform.Mobile.View">The previously active view.</returns>
        var el = iui.getPreviousPage();
        if (el)
            return this.getView(el);

        return null;
    },
    getView: function(key) {
        /// <returns type="Sage.Platform.Mobile.View">The requested view.</returns>
        /// <param name="key" type="String">
        ///     1: id - The id of the view to get.
        ///     2: element - The main element of the view to get.        
        /// <param>
        if (key)
        {
            if (typeof key === 'string')
                return this.viewsById[key];
            
            if (typeof key === 'object' && typeof key.id === 'string')
                return this.viewsById[key.id];                
        }
        return null;
    },
    getService: function() {
        /// <returns type="Sage.SData.Client.SDataService">The application's SData service instance.</returns>
        return this.service;
    },
    setTitle: function(title) {
        /// <summary>Sets the applications current title.</summary>
        /// <param name="title" type="String">The new title.</summary>
        if (this.tbar && this.tbar.setTitle)
            this.tbar.setTitle(title);
    },
    allowSearch: function(allow, has) {
        /// <summary>Instructs the toolbar to either enable or disable search.</summary>
        /// <param name="allow" type="Boolean">True to enable search; False otherwise.</param>
        /// <param name="has" optional="true">The current search query, if any.</param>
        if (this.tbar && this.tbar.allowSearch)
            this.tbar.allowSearch(allow, has);
    },
    allowEdit: function(allow) {
        /// <summary>Instructs the toolbar to either enable or disable edit.</summary>
        /// <param name="allow" type="Boolean">True to enable edit; False otherwise.</param>
        if (this.tbar && this.tbar.allowEdit)
            this.tbar.allowEdit(allow);
    },
    allowSave: function(allow) {
        /// <summary>Instructs the toolbar to either enable or disable save.</summary>
        /// <param name="allow" type="Boolean">True to enable save; False otherwise.</param>
        if (this.tbar && this.tbar.allowSave)
            this.tbar.allowSave(allow);
    },
    beforeViewTransitionAway: function(view) {
        this.allowSearch(false);
        this.allowEdit(false);
        this.allowSave(false);

        view.beforeTransitionAway();
    },
    beforeViewTransitionTo: function(view) {
        view.beforeTransitionTo();
    },
    viewTransitionAway: function(view) {
        view.transitionAway();
    },
    viewTransitionTo: function(view) {
        this.allowSearch(view.canSearch, view.queryText); // todo: adjust naming   
        this.allowEdit(view.canEdit);
        this.allowSave(view.canSave);

        view.transitionTo();
    }
});

