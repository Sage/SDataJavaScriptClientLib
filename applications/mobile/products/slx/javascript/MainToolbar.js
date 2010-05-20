/// <reference path="../../ext/ext-core-debug.js"/>
/// <reference path="../../platform/Application.js"/>
/// <reference path="../../platform/Toolbar.js"/>
/// <reference path="../../sdata/SDataService.js"/>

Ext.namespace("Mobile.SalesLogix");

Mobile.SalesLogix.MainToolbar = Ext.extend(Sage.Platform.Mobile.Toolbar, {
    barTemplate: new Simplate([
        '<div class="{%= cls %}">',
        '<h1 id="pageTitle">{%= title %}</h1>',
        '<a id="backButton" class="button" href="#"></a>',              
        '</div>'
    ]),
    toolTemplate: new Simplate([
        '<a target="_tool" class="{%= cls %}" style="display: {%= $["hidden"] ? "none" : "block" %}"><span>{%= title %}</span></a>',
    ]),
    constructor: function(o) {
        Mobile.SalesLogix.MainToolbar.superclass.constructor.apply(this, arguments);        
    }, 
    init: function() {
        Mobile.SalesLogix.MainToolbar.superclass.init.call(this);        

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
    setTitle: function(title) {
        Ext.get('pageTitle').update(title);
    },
    displaySearch: function(el) {
        var id = el.dom.hash.substring(1);
        if (id)
            App.getView(id).show(this.searchText);
    },
    displayEdit: function() {
        App.fireEvent('edit');
    },
    displaySave: function() {
        App.fireEvent('save');
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
