/// <reference path="../ext/ext-core-debug.js"/>
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
        /// <field name="expose" type="Boolean">True if the view is exposed to the home screen, False otherwise.</field>
        /// <field name="loaded" type="Boolean">True if the view has been loaded, False otherwise.</field>
        /// <field name="canSearch" type="Boolean">True if the view supports search, False otherwise.</field>
        /// <field name="canEdit" type="Boolean">True if the view supports editing, False otherwise.</field>
        /// <field name="canSave" type="Boolean">True if the view supports saving, False otherwise.</field>
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
        iui.showPage(this.el.dom);
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
});