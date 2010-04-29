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
        '<a class="button" href="#search_dialog" target="_search" style="display: none;">Search</a>',
        '<a class="button" href="#" target="_edit" style="display: none;">Edit</a>',
        '</div>'
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

                if (source.is('a[target="_search"]') || (target = source.up('a[target="_search"]')))
                    this.displaySearch(target || source);
                else if (source.is('a[target="_edit"]') || (target = source.up('a[target="_edit"]')))
                    this.displayEdit(target || source);

            }, this, { preventDefault: true, stopPropagation: true });
    },
    displaySearch: function(el) {
        var id = el.dom.hash.substring(1);
        if (id)
            App.getView(id).show();
    },
    displayEdit: function() {
    
    },
    allowSearch: function(val) {
        if (val)
            this.el.down('a[target="_search"]').show();
        else
            this.el.down('a[target="_search"]').hide();         
    },
    allowEdit: function(val) {
        if (val)
            this.el.down('a[target="_edit"]').show();
        else
            this.el.down('a[target="_edit"]').hide(); 
    }     
});
