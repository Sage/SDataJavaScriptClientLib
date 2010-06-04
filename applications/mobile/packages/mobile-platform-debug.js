/*!
 * 
 */
﻿/// <reference path="../ext/ext-core-debug.js"/>
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
        this.bars = {};    
        this.viewsById = {};
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
        return this.views;
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

/* DOM event extensions */
/* not quite ready for prime time yet */
//(function(){   
//    var hold; 
//    var touch;
//    var prevent;
//    var dispatch = function(el, type, bubble, cancel) {
//        var evt = document.createEvent("UIEvent");

//        evt.initEvent(type, bubble, cancel);
//        
//        el.dispatchEvent(evt);
//    };
//    var handleTouchStart = function(evt, el, o) {
//        hold = setTimeout(dispatch.createDelegate(this, [el, 'hold', true, true]), 1500);
//        touch = (new Date()).getTime();
//    };
//    var handleTouchEnd = function(evt, el, o) {
//        clearTimeout(hold);

//        var duration = (new Date()).getTime() - touch;
//        if (duration > 1000) 
//        {            
//            prevent = true;

//            evt.stopEvent();

//            dispatch.call(this, el, 'clicklong', true, true);            
//        }
//    };
//    var handleClick = function(evt) {
//        if (prevent)
//        {          	        
//            if (evt.preventBubble) evt.preventBubble();
//            if (evt.preventDefault) evt.preventDefault();
//	        if (evt.stopPropagation) evt.stopPropagation();                        
//            if (evt.stopImmediatePropagation) evt.stopImmediatePropagation();

//            prevent = false;

//            return false;
//        } 
//    }; 

//    if (typeof window.orientation === 'undefined')
//    {    
//        Ext.getBody().on('mousedown', handleTouchStart);
//        Ext.getBody().on('mouseup', handleTouchEnd);
//    } 
//    else
//    {
//        Ext.getBody().on('touchstart', handleTouchStart);
//        Ext.getBody().on('touchend', handleTouchEnd);
//    }

