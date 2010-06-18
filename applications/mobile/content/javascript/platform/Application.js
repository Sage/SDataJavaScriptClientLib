/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../reui/reui.js"/>
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
        this.views = {};    
        this.bars = {};    
        this.addEvents(
            'registered',
            'beforeviewtransitionaway',
            'beforeviewtransitionto',
            'viewtransitionaway',
            'viewtransitionto'
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
            return /^\[sdata\]/i.test(k);
        };
                
        /* todo: find a better way to detect */
        for (var i = window.localStorage.length - 1; i >= 0 ; i--) 
        {
            var key = window.localStorage.key(i);
            if (check(key))
                window.localStorage.removeItem(key);
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
        this.service = new Sage.SData.Client.SDataService()        
            .setServerName(this.serverName)            
            .setVirtualDirectory(this.virtualDirectory)
            .setApplicationName(this.applicationName)
            .setContractName(this.contractName)
            .setIncludeContent(false);

        if (this.port !== false)
            this.service.setPort(this.port);

        if (this.protocol !== false)
            this.service.setProtocol(this.protocol);

        this.setup();

        for (var n in this.bars) 
            this.bars[n].init();

        for (var n in this.views)
            this.views[n].init();        

        this.initialized = true;
    },
    registerView: function(view) {
        /// <summary>
        ///     Registers a view with the application.  If the application has already been 
        ///     initialized, the view is immediately initialized as well.
        /// </summary>
        /// <param name="view" type="Sage.Platform.Mobile.View">The view to be registered.</param>
        this.views[view.id] = view;

        if (this.initialized) view.init();

        this.fireEvent('registered', view);
    },
    registerToolbar: function(name, tbar)
    {
        if (typeof name === 'object')
        {
            tbar = name;
            name = tbar.name;
        }

        this.bars[name] = tbar;

        if (this.initialized) tbar.init();
    },
    getViews: function() {
        /// <returns elementType="Sage.Platform.Mobile.View">An array containing the currently registered views.</returns>
        var r = [];
        for (var n in this.views) r.push(this.views[n]);
        return r;
    },
    getActiveView: function() {
        /// <returns type="Sage.Platform.Mobile.View">The currently active view.</returns>        
        var el = ReUI.getCurrentPage() || ReUI.getCurrentDialog();
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
                return this.views[key];
            
            if (typeof key === 'object' && typeof key.id === 'string')
                return this.views[key.id];                
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
        for (var n in this.bars)
            if (this.bars[n].setTitle)
                this.bars[n].setTitle(title);
    },    
    beforeViewTransitionAway: function(view) { 
        this.fireEvent('beforeviewtransitionaway', view);
    
        for (var n in this.bars) 
            this.bars[n].clear();

        view.beforeTransitionAway();
    },
    beforeViewTransitionTo: function(view) {
        this.fireEvent('beforeviewtransitionto', view);

        view.beforeTransitionTo();
    },
    viewTransitionAway: function(view) {
        this.fireEvent('viewtransitionaway', view);

        view.transitionAway();
    },
    viewTransitionTo: function(view) {
        this.fireEvent('viewtransitionto', view);

        if (view.tools)
        {
            for (var n in view.tools)
                if (this.bars[n])
                    this.bars[n].display(view.tools[n]);
        }

        view.transitionTo();
    }
});

Ext.onReady(function(){
    var isApple = /(iphone|ipad|ipod)/i.test(navigator.userAgent),
        isMobile = (typeof window.orientation !== 'undefined'),
        onlyHorizontalSwipe = true,
        root = Ext.get(document.documentElement),
        minSwipeLength = 100.0,
        maxSwipeTime = 0.5,
        minLongClickTime = 1.0,
        maxLongClickLength = 5.0,
        startAt,
        startTime;    
    
    var touchMove = function(evt, el, o) {
        /* for general swipe, we do not need mouse move */
    };  
    var touchStart = function(evt, el, o) {        
        startAt = evt.getXY();
        startTime = (new Date()).getTime();
    };    
    var touchEnd = function(evt, el, o) {   
        var endAt = evt.getXY(),
            endTime = (new Date()).getTime();

        var duration = (endTime - startTime) / 1000.0,
            direction = {x: endAt[0] - startAt[0], y: endAt[1] - startAt[1]},
            length = Math.sqrt(direction.x * direction.x + direction.y * direction.y),        
            normalized = {x: direction.x / length, y: direction.y / length},
            dotProd = normalized.x * 0.0 + normalized.y * 1.0;            

        if (duration <= maxSwipeTime && length >= minSwipeLength)
        {
            var swipe;
            if (!onlyHorizontalSwipe)
            {
                evt.stopEvent();     
                
                if (dotProd >= 0.71)
                    swipe = 'down';            
                else if (dotProd <= -0.71)            
                    swipe = 'up';            
                else if (normalized.x < 0.0)
                    swipe = 'left';
                else
                    swipe = 'right';
            } 
            else
            {
                if (dotProd < 0.71 && dotProd > -0.71)
                {
                    evt.stopEvent();   

                    if (normalized.x < 0.0)
                        swipe = 'left';
                    else
                        swipe = 'right';
                }
            }

            if (swipe)
                ReUI.DomHelper.dispatch(el, 'swipe', {direction: swipe});        
        }        
        else if (duration >= minLongClickTime && length <= maxLongClickLength)
        {
            evt.stopEvent();

            ReUI.DomHelper.dispatch(el, 'clicklong');
        }
    };

    if (!isMobile)
    {    
        root.on('mousedown', touchStart);
        root.on('mouseup', touchEnd);
    } 
    else
    {
        root.on('touchstart', touchStart);
        root.on('touchend', touchEnd);
    }
});
