/*!
 * 
 */
﻿/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../iui/iui-sage.js"/>
/// <reference path="Format.js"/>
/// <reference path="Utility.js"/>

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
            'edit',
            'save',
            'refresh'
        );
    },
    setup: function() {
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
    getActiveView: function() {
        var el = iui.getCurrentPage() || iui.getCurrentDialog();
        if (el)
            return this.getView(el);

        return null;
    },
    getPreviousView: function() {
        var el = iui.getPreviousPage();
        if (el)
            return this.getView(el);

        return null;
    },
    getView: function(key) {
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
        return this.service;
    },
    setTitle: function(title) {
        if (this.tbar && this.tbar.setTitle)
            this.tbar.setTitle(title);
    },
    allowSearch: function(allow, has) {
        if (this.tbar && this.tbar.allowSearch)
            this.tbar.allowSearch(allow, has);
    },
    allowEdit: function(allow) {
        if (this.tbar && this.tbar.allowEdit)
            this.tbar.allowEdit(allow);
    },
    allowSave: function(allow) {
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
        Sage.Platform.Mobile.View.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'view',
            title: '',
            canSearch: false
        });        

        this.loaded = false;
    },
    render: function() {
        this.el = Ext.DomHelper.append(
            Ext.getBody(), 
            this.viewTemplate.apply(this), 
            true
        );
    },
    init: function() {
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
    setTitle: function(title) {
        this.el.dom.setAttribute('title', title);
    },
    load: function() {
    },
    show: function() {
        iui.showPage(this.el.dom);
    },
    beforeTransitionTo: function() {
    },
    beforeTransitionAway: function() {        
    },
    transitionTo: function() {                
    },
    transitionAway: function() {                    
    },
    getService: function() {
        /// <returns type="Sage.SData.Client.SDataService" />
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
        return false;
    },        
    createRequest:function() {
        /// <returns type="Sage.SData.Client.SDataResourceCollectionRequest" />
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
    expandExpression: function(expression) {
        if (typeof expression === 'function') 
            return expression.call(this);
        else
            return expression;
    },
    hasContext: function() {
        return (this.context || this.newContext);
    },         
    isNewContext: function() {   
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
        '<div class="row"><div class="loading-indicator">loading...</div></div>',
        '</fieldset>',
    ]),
    sectionBeginTemplate: new Simplate([
        '<h2>{%= $["title"] || "Details" %}</h2>',
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
    constructor: function(o) {
        Sage.Platform.Mobile.Detail.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'generic_detail',
            title: 'Detail',
            expose: false,
            canEdit: false,
            editor: false        
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
        App.on('edit', function() {
            if (this.el.getAttribute('selected') == 'true')
                this.navigateToEdit();
        }, this);  
        
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
                    this.processLayout(this.layout, {}, this.entry);
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
        '<div id="{%= id %}" title="{%= title %}" class="panel">',  
        '<fieldset class="loading">',
        '<div class="row"><div class="loading-indicator">loading...</div></div>',
        '</fieldset>',
        '<div class="body" style="display: none;">',
        '</div>',           
        '</div>'
    ]),       
    sectionBeginTemplate: new Simplate([
        '<h2>{%= $["title"] || "Details" %}</h2>',
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
    constructor: function(o) {
        Sage.Platform.Mobile.Edit.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'generic_edit',
            title: 'Edit',
            expose: false,
            canSave: true,
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

        this.processLayout(this.layout, {});

        for (var name in this.fields) this.fields[name].bind(this.el);

        this.loadEl.hide();
        this.bodyEl.show();

        // todo: find a better way to handle these notifications
        if (this.canSave)
            App.on('save', function() {
                if (this.el.getAttribute('selected') == 'true')
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
        var values = this.getValues();        
        if (values) 
        {           
            var entry = this.createEntryForUpdate(values);

            var request = this.createRequest();            
            if (request)
                request.update(entry, {
                    success: function(modified) {                          
                        App.fireEvent('refresh', {
                            resourceKind: this.resourceKind,
                            key: modified['$key'],
                            data: {
                                '$descriptor': modified['$descriptor']
                            }
                        });
                            
                        /* ensures that the browsers back button and the iUI history are in sync */                        
                        history.go(-1);
                    },
                    failure: function(response, o) {
                        
                    },
                    scope: this
                });
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
    init: function() {
        this.render();            
    },
    allowSearch: function(allow, has) {
    },
    allowEdit: function(allow) {
    },
    allowSave: function(allow) {
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