//    /* todo: this will not work on IE, not that anything else will either, on current versions */    
//    Ext.getBody().dom.addEventListener('click', handleClick, true); /* we want to capture click */
//})();
﻿/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../iui/iui-sage.js"/>
/// <reference path="../Simplate.js"/>
/// <reference path="Application.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.View = Ext.extend(Ext.util.Observable, { 
    viewTemplate: new Simplate([
        '<ul id="{%= id %}" title="{%= title %}" {% if (selected) { %} selected="true" {% } %}>',            
        '</ul>'
    ]),    
    constructor: function(o) {
        /// <field name="id" type="String">The view's ID.</field>
        /// <field name="title" type="String">The view's title.  This will be applied to the top bar's title area by iUI.</field>
        /// <field name="expose" type="Boolean">True if the view is exposed to the home screen; False otherwise.</field>
        /// <field name="loaded" type="Boolean">True if the view has been loaded; False otherwise.</field>
        /// <field name="canSearch" type="Boolean">True if the view supports search; False otherwise.</field>
        /// <field name="canEdit" type="Boolean">True if the view supports editing; False otherwise.</field>
        /// <field name="canSave" type="Boolean">True if the view supports saving; False otherwise.</field>
        /// <field name="viewTemplate" type="Simplate">The template used for rendering the view's main element.</field>
        /// <field name="el" type=Ext.Element">The view's main element.</field>
        Sage.Platform.Mobile.View.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'view',
            title: '',
            canSearch: false
        });        

        this.loaded = false;
    },
    render: function() {
        /// <summary> 
        ///     Renders the view to the body of the page and stores the rendered element in the 'el' field.
        /// </summary>
        this.el = Ext.DomHelper.append(
            Ext.getBody(), 
            this.viewTemplate.apply(this), 
            true
        );
    },
    init: function() {
        /// <summary>
        ///     Initializes the view by rendering calling render and binding any applicable events to the 
        ///     view's main element.
        /// </summary>
        this.render();
        this.el
            .on('load', function(evt, el, o) {
                if (this.loaded == false) 
                {
                    this.load(); 
                    this.loaded = true;
                }   
            }, this);        
    },
    isActive: function() {
        return (this.el.getAttribute('selected') === 'true');
    },
    setTitle: function(title) {
        /// <summary>
        ///     Sets the title attribute on the view's main element.  This will be used by iUI during transition
        ///     to replace the title in the top bar.
        /// </summary>
        /// <param name="title" type="String">The new title.</param>
        this.el.dom.setAttribute('title', title);
    },
    load: function() {
        /// <summary>
        ///     Called once the first time the view is about to be transitioned to.
        /// </summary>
    },
    show: function() {
        /// <summary>
        ///     Show's the view using iUI in order to transition to the new element.
        /// </summary>
        ReUI.show(this.el.dom);       
    },
    beforeTransitionTo: function() {
        /// <summary>
        ///     Called before the view is transitioned (slide animation complete) to.
        /// </summary>
    },
    beforeTransitionAway: function() {      
        /// <summary>
        ///     Called before the view is transitioned (slide animation complete) away from.
        /// </summary>  
    },
    transitionTo: function() {                
        /// <summary>
        ///     Called after the view has been transitioned (slide animation complete) to.
        /// </summary>
    },
    transitionAway: function() {                    
        /// <summary>
        ///     Called after the view has been transitioned (slide animation complete) away from.
        /// </summary>
    },
    getService: function() {
        /// <summary>
        ///     Returns the primary SDataService instance for the view.  
        /// </summary>
        /// <returns type="Sage.SData.Client.SDataService">The SDataService instance.</returns>
        return App.getService();
    }  
});﻿/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="Application.js"/>
/// <reference path="View.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.List = Ext.extend(Sage.Platform.Mobile.View, {
    viewTemplate: new Simplate([            
        '<ul id="{%= id %}" title="{%= title %}">',                       
        '</ul>'
    ]),
    contentTemplate: new Simplate([
        '<li class="loading"><div class="loading-indicator">{%= loadingText %}</div></li>',
        '<li class="more" style="display: none;"><a href="#" target="_none" class="whiteButton moreButton"><span>{%= moreText %}</span></a></li>'
    ]),
    itemTemplate: new Simplate([
        '<li>',
        '<a href="#" target="_detail" m:key="{%= $key %}">',
        '<h3>{%= $descriptor %}</h3>',
        '</a>',
        '</li>'
    ]),    
    noDataTemplate: new Simplate([
        '<li class="no-data">',
        '<h3>{%= noDataText %}</h3>',
        '</li>'
    ]),
    moreText: 'More',
    titleText: 'List',
    searchText: 'Search',
    noDataText: 'no records',
    loadingText: 'loading...',    
    constructor: function(o) {
        /// <field name="resourceKind" type="String">The resource kind that is bound to this view.</field>
        /// <field name="pageSize" type="Number">The number of records to return with each request.</field>
        /// <field name="requestedFirstPage" type="Boolean">True if the first page has been request; False otherwise.<field>
        /// <field name="noDataText" type="String">A message to display when there is no data.</field>
        /// <field name="contentTemplate" type="Simplate">A template used to render the initial content of the view.</field>
        /// <field name="itemTemplate" type="Simplate">
        ///     A template used to render each resource feed entry.  This template is rendered and then applied to the DOM
        ///     before the "li.more" element.
        /// </field>
        /// <field name="noDataTemplate" type="Simplate">A template used to render the no data message.</field>
        Sage.Platform.Mobile.List.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'generic_list',
            title: this.titleText,
            pageSize: 20,
            requestedFirstPage: false,
            searchDialog: 'search_dialog',
            tools: {
                tbar: [{
                    name: 'search',
                    title: this.searchText,                        
                    cls: function() { return this.query ? 'button greenButton' : 'button blueButton'; },                 
                    fn: this.showSearchDialog,
                    scope: this                
                }]
            }
        });
    },   
    render: function() {
        Sage.Platform.Mobile.List.superclass.render.call(this);

        this.clear();
    }, 
    init: function() {     
        Sage.Platform.Mobile.List.superclass.init.call(this);      

        this.el
            .on('click', function(evt, el, o) {                                
                var source = Ext.get(el);
                var target;

                if (source.is('.more') || (source.up('.more')))                
                    this.more(evt);
                else if (source.is('a[target="_detail"]') || (target = source.up('a[target="_detail"]')))
                    this.navigateToDetail(target || source, evt);

            }, this, { preventDefault: true, stopPropagation: true });                      

        App.on('refresh', function(o) {
            if (this.resourceKind && o.resourceKind === this.resourceKind)
                this.clear();
        }, this); 
    },
    showSearchDialog: function() {
        /// <summary>
        ///     Called when the search tool button is clicked.  This method displays the search dialog.
        /// </summary>
        App.getView(this.searchDialog).show({
            query: this.queryText,
            fn: this.search,
            scope: this
        });
    },
    search: function(searchText) {
        /// <summary> 
        ///     Called when a new search is activated.  This method sets up the SData query, clears the content 
        ///     of the view, and fires a request for updated data.
        /// </summary>
        /// <param name="searchText" type="String">The search query.</param>        
        this.clear();

        this.queryText = searchText && searchText.length > 0
            ? searchText
            : false;

        this.query = this.queryText !== false
            ? this.formatSearchQuery(this.queryText)
            : false;   

        if (App.bars.tbar && App.bars.tbar.tool)
        {                        
            if (this.query)
                App.bars.tbar.tool.el.replaceClass('blueButton', 'greenButton');
            else
                App.bars.tbar.tool.el.replaceClass('greenButton', 'blueButton');
        }

        this.requestData(); 
    },
    formatSearchQuery: function(query) {
        /// <summary>
        ///     Called to transform a textual query into an SData query compatible search expression.
        /// </summary>
        /// <returns type="String">An SData query compatible search expression.</returns>
        return false;
    },        
    createRequest:function() {
        /// <summary>
        ///     Creates SDataResourceCollectionRequest instance and sets a number of known properties.        
        /// </summary>
        /// <returns type="Sage.SData.Client.SDataResourceCollectionRequest">An SDataResourceCollectionRequest instance.<returns>
        var pageSize = this.pageSize;
        var startIndex = this.feed && this.feed['$startIndex'] > 0 && this.feed['$itemsPerPage'] > 0 
            ? this.feed['$startIndex'] + this.feed['$itemsPerPage']
            : 1;

        var request = new Sage.SData.Client.SDataResourceCollectionRequest(this.getService())                         
            .setCount(pageSize)
            .setStartIndex(startIndex); 

        if (this.resourceKind) 
            request.setResourceKind(this.resourceKind)

        var where = [];
        var expr;
        if (this.context && (expr = this.expandExpression(this.context.where)))
            where.push(expr);

        if (this.query)
            where.push(this.query);

        if (where.length > 0)
            request.setQueryArgs({
                'where': where.join(' and ')
            });  

        return request;
    },
    navigateToDetail: function(el) {
        /// <summary>
        ///     Navigates to the requested detail view.
        /// </summary>
        /// <param name="el" type="Ext.Element">The element that initiated the navigation.</param>
        if (el) 
        {
            var id = el.dom.hash.substring(1);
            var key = el.getAttribute("key", "m");  
            var descriptor = el.getAttribute("descriptor", "m");         

            App.getView(id).show({
                descriptor: descriptor,
                key: key
            });
        }
    },
    processFeed: function(feed) {
        /// <summary>
        ///     Processes the feed result from the SData request and renders out the resource feed entries.
        /// </summary>
        /// <param name="feed" type="Object">The feed object.</param>
        if (this.requestedFirstPage == false) 
        {
            this.requestedFirstPage = true;
            this.el
                .select('.loading')
                .remove();           
        }
                       
        this.feed = feed;
                
        if (this.feed['$totalResults'] === 0)
        {
            Ext.DomHelper.insertBefore(this.moreEl, this.noDataTemplate.apply(this));
        }
        else
        {
            var o = [];
            for (var i = 0; i < feed.$resources.length; i++)                
                o.push(this.itemTemplate.apply(feed.$resources[i]));
        
            if (o.length > 0)                    
                Ext.DomHelper.insertBefore(this.moreEl, o.join(''));
        }

        this.moreEl            
            .removeClass('more-loading');

        if (this.hasMoreData())
            this.moreEl.show();
        else
            this.moreEl.hide();
    },
    hasMoreData: function() {
        /// <summary>
        ///     Deterimines if there is more data to be shown by inspecting the last feed result.
        /// </summary>
        /// <returns type="Boolean">True if the feed has more data; False otherwise.</returns>
        if (this.feed['$startIndex'] > 0 && this.feed['$itemsPerPage'] > 0 && this.feed['$totalResults'] >= 0)
        {
            var start = this.feed['$startIndex'];
            var count = this.feed['$itemsPerPage'];
            var total = this.feed['$totalResults'];

            return (start + count <= total);
        }
        else
        {
            return true; // no way to determine, always assume more data
        }        
    },
    requestFailure: function(response, o) {
        /// <summary>
        ///     Called when an error occurs while request data from the SData endpoint.
        /// </summary>
        /// <param name="response" type="Object">The response object.</param>
        /// <param name="o" type="Object">The options that were passed to Ext when creating the Ajax request.</param>
    },
    requestData: function() {
        /// <summary>
        ///     Initiates the SData request.
        /// </summary>
        var request = this.createRequest();        
        request.read({  
            success: function(feed) {     
                this.processFeed(feed);
            },
            failure: function(response, o) {
                this.requestFailure(response, o);
            },
            scope: this
        });       
    },
    more: function() {
        /// <summary>
        ///     Called when the more button is clicked.
        /// </summary>
        this.moreEl.addClass('more-loading');
        this.requestData();
    },  
    expandExpression: function(expression) {
        /// <summary>
        ///     Expands the passed expression if it is a function.
        /// </summary>
        /// <param name="expression" type="String">
        ///     1: function - Called on this object and must return a string.
        ///     2: string - Returned directly.
        /// </param>
        if (typeof expression === 'function') 
            return expression.call(this);
        else
            return expression;
    },
    hasContext: function() {
        /// <summary> 
        ///     Indicates whether or not the view has a context.
        /// </summary>
        /// <returns type="Boolean">True if there is a current, or new, context; False otherwise.</returns>
        return (this.context || this.newContext);
    },         
    isNewContext: function() {   
        /// <summary>
        ///     Indicates whether or not the view has a new context.
        /// </summary>
        /// <returns type="Boolean">True if there is a new context; False otherwise.</returns>
        if (!this.context) return true;
         
        return (this.expandExpression(this.context.where) != this.expandExpression(this.newContext.where))
    },
    beforeTransitionTo: function() {
        Sage.Platform.Mobile.List.superclass.beforeTransitionTo.call(this);

        if (this.hasContext() && this.isNewContext())
        {
            this.clear();            
        } 
    },
    transitionTo: function() {
        Sage.Platform.Mobile.List.superclass.transitionTo.call(this);

        if (this.hasContext() && this.isNewContext())
        {
            this.context = this.newContext;
        }
        
        if (this.requestedFirstPage == false)         
            this.requestData();                
    },    
    show: function(o) {
        this.newContext = o; 

        Sage.Platform.Mobile.List.superclass.show.call(this);                     
    },  
    clear: function() {
        /// <summary>
        ///     Clears the view and re-applies the default content template.
        /// </summary>
        this.el.update(this.contentTemplate.apply(this));

        this.moreEl = this.el.down(".more"); 

        this.requestedFirstPage = false;
        this.feed = false;
        this.query = false;
        this.queryText = false;
    }  
});﻿/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../Simplate.js"/>
/// <reference path="../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../sdata/SDataService.js"/>
/// <reference path="View.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.Detail = Ext.extend(Sage.Platform.Mobile.View, {   
    viewTemplate: new Simplate([            
        '<div id="{%= id %}" title="{%= title %}" class="panel">',             
        '</div>'
    ]),
    contentTemplate: new Simplate([
        '<fieldset class="loading">',
        '<div class="row"><div class="loading-indicator">{%= loadingText %}</div></div>',
        '</fieldset>',
    ]),
    sectionBeginTemplate: new Simplate([
        '<h2>{%= $["title"] %}</h2>',
        '{% if ($["list"]) { %}<ul>{% } else { %}<fieldset>{% } %}'
    ]),
    sectionEndTemplate: new Simplate([
        '{% if ($["list"]) { %}</ul>{% } else { %}</fieldset>{% } %}'
    ]),
    propertyTemplate: new Simplate([
        '<div class="row">',
        '<label>{%= label %}</label>',       
        '<span>{%= value %}</span>',
        '</div>'
    ]),
    relatedPropertyTemplate: new Simplate([
        '<div class="row">',
        '<label>{%= label %}</label>',       
        '<a href="#{%= view %}" target="_related" m:key="{%= key %}">{%= value %}</a>',
        '</div>'
    ]),
    relatedTemplate: new Simplate([
        '<li>',
        '<a href="#{%= view %}" target="_related" m:where="{%= where %}">',
        '{% if ($["icon"]) { %}',
        '<img src="{%= $["icon"] %}" alt="icon" class="icon" />',
        '{% } %}',
        '{%= label %}',
        '</a>',
        '</li>'
    ]),    
    editText: 'Edit',
    titleText: 'Detail',
    detailsText: 'Details',
    loadingText: 'loading...',
    constructor: function(o) {
        Sage.Platform.Mobile.Detail.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'generic_detail',
            title: this.titleText,
            expose: false,
            editor: false,
            tools: {
                tbar: [{
                    name: 'edit',
                    title: this.editText,
                    hidden: function() { return !this.editor; },                                                                
                    cls: 'button blueButton',                 
                    fn: this.navigateToEdit,
                    scope: this                
                }]
            }        
        });        
    },
    render: function() {
        Sage.Platform.Mobile.Detail.superclass.render.call(this);

        this.clear();
    },
    init: function() {  
        Sage.Platform.Mobile.Detail.superclass.init.call(this);

        this.el
            .on('click', function(evt, el, o) {                
                var source = Ext.get(el);
                var target;

                if (source.is('a[target="_related"]') || (target = source.up('a[target="_related"]')))
                {
                    evt.stopEvent();

                    this.navigateToRelated(target || source, evt);                    
                }
            }, this);
        
        // todo: find a better way to handle these notifications
        App.on('refresh', function(o) {
            if (this.context && o.key === this.context.key)
            {
                if (o.data && o.data['$descriptor']) 
                    this.setTitle(o.data['$descriptor']);

                this.clear();                
            }
        }, this);  
    },
    formatRelatedQuery: function(entry, fmt) {
        return String.format(fmt, entry['$key']);        
    },
    navigateToEdit: function() {
        var view = App.getView(this.editor);
        if (view)
            view.show(this.entry);
    },
    navigateToRelated: function(el, evt) {    
        var context = false;            
        var where = el.getAttribute('where', 'm');                
        var key = el.getAttribute('key', 'm');        

        if (key)
            context = {
                'key': key
            };        
        else if (where)                  
            context = {
                'where': where
            };        
                    
        if (context) 
        {            
            var id = el.dom.hash.substring(1);   
            var view = App.getView(id);
            if (view)
                view.show(context);
        }                                              
    },    
    createRequest: function() {
        var request = new Sage.SData.Client.SDataSingleResourceRequest(this.getService())
            .setResourceSelector(String.format("'{0}'", this.context.key)); 

        if (this.resourceKind) 
            request.setResourceKind(this.resourceKind);

        return request;
    },    
    processLayout: function(layout, options, entry)
    {
        var sections = [];
        var content = [];
        
        content.push(this.sectionBeginTemplate.apply(options));        

        for (var i = 0; i < layout.length; i++)
        {
            var current = layout[i];

            if (current['as'])
            {
                sections.push(current);
                continue;
            } 
            else if (current['view'] && current['property'] !== true)
            {
                var related = Ext.apply({}, current);
                
                if (related['where'])
                    related['where'] = typeof related['where'] === 'function' 
                        ? Sage.Platform.Mobile.Format.encode(related['where'](entry))
                        : Sage.Platform.Mobile.Format.encode(related['where']);
                
                content.push(this.relatedTemplate.apply(related));                                    
                continue;
            }
            else
            {            
                var provider = current['provider'] || Sage.Platform.Mobile.Utility.getValue;
                var value = provider(entry, current['name']);
                var formatted = current['tpl']
                    ? current['tpl'].apply(value)
                    : current['renderer']
                        ? current['renderer'](value)
                        : value;     
                        
                if (current['view'] && current['key'])
                {
                    content.push(this.relatedPropertyTemplate.apply({
                        name: current['name'],
                        label: current['label'],
                        renderer: current['renderer'],
                        provider: current['provider'],                
                        entry: entry,
                        raw: value,
                        value: formatted,
                        key: provider(entry, current['key']),
                        view: current['view']
                    }));
                }
                else
                {
                    content.push(this.propertyTemplate.apply({
                        name: current['name'],
                        label: current['label'],
                        renderer: current['renderer'],
                        provider: current['provider'],                
                        entry: entry,
                        raw: value,
                        value: formatted
                    }));
                }
            }
        }

        content.push(this.sectionEndTemplate.apply(options));

        Ext.DomHelper.append(this.el, content.join(''));

        for (var i = 0; i < sections.length; i++)
        {
            var current = sections[i];  
            
            this.processLayout(current['as'], current['options'], entry);  
        }        
    },    
    requestFailure: function(response, o) {
       
    },
    requestData: function() {
        var request = this.createRequest();        
        request.read({  
            success: function(entry) {   
                this.el
                    .select('.loading')
                    .remove();                

                this.entry = entry;
                
                if (this.entry)                  
                    this.processLayout(this.layout, {title: this.detailsText}, this.entry);
            },
            failure: function(response, o) {
                this.requestFailure(response, o);
            },
            scope: this
        });       
    },
    show: function(o) {
        if (o)
        {
            if (o.key) 
                this.newContext = o;

            if (o.descriptor)
                this.setTitle(o.descriptor);
        }

        Sage.Platform.Mobile.Detail.superclass.show.call(this);                     
    },  
    isNewContext: function() {
        return (!this.context || (this.context && this.context.key != this.newContext.key));
    }, 
    beforeTransitionTo: function() {
        Sage.Platform.Mobile.Detail.superclass.beforeTransitionTo.call(this);

        this.canEdit = this.editor ? true : false;

        if (this.isNewContext())
        {
            this.clear();
        } 
    },
    transitionTo: function() {
        Sage.Platform.Mobile.Detail.superclass.transitionTo.call(this);

        // if the current context has changed, re-render the view
        if (this.isNewContext()) 
        {
            this.context = this.newContext;
                    
            this.requestData();  
        }   
    },
    clear: function() {
        this.el.update(this.contentTemplate.apply(this));

        this.context = false;
    }      
});﻿/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../Simplate.js"/>
/// <reference path="../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../sdata/SDataService.js"/>
/// <reference path="View.js"/>

