/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../Simplate.js"/>
/// <reference path="../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../sdata/SDataService.js"/>
/// <reference path="View.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.ListDetail = Ext.extend(Sage.Platform.Mobile.ListDetail, {   
    viewTemplate: new Simplate([            
        '<div id="{%= id %}" title="{%= title %}" class="panel">',    
        '<div id="{%= id %}_0"></div>',
        '<div id="{%= id %}_1"></div>',
        '<div id="{%= id %}_2"></div>',                 
        '</div>'
    ]),   
    constructor: function(o) {
        Sage.Platform.Mobile.ListDetail.superclass.constructor.call(this);        
        
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

        this.frames = [];
        this.frameContext = {
            current: 0,
            next: 1,
            prev: 2
        };
    },
    render: function() {
        Sage.Platform.Mobile.ListDetail.superclass.render.call(this);

        this.frames[0] = Ext.get(this.id + '_0');
        this.frames[1] = Ext.get(this.id + '_1');
        this.frames[2] = Ext.get(this.id + '_2');

        this.clear();
    },
    init: function() {  
        Sage.Platform.Mobile.ListDetail.superclass.init.call(this);

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
        
        
        /*
        App.on('refresh', function(o) {
            if (this.context && o.key === this.context.key)
            {
                if (o.data && o.data['$descriptor']) 
                    this.setTitle(o.data['$descriptor']);

                this.clear();                
            }
        }, this);  
        */
    },        
    createRequest: function() {
        var request = new Sage.SData.Client.SDataSingleResourceRequest(this.getService())
            .setResourceSelector(String.format("'{0}'", this.context.key)); 

        if (this.resourceKind) 
            request.setResourceKind(this.resourceKind);

        return request;
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

        Sage.Platform.Mobile.ListDetail.superclass.show.call(this);                     
    },  
    isNewContext: function() {
        return (!this.context || (this.context && this.context.key != this.newContext.key));
    }, 
    beforeTransitionTo: function() {
        Sage.Platform.Mobile.ListDetail.superclass.beforeTransitionTo.call(this);

        this.canEdit = this.editor ? true : false;

        if (this.isNewContext())
        {
            this.clear();
        } 
    },
    transitionTo: function() {
        Sage.Platform.Mobile.ListDetail.superclass.transitionTo.call(this);

        // if the current context has changed, re-render the view
        if (this.isNewContext()) 
        {
            this.context = this.newContext;
                    
            this.requestData();  
        }   
    },
    clear: function(frame) {
        if (typeof frame === 'number' && this.frames[frame])
        {         
            this.frames[frame].update(this.contentTemplate.apply(this));
        }
        else
        {
            var content =  this.contentTemplate.apply(this);
            for (var i = 0; i < this.frames.length; i++)
                this.frames[frame].update(content);

            this.context = false;
        }                      
    }      
});