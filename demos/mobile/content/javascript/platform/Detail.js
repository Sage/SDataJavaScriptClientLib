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
    entryBeginTemplate: new Simplate([
        '<h2>{%= title || "Details" %}</h2>',
        '<fieldset>'
    ]),
    entryEndTemplate: new Simplate([
        '</fieldset>'
    ]),
    propertyTemplate: new Simplate([
        '<div class="row">',
        '<label>{%= label %}</label>',
        '<span>{%= entry[name] %}</span>',
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
    processEntry: function(layout, title, entry) {        
        var children = [];

        if (entry) 
        {
            var content = [];

            content.push(this.entryBeginTemplate.apply({
                title: title,
                entry: entry
            }));

            for (var i = 0; i < layout.length; i++)
            {
                if (layout[i]['layout'])
                {
                    children.push(layout[i]);
                }
                else
                {
                    content.push(this.propertyTemplate.apply({
                        label: layout[i]['label'],
                        name: layout[i]['name'],
                        format: layout[i]['format'],
                        entry: entry
                    }));
                }
            }

            content.push(this.entryEndTemplate.apply({              
                entry: entry
            }));

            Ext.DomHelper.append(this.el, content.join(''));
        }

        for (var i = 0; i < children.length; i++)
        {
            this.processEntry(
                children[i]['layout'], 
                children[i]['label'],
                entry[children[i]['name']]
            );
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
                    this.processEntry(this.layout, false, entry);
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
    focus: function() {        
        Sage.Platform.Mobile.Detail.superclass.focus.call(this);

        // if the current context has changed, re-render the view
        if (!this.current || (this.current && this.current.key != this.context.key)) 
        {
            this.current = this.context;

            this.clear();        
            
            // allow iUI transition to begin
            // todo: find a way to detect when the iUI transition has ended before calling load      
            this.requestData.defer(75, this);    
        }        
    },
    clear: function() {
        this.el.update(this.contentTemplate.apply(this));
    }      
});