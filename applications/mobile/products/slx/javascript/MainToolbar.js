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
        '<a class="button" href="#" target="_save" style="display: none;">Save</a>',
        '</div>'
    ]),
    constructor: function(o) {
        Mobile.SalesLogix.MainToolbar.superclass.constructor.apply(this, arguments);        
    }, 
    init: function() {
        Mobile.SalesLogix.MainToolbar.superclass.init.call(this);        

        this.el.select('a[target="_search"]')
            .on('click', function(evt, el, o) {
                this.displaySearch(Ext.get(el));
            }, this, { preventDefault: true, stopPropagation: true });

        this.el.select('a[target="_edit"]')
            .on('click', function(evt, el, o) {
                this.displayEdit(Ext.get(el));
            }, this, { preventDefault: true, stopPropagation: true });

        this.el.select('a[target="_save"]')
            .on('click', function(evt, el, o) {
                this.displaySave(Ext.get(el));
            }, this, { preventDefault: true, stopPropagation: true });
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
    allowSearch: function(allow, has) {
        this.searchText = false;

        if (allow)
        {
            var button = this.el
                .down('a[target="_search"]')
                .removeClass("greenButton");

            if (has) 
            {
                button.addClass("greenButton");

                if (typeof has === 'string') 
                    this.searchText = has;
            }               
                
            button.show();  
        }
        else        
            this.el.down('a[target="_search"]').hide();                                     
    },
    allowEdit: function(allow) {
        if (allow)
            this.el.down('a[target="_edit"]').show();
        else
            this.el.down('a[target="_edit"]').hide(); 
    },
    allowSave: function(allow) {
        if (allow)
            this.el.down('a[target="_save"]').show();
        else
            this.el.down('a[target="_save"]').hide(); 
    }  
});
