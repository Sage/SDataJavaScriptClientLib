/// <reference path="../ext/ext-core-debug.js"/>
/// <reference path="../Simplate.js"/>
/// <reference path="../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../sdata/SDataService.js"/>
/// <reference path="View.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.ListDetail = Ext.extend(Sage.Platform.Mobile.ListDetail, {   
    viewTemplate: new Simplate([            
        '<div id="{%= id %}_2" title="{%= title %}" class="panel"></div>',
        '<div id="{%= id %}_1" title="{%= title %}" class="panel"></div>',
        '<div id="{%= id %}_0" title="{%= title %}" class="panel"></div>' 
        /* ext will return the last element when appended to the dom; this.el will refer to '_0' */
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
        
        /* 
        state: {            
            position: 0,
            next: {
                data: {},
                request: null,
                frame: 2
            },
            prev: {
                data: {},                
                request: null,
                frame: 1
            },
            current: {
                data: {},
                request: null,
                frame: 0
            }
        }
        */            
    },
    render: function() {
        Sage.Platform.Mobile.ListDetail.superclass.render.call(this);

        this.frames = {};
        this.frames[0] = Ext.get(this.id + '_0');
        this.frames[1] = Ext.get(this.id + '_1');
        this.frames[2] = Ext.get(this.id + '_2');

        this.clear();
    },
    init: function() {  
        Sage.Platform.Mobile.ListDetail.superclass.init.call(this);

        this.el
            .on('click', function(evt, el, o) {
                    evt.stopEvent();

                    var el = Ext.fly(el);
                    var view = el.dom.hash.substring(1);
                    var key = el.getAttribute('key', 'm');                       
                    var where = el.getAttribute('where', 'm');                                    

                    this.navigateToRelated(view, key, where);   
            }, this, {delegate: 'a[target="_related"]'})        
        
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
        /// <summary>
        ///     Creates SDataResourceCollectionRequest instance and sets a number of known properties.        
        /// </summary>
        /// <returns type="Sage.SData.Client.SDataResourceCollectionRequest">An SDataResourceCollectionRequest instance.<returns>
        var request = new Sage.SData.Client.SDataResourceCollectionRequest(this.getService());

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
    requestFailure: function(response, o) {
       
    },
    requestData: function(slot) { /* i.e. next, prev, current */
        var request = this.createRequest();      

        if (this.state[slot].request)
        {
            
        }
        
        if (slot === true)
        {
            request
                .setCount(3)
                .setStartIndex(this.context.position - 1);
        }
        else
        {
            request
                .setCount(1)
                .setStartIndex(
                    slot == 'next'
                        ? this.state.position + 1
                        : slot == 'prev'
                            ? this.state.position - 1
                            : this.state.position
                );            
        }
          
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
            if (o.position) 
                this.newContext = o;

            if (o.descriptor)
                this.setTitle(o.descriptor);
        }

        Sage.Platform.Mobile.ListDetail.superclass.show.call(this);                     
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

        if (this.expandExpression(this.context.where) != this.expandExpression(this.newContext.where)) return true;
        if (this.expandExpression(this.context.position) != this.expandExpression(this.newContext.position)) return true;       
         
        return false;
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
        if (typeof frame !== 'undefined' && this.frames[frame])
        {         
            this.frames[frame].update(this.contentTemplate.apply(this));
        }
        else
        {
            var content =  this.contentTemplate.apply(this);
            for (var frame in this.frames)
                this.frames[frame].update(content);

            this.context = false;
            this.state = {
                position: 0,
                next: {
                    data: false,
                    request: false,
                    frame: 2
                },
                prev: {
                    data: false,                
                    request: false,
                    frame: 1
                },
                current: {
                    data: false,
                    request: false,
                    frame: 0
                }
            };
        }                      
    }      
});