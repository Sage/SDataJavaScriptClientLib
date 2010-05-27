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
    androidFixTemplate: new Simplate([
        '<a target="_none" href="#" class="android-webkit-fix"></a>'
    ]),
    constructor: function(o) {
        Sage.Platform.Mobile.MainToolbar.superclass.constructor.apply(this, arguments); 
        
        Ext.apply(this, o, {
            cls: 'toolbar-float',
            containerCls: 'toolbar-float-container'
        });
        
        this.tools = {};   
    }, 
    render: function() {
        Sage.Platform.Mobile.FloatToolbar.superclass.render.call(this);
        
        this.containerEl = this.el.child('.' + this.containerCls);
    },
    init: function() {
        Sage.Platform.Mobile.FloatToolbar.superclass.init.call(this);        

        if (/android/i.test(navigator.userAgent))
        {   
            /*
             * there is an issue with click "bleed through" on absolutely positioned elements on 
             * android devices which is why we need to go though the trouble of preventing the actual 
             * click event.
             * see: http://code.google.com/p/android/issues/detail?id=6721             
             */         
            var prevent = false;

            this.el
                .on('touchstart', function(evt, el, o) {                    
                    var source = Ext.get(el);
                    var target;

                    prevent = true;
         
                    if (source.is('a[target="_tool"]') || (target = source.up('a[target="_tool"]')))
                    {
                        var name = (target || source).dom.hash.substring(1);

                        if (this.tools.hasOwnProperty(name))
                            this.execute(this.tools[name]);
                    }                
                    else if (source.is('.' + this.cls) || (target = source.up('.' + this.cls)))
                    {
                        this.toggle();
                    }

                }, this);

            var handleClick = function(evt) {
                if (prevent)
                {          	        
                    if (evt.preventBubble) evt.preventBubble();
                    if (evt.preventDefault) evt.preventDefault();
	                if (evt.stopPropagation) evt.stopPropagation();                        
                    if (evt.stopImmediatePropagation) evt.stopImmediatePropagation();

                    prevent = false;

                    return false;
                } 
            }; 
        
            Ext.getBody().dom.addEventListener('click', handleClick, true); /* capture phase */
        }
        else
        {
            this.el
                .on('click', function(evt, el, o) {                    
                    var source = Ext.get(el);
                    var target;
                               
                    if (source.is('a[target="_tool"]') || (target = source.up('a[target="_tool"]')))
                    {
                        var name = (target || source).dom.hash.substring(1);

                        if (this.tools.hasOwnProperty(name))
                            this.execute(this.tools[name]);
                    }                
                    else if (source.is('.' + this.cls) || (target = source.up('.' + this.cls)))
                    {
                        this.toggle();
                    }
                }, this, { preventDefault: true, stopPropagation: true });
        }       
        
        Ext.fly(window)
            .on("scroll", this.onBodyScroll, this, {buffer: 125})
            .on("resize", this.onBodyScroll, this, {buffer: 125});
    },
    open: function() {
        this.el.dom.setAttribute('open', 'open');
    },
    close: function() {
        this.el.dom.removeAttribute('open');
    },
    toggle: function() {
        if (this.el.getAttribute('open') === 'open')
            this.close();
        else
            this.open();
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
                    '-webkit-transition-property': 'none',
                    '-moz-transition-property': 'none',
                    'transition-property': 'none'
                });   
            }
            else
            {
                this.el.setStyle({
                    '-webkit-transition-property': 'inherit',
                    '-moz-transition-property': 'inherit',
                    'transition-property': 'inherit'
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
    display: function(tools) {
        /* if there are no tools to display, hide this bar */
        /* this toolbar only supports a single action */
        if (tools.length > 0)
        {
            var content = [];
            var width = 0;
            for (var i = 0; i < tools.length; i++)
            {
                var tool = this.make(tools[i]);

                tool.el = Ext.DomHelper.append(this.containerEl, this.toolTemplate.apply(tool), true);

                this.tools[tool.name] = tool;
            }            

            this.move(this.calculateNoVisY(), false); 
            this.el.show();                       
            this.move(this.calculateY());
        }
    }    
});
