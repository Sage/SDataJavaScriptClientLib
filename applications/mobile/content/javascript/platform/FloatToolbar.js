/// <reference path="../../../content/javascript/ext/ext-core-debug.js"/>
/// <reference path="../../../content/javascript/platform/Application.js"/>
/// <reference path="../../../content/javascript/platform/Toolbar.js"/>

Ext.namespace("Sage.Platform.Mobile");

Sage.Platform.Mobile.FloatToolbar = Ext.extend(Sage.Platform.Mobile.Toolbar, {
    barTemplate: new Simplate([
        '<div class="{%= cls %}" style="visibility: hidden">',
        '<div class="{%= containerCls %}">',
        '</div>',        
        '</div>'
    ]),
    toolTemplate: new Simplate([        
        '<a target="_tool" href="#{%= $["name"] %}" class="{%= $["cls"] %}" style="display: {%= $["hidden"] ? "none" : "block" %}">',
        '<img src="{%= $["icon"] %}" />',
        '<span>{%= $["title"] %}</span>',
        '</a>',
    ]),
    constructor: function(o) {
        Sage.Platform.Mobile.MainToolbar.superclass.constructor.apply(this, arguments); 
        
        Ext.apply(this, o, {
            expanded: false,
            cls: 'toolbar-float',
            containerCls: 'toolbar-float-container'
        });
        
        this.tools = {};   
    }, 
    render: function() {
        Sage.Platform.Mobile.FloatToolbar.superclass.render.call(this);
        
        this.containerEl = this.el.child('.' + this.containerCls);

        this.setup();
    },
    init: function() {
        Sage.Platform.Mobile.FloatToolbar.superclass.init.call(this);        

        this.el
            .on('click', function(evt, el, o) {
                var source = Ext.get(el);
                var target;

                if (source.is('a[target="_tool"]') || (target = source.up('a[target="_tool"]')))
                {
                    evt.stopEvent();

                    var name = (target || source).dom.hash.substring(1);

                    if (this.tools.hasOwnProperty(name))
                        this.execute(this.tools[name]);
                }
            }, this);
        
        Ext.fly(window)
            .on("scroll", this.onBodyScroll, this, {buffer: 250})
            .on("resize", this.onBodyScroll, this, {buffer: 250});
    },
    execute: function(tool) {
        if (tool && tool.fn)
            tool.fn.call(tool.scope || this);
    },   
    calculateY: function() {
        var wH = window.innerHeight;
        var sH = Ext.getBody().getScroll().top;
        var eH = this.el.getHeight();

        return (wH + sH) - eH - 8;
    },
    calculateNoVisY: function() {
        var wH = window.innerHeight;
        var sH = Ext.getBody().getScroll().top;

        return wH + sH + 8;
    },
    setup: function() {              
                
    },
    move: function(y, fx)
    {
        if (Ext.isGecko) 
        { 
            if (fx === false)
            {
                this.el.setStyle({
                    'top': String.format('{0}px', y)
                });
            }
            else
            {
                this.el.shift({
                    y: y,
                    easing: 'easeBothStrong',
                    duration: .5,
                    stopFx: true,
                    callback: function() {
                        this.el.setStyle({
                            'right': '0px',
                            'left': 'auto'
                        });
                    },
                    scope: this   
                });
            } 
        }
        else
        {
            if (fx === false)
            {
                this.el.setStyle({
                    '-webkit-transition': '-webkit-transform 0s linear',
                    '-moz-transition': '-webkit-transform 0s linear'
                });   
            }
            else
            {
                this.el.setStyle({
                    '-webkit-transition': '-webkit-transform .4s ease-in-out',
                    '-moz-transition': '-webkit-transform .4s ease-in-out'
                });
            }

            this.el.setStyle({
                '-webkit-transform': String.format('translateY({0}px)', y)
            });
        }
    },    
    onBodyScroll: function(evt, el, o)
    {
        this.move(this.calculateY());
    },    
    getToolEl: function(name) {
        if (this.tools[name] && this.tools[name].el) 
            return this.tools[name].el;
        return null;
    },
    clear: function() {
        this.el.hide();
        this.containerEl.update('');        
    },
    show: function() {
        this.el.show();
    },
    hide: function() {
        this.el.hide();
    },
    display: function(tools) {
        /* if there are no tools to display, hide this bar */
        /* this toolbar only supports a single action */
        if (tools.length > 0)
        {
            var content = [];
            var width = 0;
            for (var i = 0; i < tools.length; i++)
            {
                var tool = Ext.apply({}, tools[i]);

                for (var p in tool)
                    if (p !== 'fn' && typeof tool[p] === 'function')
                        tool[p] = tool[p].call(tool.scope || this);

                tool.el = Ext.DomHelper.append(this.containerEl, this.toolTemplate.apply(tool), true);

                this.tools[tool.name] = tool;
            }            

            this.move(this.calculateNoVisY(), false);
            this.el.show();
            this.move(this.calculateY());
        }
    }    
});
