/// <reference path="../ext/ext-core-debug.js"/>
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
    getToolEl: function(name) {
        return this.el;
    },
    init: function() {
        this.render();            
    },
    clear: function() {
    },
    show: function() {
        this.el.show();
    },
    hide: function() {
        this.el.hide();
    },
    make: function(tool) {
        var result = {};

        for (var prop in tool)
            if (prop !== 'fn' && typeof tool[prop] === 'function')
                result[prop] = tool[prop].call(tool.scope || this);
            else
                result[prop] = tool[prop];

        return result;
    },
    display: function(tools) {        
    }
});