Ext.namespace('Sage.Platform.Mobile');
Ext.namespace('Sage.Platform.Mobile.Controls');

// todo: move to separate files
Sage.Platform.Mobile.Controls.Field = function(name) {
    this.name = name;    
};

Sage.Platform.Mobile.Controls.Field.prototype = {
    apply: function(external) {
        return this.template.apply(this);
    },
    bind: function(container) {
        this.el = container.child(String.format('input[name="{0}"]', this.name));
    },   
    isDirty: function() {
        return true;
    }
};

Sage.Platform.Mobile.Controls.TextField = Ext.extend(Sage.Platform.Mobile.Controls.Field, {
    template: new Simplate([
        '<input type="text" name="{%= name %}">',
    ]),
    getValue: function() {
        return this.el.getValue();
    },
    setValue: function(val) {
        this.value = val;

        this.el.dom.value = val;
    },
    isDirty: function() {
        return (this.value != this.getValue());
    }
});

Sage.Platform.Mobile.Controls.registered = {
    'text': Sage.Platform.Mobile.Controls.TextField
};

Sage.Platform.Mobile.Edit = Ext.extend(Sage.Platform.Mobile.View, {   
    viewTemplate: new Simplate([            
        '<div id="{%= id %}" title="{%= title %}" class="panel" effect="flip">',  
        '<fieldset class="loading">',
        '<div class="row"><div class="loading-indicator">{%= loadingText %}</div></div>',
        '</fieldset>',
        '<div class="body" style="display: none;">',
        '</div>',           
        '</div>'
    ]),       
    sectionBeginTemplate: new Simplate([
        '<h2>{%= $["title"] %}</h2>',
        '{% if ($["list"]) { %}<ul>{% } else { %}<fieldset>{% } %}'
    ]),
    sectionEndTemplate: new Simplate([
        '{% if ($["list"]) { %}</ul>{% } else { %}</fieldset>{% } %}'
    ]),
    propertyTemplate: new Simplate([
        '<div class="row row-edit">',
        '<label>{%= label %}</label>',       
        '{%! field %}', /* apply sub-template */
        '</div>'
    ]),    
    textFieldTemplate: new Simplate([
        '<input type="text" name="{%= name %}">'
    ]),
    saveText: 'Save',
    titleText: 'Edit',
    detailsText: 'Details',    
    loadingText: 'loading...',
    constructor: function(o) {
        Sage.Platform.Mobile.Edit.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'generic_edit',
            title: this.titleText,
            expose: false,
            tools: {
                tbar: [{
                    name: 'edit',
                    title: this.saveText,                                                              
                    cls: 'button blueButton',                 
                    fn: this.save,
                    scope: this                
                }]
            },
            fields: {}          
        });
    },
    render: function() {
        Sage.Platform.Mobile.Edit.superclass.render.call(this);               

        this.bodyEl = this.el.child('.body').setVisibilityMode(Ext.Element.DISPLAY);
        this.loadEl = this.el.child('.loading').setVisibilityMode(Ext.Element.DISPLAY);
    },
    init: function() {  
        Sage.Platform.Mobile.Edit.superclass.init.call(this);                

        this.processLayout(this.layout, {title: this.detailsText});

        for (var name in this.fields) this.fields[name].bind(this.el);

        this.loadEl.hide();
        this.bodyEl.show();

        // todo: find a better way to handle these notifications
        if (this.canSave)
            App.on('save', function() {
                if (this.isActive())
                    this.save();
            }, this);  
    },      
    createRequest: function() {
       
    },    
    createTemplateRequest: function() {

    },
    processLayout: function(layout, options)
    {
        var sections = [];
        var content = [];
        
        content.push(this.sectionBeginTemplate.apply(options));        

        for (var i = 0; i < layout.length; i++)
        {
            var current = layout[i];

            if (current['as'])
            {
                sections.push(current);
                continue;
            }            
            else
            {   
                var ctor = Sage.Platform.Mobile.Controls.registered[current['type']];
                var field = this.fields[current['name']] = new ctor(current['name']);

                content.push(this.propertyTemplate.apply({
                    label: current['label'],
                    field: field
                }));
            }
        }

        content.push(this.sectionEndTemplate.apply(options));

        Ext.DomHelper.append(this.el, content.join(''));

        for (var i = 0; i < sections.length; i++)
        {
            var current = sections[i];  
            
            this.processLayout(current['as'], current['options']);  
        }        
    },    
    requestFailure: function(response, o) {
       
    },
    requestData: function() {
        var request = this.createRequest();  
        if (request)      
            request.read({  
                success: function(entry) {                   
                },
                failure: function(response, o) {
                    this.requestFailure(response, o);
                },
                scope: this
            });       
    },
    show: function(o) {
        if (typeof o !== 'undefined') 
        {
            this.entry = o;
            this.newContext = true;
        }        
        else
        {
            this.newContext = false;
        }       

        Sage.Platform.Mobile.Edit.superclass.show.call(this);                     
    },  
    isNewContext: function() {
        return this.newContext;
    }, 
    beforeTransitionTo: function() {
        Sage.Platform.Mobile.Edit.superclass.beforeTransitionTo.call(this);
    },
    setValues: function(o) {
        for (var name in this.fields)
        {
            var value = Sage.Platform.Mobile.Utility.getValue(o, name);

            this.fields[name].setValue(value);
        }
    },
    getValues: function() {
        var o = {};
        var empty = true;

        for (var name in this.fields)
        {                        
            if (this.fields[name].isDirty())
            {
                var value = this.fields[name].getValue();
                
                Sage.Platform.Mobile.Utility.setValue(o, name, value);

                empty = false;
            }
        }
        return empty ? false : o;
    },
    createEntryForUpdate: function(values) {
        return Ext.apply(values, {
            '$key': this.entry['$key'],
            '$etag': this.entry['$etag'],
            '$name': this.entry['$name']           
        });
    },
    save: function() {
        if (this.busy) return;        

        var values = this.getValues();                        
        if (values) 
        {           
            this.busy = true;
            this.el.addClass('view-busy');
            if (App.tbar)
                App.tbar.el.addClass('toolbar-busy');

            var entry = this.createEntryForUpdate(values);

            var request = this.createRequest();            
            if (request)
                request.update(entry, {
                    success: function(modified) {  
                        this.busy = false;
                        this.el.removeClass('view-busy');
                        if (App.tbar)
                            App.tbar.el.removeClass('toolbar-busy');
                                                
                        App.fireEvent('refresh', {
                            resourceKind: this.resourceKind,
                            key: modified['$key'],
                            data: {
                                '$descriptor': modified['$descriptor']
                            }
                        });
                            
                        ReUI.back();
                    },
                    failure: function(response, o) {
                        this.busy = false;
                        this.el.removeClass('view-busy');
                        if (App.tbar)
                            App.tbar.el.removeClass('toolbar-busy');
                    },
                    scope: this
                });
        } 
        else
        {
            ReUI.back();
        }
    },
    transitionTo: function() {
        Sage.Platform.Mobile.Edit.superclass.transitionTo.call(this); 
        
        if (this.isNewContext())
        {
            this.setValues(this.entry);
        }       

        // todo: check to see if we are creating instead of editing and, if so, request the 'template'
        //       from SData.
    },
    clear: function() {
        // todo: add back if we are creating instead of editing.
        // this.el.update(this.contentTemplate.apply(this));
    }      
});﻿/// <reference path="../ext/ext-core-debug.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.Format = (function() {
    function isEmpty(val) {
        if (typeof val !== 'string') return !val;
        
        return (val.length <= 0);
    };

    function encode(val) {
        if (typeof val !== 'string') return val;

        return val
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };

    function decode(val) {
        if (typeof val !== 'string') return val;

        return val
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"');
    };    

    return {
        encode: encode,
        isEmpty: isEmpty,       
        link: function(val) {
            if (typeof val !== 'string')
                return val;

            return String.format('<a target="_blank" href="http://{0}">{0}</a>', val);
        },
        mail: function(val) {
            if (typeof val !== 'string')
                return val;

            return String.format('<a href="mailto:{0}">{0}</a>', val);            
        },        
        trim: function(val) {
            return val.replace(/^\s+|\s+$/g,'');
        }
    };
})();

