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
            if (this.isOnline())
                this.clearSDataRequestCache();

            this.service.on('beforerequest', this.loadSDataRequest, this);
            this.service.on('requestcomplete', this.cacheSDataRequest, this);
        }      
    },   
    isOnline: function() {
        return window.navigator.onLine;
    },
    clearSDataRequestCache: function() {   
        var check = function(k) {
            if (/^\[sdata\]\:/i.test(k))
            {
                window.localStorage.removeItem(k);
            }
        };
        
        /* firefox currently does not support standard iteration over storage classes */
        /* todo: find a better way to detect */
        if (Ext.isGecko) 
        {
            for (var i = 0; i < window.localStorage.length; i++) 
                check(window.localStorage.key(i));
        }
        else
        {     
            for (var key in window.localStorage) 
                check(key);            
        }
    },
    createCacheKey: function(request) {
        return "[sdata] " + request.toString();
    },
    loadSDataRequest: function(request, o) {
        /// <param name="request" type="Sage.SData.Client.SDataBaseRequest" />   
        if (this.isOnline()) return;
        
        var key = this.createCacheKey(request); 
        var feed = window.localStorage.getItem(key);   
        if (feed)
        {
            o.result = Ext.decode(feed);
        }                    
    },
    cacheSDataRequest: function(request, o, feed) {        
        /* todo: decide how to handle PUT/POST/DELETE */
        if (/get/i.test(o.method) && typeof feed === 'object')
        {
            var key = this.createCacheKey(request);

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

        if (this.bbar)
            this.bbar.init();

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
    beforeViewTransitionAway: function(view) {        
        if (this.tbar)
            this.tbar.clear();

        if (this.bbar)
            this.bbar.clear();

        view.beforeTransitionAway();
    },
    beforeViewTransitionTo: function(view) {
        view.beforeTransitionTo();
    },
    viewTransitionAway: function(view) {
        view.transitionAway();
    },
    viewTransitionTo: function(view) {
        if (this.tbar && view.tools && view.tools.tbar)
            this.tbar.display(view.tools.tbar);

        if (this.bbar && view.tools && view.tools.bbar)
            this.bbar.display(view.tools.bbar);

        view.transitionTo();
    }
});

/* DOM event extensions */
(function(){   
    var hold; 
    var touch;
    var prevent;
    var dispatch = function(el, type, bubble, cancel) {
        var evt = document.createEvent("UIEvent");

        evt.initEvent(type, bubble, cancel);
        
        el.dispatchEvent(evt);
    };
    var handleTouchStart = function(evt, el, o) {
        hold = setTimeout(dispatch.createDelegate(this, [el, 'hold', true, true]), 1500);
        touch = (new Date()).getTime();
    };
    var handleTouchEnd = function(evt, el, o) {
        clearTimeout(hold);

        var duration = (new Date()).getTime() - touch;
        if (duration > 1000) 
        {            
            prevent = true;

            evt.stopEvent();

            dispatch.call(this, el, 'clicklong', true, true);            
        }
    };
    var handleClick = function(evt) {
        if (prevent)
        {          	        
            if (evt.preventBubble) evt.preventBubble();
            if (evt.preventDefault) evt.preventDefault();
	        if (evt.stopPropagation) evt.stopPropagation();                        
            if (evt.stopImmediatePropagation) evt.stopImmediatePropagation();

            prevent = false;

            return false;
        } 
    }; 

    if (typeof window.orientation === 'undefined')
    {    
        Ext.getBody().on('mousedown', handleTouchStart);
        Ext.getBody().on('mouseup', handleTouchEnd);
    } 
    else
    {
        Ext.getBody().on('touchstart', handleTouchStart);
        Ext.getBody().on('touchend', handleTouchEnd);
    }

    /* todo: this will not work on IE, not that anything else will either, on current versions */    
    Ext.getBody().dom.addEventListener('click', handleClick, true); /* we want to capture click */
})();
