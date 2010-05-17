/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="Application.js"/>
/// <reference path="View.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.List = Ext.extend(Sage.Platform.Mobile.View, {
    viewTemplate: new Simplate([            
        '<ul id="{%= id %}" title="{%= title %}">',                       
        '</ul>'
    ]),
    contentTemplate: new Simplate([
        '<li class="loading"><div class="loading-indicator">loading...</div></li>',
        '<li class="more" style="display: none;"><a href="#" target="_none" class="whiteButton moreButton"><span>More</span></a></li>'
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
            title: 'List',
            pageSize: 20,
            requestedFirstPage: false,
            canSearch: true,
            noDataText: 'no records'
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

        // todo: find a better way to handle these notifications
        if (this.canSearch) 
            App.on('search', function(query) {
                if (this.el.getAttribute('selected') == 'true')
                    this.search(query);
            }, this);

        App.on('refresh', function(o) {
            if (this.resourceKind && o.resourceKind === this.resourceKind)
                this.clear();
        }, this); 
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

        // reset search button state
        // todo: is this the best way to do this?
        App.allowSearch(this.canSearch, this.queryText);  
        
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
});