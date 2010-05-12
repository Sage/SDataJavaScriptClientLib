/// <reference path="../ext/ext-core-debug.js"/>
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
            if (this.current && o.key === this.current.key)
            {
                if (o.descriptor) 
                    this.setTitle(o.descriptor);

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
            .setResourceSelector(String.format("'{0}'", this.current.key)); 

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
                this.context = o;

            if (o.descriptor)
                this.setTitle(o.descriptor);
        }

        Sage.Platform.Mobile.Detail.superclass.show.call(this);                     
    },  
    isNewContext: function() {
        return (!this.current || (this.current && this.current.key != this.context.key));
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
            this.current = this.context;
                    
            this.requestData();  
        }   
    },
    clear: function() {
        this.el.update(this.contentTemplate.apply(this));

        this.current = false;
    }      
});