﻿/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="Format.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.Toolbar = Ext.extend(Ext.util.Observable, {
    barTemplate: new Simplate([
        '<div class="{%= cls %}">',
        '<h1 id="pageTitle">{%= title %}</h1>',
        '<a id="backButton" class="button" href="#"></a>',
        '</div>'
    ]), 
    constructor: function(o) {
        Sage.Platform.Mobile.Toolbar.superclass.constructor.call(this);

        Ext.apply(this, o, {
            cls: 'toolbar',
            title: 'Mobile'
        });
    },
    render: function() {
        this.el = Ext.DomHelper.append(
            Ext.getBody(), 
            this.barTemplate.apply(this), 
            true
        );
    },
    getToolEl: function(name) {
        return this.el;
    },
    init: function() {
        this.render();            
    },
    clear: function() {
    },
    show: function() {
        this.el.show();
    },
    hide: function() {
        this.el.hide();
    },
    make: function(tool) {
        var result = {};

        for (var prop in tool)
            if (prop !== 'fn' && typeof tool[prop] === 'function')
                result[prop] = tool[prop].call(tool.scope || this);
            else
                result[prop] = tool[prop];

        return result;
    },
    display: function(tools) {        
    }
});

﻿/// <reference path="../../ext/ext-core-debug.js"/>
/// <reference path="../../platform/Application.js"/>
/// <reference path="../../platform/Toolbar.js"/>
/// <reference path="../../sdata/SDataService.js"/>

