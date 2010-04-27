/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../Simplate.js"/>
/// <reference path="../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../sdata/SDataService.js"/>
/// <reference path="View.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.Detail = Ext.extend(Sage.Platform.Mobile.View, {
    dotValueProvider: (function() { 
        var cache = {};
        var nameToPath = function(name) {
            if (typeof name !== 'string') return [];
            if (cache[name]) return cache[name];
            var parts = name.split(".");
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
            return (cache[name] = path.reverse());
        };

        return function(o, name) {
            var path = nameToPath(name).slice(0);
            var current = o;
            while (current && path.length > 0)
            {
                var key = path.pop();
                if (current[key]) current = current[key]; else return null;
            }                                
            return current;
        }
    })(),
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
        '<h2>{%= values["title"] || "Details" %}</h2>',
        '<fieldset>'
    ]),
    sectionEndTemplate: new Simplate([
        '</fieldset>'
    ]),
    propertyTemplate: new Simplate([
        '<div class="row">',
        '<label>{%= label %}</label>',       
        '<span>{%= value %}</span>',
        '</div>'
    ]),    
    constructor: function(o) {
        Sage.Platform.Mobile.Detail.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'generic_detail',
            title: 'Detail',
            expose: false          
        });
    },
    render: function() {
        Sage.Platform.Mobile.Detail.superclass.render.call(this);

        this.clear();
    },
    init: function() {  
        Sage.Platform.Mobile.Detail.superclass.init.call(this);
    },
    getService: function() {
        /// <returns type="Sage.SData.Client.SDataService" />
        return App.getService();
    },    
    createRequest: function() {
       
    },    
    processLayout: function(layout, title, entry)
    {
        var sections = [];
        var content = [];
        
        content.push(this.sectionBeginTemplate.apply({
            title: title,
            entry: entry
        }));        

        for (var i = 0; i < layout.length; i++)
        {
            var current = layout[i];

            if (current['as'])
            {
                sections.push(current);
                continue;
            }         
            
            var provider = current['provider'] || this.dotValueProvider;
            var value = provider(entry, current['name']);
            var formatted = current['tpl']
                ? current['tpl'].apply(value)
                : current['renderer']
                    ? current['renderer'](value)
                    : value;

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

        content.push(this.sectionEndTemplate.apply({              
            entry: entry
        }));

        Ext.DomHelper.append(this.el, content.join(''));

        for (var i = 0; i < sections.length; i++)
        {
            var current = sections[i];  
            
            this.processEntry(current['as'], current['title'], entry);  
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

                if (entry)                  
                    this.processLayout(this.layout, false, entry);
            },
            failure: function(response, o) {
                this.requestFailure(response, o);
            },
            scope: this
        });       
    },
    show: function(o) {
        this.context = o; 

        Sage.Platform.Mobile.Detail.superclass.show.call(this);                     
    },  
    isNewContext: function() {
        return (!this.current || (this.current && this.current.key != this.context.key));
    }, 
    beforeTransitionTo: function() {
        Sage.Platform.Mobile.Detail.superclass.beforeTransitionTo.call(this);

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
    }      
});