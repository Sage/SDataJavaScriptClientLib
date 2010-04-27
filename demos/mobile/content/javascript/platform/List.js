/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="Application.js"/>
/// <reference path="View.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.List = Ext.extend(Sage.Platform.Mobile.View, {
    viewTemplate: new Simplate([            
        '<ul id="{%= id %}" title="{%= title %}">',        
        '<li class="loading"><div class="loading-indicator">loading...</div></li>',
        '<li class="more"><a href="#" target="_none" class="whiteButton"><span>More</span></a></li>',        
        '</ul>'
    ]),
    itemTemplate: new Simplate([
        '<li>',
        '<a href="#" target="_none" m:key="{%= $key %}" m:url="{%= $url %}" m:kind="">',
        '<h3>{%= $descriptor %}</h3>',
        '</a>',
        '</li>'
    ]),    
    constructor: function(o) {
        Sage.Platform.Mobile.List.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'generic_list',
            title: 'List',
            pageSize: 20,
            requestedFirstPage: false
        });
    },    
    init: function() {     
        Sage.Platform.Mobile.List.superclass.init.call(this); 

        this.el
            .on('click', function(evt, el, o) {
                this.navigateToDetail(Ext.fly(el).up('a'));
            }, this, { preventDefault: true, stopPropagation: true });

        this.moreEl = this.el.select(".more").item(0);
        this.moreEl
            .hide()
            .select(".whiteButton")            
                .on('click', function(evt, el, o) {    
                    this.more();          
                }, this, { preventDefault: true, stopPropagation: true });
    },
    getService: function() {
        /// <returns type="Sage.SData.Client.SDataService" />
        return App.getService();
    },    
    createRequest:function() {
        /// <returns type="Sage.SData.Client.SDataResourceCollectionRequest" />
    },
    navigateToDetail: function(el) {
        if (el) 
        {
            var id = el.dom.hash.substring(1);
            var url = el.getAttribute("url", "m");
            var key = el.getAttribute("key", "m");            

            App.getView(id).show({
                url: url,
                key: key
            });
        }
    },
    processFeed: function(feed) {
        var isFirstFetch = typeof this.feed === 'undefined';
        if (isFirstFetch) 
            this.el
                .select('.loading')
                .remove();
                       
        this.feed = feed;
                
        var o = [];
        for (var i = 0; i < feed.$resources.length; i++)                
            o.push(this.itemTemplate.apply(feed.$resources[i]));
                    
        Ext.DomHelper.insertBefore(this.moreEl, o.join(''));

        this.moreEl            
            .removeClass('more-loading')
            .show();
    },
    requestFailure: function(response, o) {
        
    },
    requestData: function() {
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
        this.moreEl.addClass('more-loading');
        this.requestData();
    },
    transitionTo: function() {
         Sage.Platform.Mobile.List.superclass.transitionTo.call(this);

        if (this.requestedFirstPage == false) 
        {
            this.requestedFirstPage = true;
            this.requestData();
        }
    }
});