Ext.namespace("Sage.Platform.Mobile");

Sage.Platform.Mobile.MainToolbar = Ext.extend(Sage.Platform.Mobile.Toolbar, {
    barTemplate: new Simplate([
        '<div class="{%= cls %}">',
        '<h1 id="pageTitle">{%= title %}</h1>',
        '<a id="backButton" class="button" href="#"></a>',              
        '</div>'
    ]),
    toolTemplate: new Simplate([
        '<a target="_tool" class="{%= cls %}" style="display: {%= $["hidden"] ? "none" : "block" %}"><span>{%= title %}</span></a>',
    ]),
    constructor: function(o) {
        Sage.Platform.Mobile.MainToolbar.superclass.constructor.apply(this, arguments);        
    }, 
    init: function() {
        Sage.Platform.Mobile.MainToolbar.superclass.init.call(this);        

        this.el
            .on('click', function(evt, el, o) {
                var source = Ext.get(el);
                var target;

                if (source.is('a[target="_tool"]') || (target = source.up('a[target="_tool"]')))
                {
                    evt.stopEvent();

                    if (this.tool && this.tool.fn)
                        this.tool.fn.call(this.tool.scope || this);
                }
            }, this);
    },
    setTitle: function(title) {
        Ext.get('pageTitle').update(title);
    },  
    clear: function() {
        if (this.tool)
        {
            this.el.child('a[target="_tool"]').remove(); 
            this.tool = false;
        }
    },
    display: function(tools) {
        /* this toolbar only supports a single action */
        if (tools.length > 0)
        {
            this.tool = Ext.apply({}, tools[0]);

            for (var p in this.tool)
                if (p !== 'fn' && typeof this.tool[p] === 'function')
                    this.tool[p] = this.tool[p].call(this.tool.scope || this);
                                
            this.tool.el = Ext.DomHelper.append(this.el, this.toolTemplate.apply(this.tool), true);
        }
    }    
});
﻿/// <reference path="../../../content/javascript/ext/ext-core-debug.js"/>
/// <reference path="../../../content/javascript/platform/Application.js"/>
/// <reference path="../../../content/javascript/platform/Toolbar.js"/>

