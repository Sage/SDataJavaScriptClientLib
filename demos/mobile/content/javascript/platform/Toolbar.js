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
    init: function() {
        this.render();            
    }
});

