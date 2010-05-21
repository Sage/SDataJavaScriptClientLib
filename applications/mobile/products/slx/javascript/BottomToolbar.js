/// <reference path="../../../content/javascript/ext/ext-core-debug.js"/>
/// <reference path="../../../content/javascript/platform/Application.js"/>
/// <reference path="../../../content/javascript/platform/Toolbar.js"/>

Ext.namespace("Mobile.SalesLogix");

Mobile.SalesLogix.BottomToolbar = Ext.extend(Sage.Platform.Mobile.Toolbar, {
    barTemplate: new Simplate([
        '<div class="{%= cls %}-fix">',
        '<div class="{%= cls %}">',
        '<div class="{%= cls %}-wrap">',
        '</div>',               
        '</div>',
        '</div>'
    ]),
    toolTemplate: new Simplate([        
        '<a target="_tool" m:action="{%= name %}" class="{%= cls %}" style="display: {%= $["hidden"] ? "none" : "block" %}">',
        '<span>{%= title %}</span>',
        '</a>',
    ]),
    constructor: function(o) {
        Mobile.SalesLogix.MainToolbar.superclass.constructor.apply(this, arguments); 
        
        this.cls = 'toolbar-bottom';       
    }, 
    render: function() {
        Mobile.SalesLogix.BottomToolbar.superclass.render.call(this);   
        
        Ext.getBody().addClass('has-toolbar-bottom');
    },
    init: function() {
        Mobile.SalesLogix.BottomToolbar.superclass.init.call(this);        

        this.el
            .on('click', function(evt, el, o) {
                var source = Ext.get(el);
                var target;

                if (source.is('a[target="_tool"]') || (target = source.up('a[target="_tool"]')))
                {
                    evt.stopEvent();

                    if (this.tool && this.tool.fn)
                        this.tool.fn.call(this.tool.scope || this);
                }
            }, this);
    },   
    clear: function() {
        if (this.tool)
        {
            this.el.child('a[target="_tool"]').remove(); 
            this.tool = false;
        }
    },
    display: function(tools) {
        /* this toolbar only supports a single action */
        if (tools.length > 0)
        {
            this.tool = Ext.apply({}, tools[0]);

            for (var p in this.tool)
                if (p !== 'fn' && typeof this.tool[p] === 'function')
                    this.tool[p] = this.tool[p].call(this.tool.scope || this);
                                
            this.tool.el = Ext.DomHelper.append(this.el, this.toolTemplate.apply(this.tool), true);
        }
    }    
});