Ext.namespace("Sage.Platform.Mobile");

Sage.Platform.Mobile.FloatToolbar = Ext.extend(Sage.Platform.Mobile.Toolbar, {
    barTemplate: new Simplate([
        '<div class="{%= cls %}" style="visibility: hidden">',
        '<div class="{%= containerCls %}">',
        '</div>',        
        '</div>'
    ]),
    toolTemplate: new Simplate([        
        '<a target="_tool" href="#{%= $["name"] %}" class="{%= $["cls"] %}" style="display: {%= $["hidden"] ? "none" : "block" %}">',
        '<img src="{%= $["icon"] %}" />',
        '<span>{%= $["title"] %}</span>',
        '</a>',
    ]),
    androidFixTemplate: new Simplate([
        '<a target="_none" href="#" class="android-webkit-fix"></a>'
    ]),
    constructor: function(o) {
        Sage.Platform.Mobile.MainToolbar.superclass.constructor.apply(this, arguments); 
        
        Ext.apply(this, o, {
            cls: 'toolbar-float',
            containerCls: 'toolbar-float-container'
        });
        
        this.tools = {};   
    }, 
    render: function() {
        Sage.Platform.Mobile.FloatToolbar.superclass.render.call(this);
        
        this.containerEl = this.el.child('.' + this.containerCls);
    },
    init: function() {
        Sage.Platform.Mobile.FloatToolbar.superclass.init.call(this);        

        if (/android/i.test(navigator.userAgent))
        {   
            /*
             * there is an issue with click "bleed through" on absolutely positioned elements on 
             * android devices which is why we need to go though the trouble of preventing the actual 
             * click event.
             * see: http://code.google.com/p/android/issues/detail?id=6721             
             */         
            var prevent = false;

            this.el
                .on('touchstart', function(evt, el, o) {                    
                    var source = Ext.get(el);
                    var target;

                    prevent = true;
         
                    if (source.is('a[target="_tool"]') || (target = source.up('a[target="_tool"]')))
                    {
                        var name = (target || source).dom.hash.substring(1);

                        if (this.tools.hasOwnProperty(name))
                            this.execute(this.tools[name]);
                    }                
                    else if (source.is('.' + this.cls) || (target = source.up('.' + this.cls)))
                    {
                        this.toggle();
                    }

                }, this);

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
        
            Ext.getBody().dom.addEventListener('click', handleClick, true); /* capture phase */
        }
        else
        {
            this.el
                .on('click', function(evt, el, o) {                    
                    var source = Ext.get(el);
                    var target;
                               
                    if (source.is('a[target="_tool"]') || (target = source.up('a[target="_tool"]')))
                    {
                        var name = (target || source).dom.hash.substring(1);

                        if (this.tools.hasOwnProperty(name))
                            this.execute(this.tools[name]);
                    }                
                    else if (source.is('.' + this.cls) || (target = source.up('.' + this.cls)))
                    {
                        this.toggle();
                    }
                }, this, { preventDefault: true, stopPropagation: true });
        }       
        
        Ext.fly(window)
            .on("scroll", this.onBodyScroll, this, {buffer: 125})
            .on("resize", this.onBodyScroll, this, {buffer: 125});
    },
    open: function() {
        this.el.dom.setAttribute('open', 'open');
    },
    close: function() {
        this.el.dom.removeAttribute('open');
    },
    toggle: function() {
        if (this.el.getAttribute('open') === 'open')
            this.close();
        else
            this.open();
    },
    execute: function(tool) {
        if (tool && tool.fn)
            tool.fn.call(tool.scope || this);
    },   
    calculateY: function() {
        var wH = window.innerHeight;
        var sH = Ext.getBody().getScroll().top;
        var eH = this.el.getHeight();

        return (wH + sH) - eH - 8;
    },
    calculateNoVisY: function() {
        var wH = window.innerHeight;
        var sH = Ext.getBody().getScroll().top;

        return wH + sH + 8;
    },   
    move: function(y, fx)
    {
        if (Ext.isGecko) 
        { 
            if (fx === false)
            {
                this.el.setStyle({
                    'top': String.format('{0}px', y)
                });
            }
            else
            {
                this.el.shift({
                    y: y,
                    easing: 'easeBothStrong',
                    duration: .5,
                    stopFx: true,
                    callback: function() {
                        this.el.setStyle({
                            'right': '0px',
                            'left': 'auto'
                        });
                    },
                    scope: this   
                });
            } 
        }
        else
        {            
            if (fx === false)
            {
                this.el.setStyle({
                    '-webkit-transition-property': 'none',
                    '-moz-transition-property': 'none',
                    'transition-property': 'none'
                });   
            }
            else
            {
                this.el.setStyle({
                    '-webkit-transition-property': 'inherit',
                    '-moz-transition-property': 'inherit',
                    'transition-property': 'inherit'
                });
            }                       

            this.el.setStyle({
                '-webkit-transform': String.format('translateY({0}px)', y)
            });
        }
    },    
    onBodyScroll: function(evt, el, o)
    {
        this.move(this.calculateY());
    },    
    getToolEl: function(name) {
        if (this.tools[name] && this.tools[name].el) 
            return this.tools[name].el;
        return null;
    },
    clear: function() {
        this.el.hide();
        this.containerEl.update('');        
    },    
    display: function(tools) {
        /* if there are no tools to display, hide this bar */
        /* this toolbar only supports a single action */
        if (tools.length > 0)
        {
            var content = [];
            var width = 0;
            for (var i = 0; i < tools.length; i++)
            {
                var tool = this.make(tools[i]);

                tool.el = Ext.DomHelper.append(this.containerEl, this.toolTemplate.apply(tool), true);

                this.tools[tool.name] = tool;
            }            

            this.move(this.calculateNoVisY(), false); 
            this.el.show();                       
            this.move(this.calculateY());
        }
    }    
});
﻿/// <reference path="../ext/ext-core-debug.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.Utility = (function() {
    var nameToPathCache = {};
    var nameToPath = function(name) {
        if (typeof name !== 'string') return [];
        if (nameToPathCache[name]) return nameToPathCache[name];
        var parts = name.split('.');
        var path = [];
        for (var i = 0; i < parts.length; i++)
        {
            var match = parts[i].match(/([a-zA-Z0-9_]+)\[([^\]]+)\]/);
            if (match)
            {
                path.push(match[1]);
                if (/^\d+$/.test(match[2]))
                    path.push(parseInt(match[2]));
                else
                    path.push(match[2]);                    
            }
            else
            {
                path.push(parts[i]);
            }                    
        } 
        return (nameToPathCache[name] = path.reverse());
    };

    return {
        getValue: function(o, name) {
            var path = nameToPath(name).slice(0);
            var current = o;
            while (current && path.length > 0)
            {
                var key = path.pop();
                if (current[key]) current = current[key]; else return null;
            }                                
            return current;
        },
        setValue: function(o, name, val) {
            var current = o;
            var path = nameToPath(name).slice(0);         
            while ((typeof current !== "undefined") && path.length > 1)
            {
                var key = path.pop();                
                if (path.length > 0) 
                {
                    var next = path[path.length - 1];                                         
                    current = current[key] = (typeof current[key] !== "undefined") ? current[key] : (typeof next === "number") ? [] : {};
                }
            }  
            if (typeof path[0] !== "undefined")
                current[path[0]] = val;            
            return o;      
        }
    };
})();