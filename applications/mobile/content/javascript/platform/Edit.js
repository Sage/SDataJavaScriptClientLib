/// <reference path="../ext/ext-core-debug.js"/>
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
});