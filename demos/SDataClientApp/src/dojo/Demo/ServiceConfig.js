dojo.provide('Demo.ServiceConfig');
dojo.require('Demo.View');
dojo.require('dijit.layout.ContentPane');
(function(){
    var T = new Simplate([
            '<div style="height: 100%; width: 100%">',
                '<div dojoType="dijit.layout.BorderContainer" style="height: 100%; width: 100%" dojoAttachPoint="outerBC">',
                    '<div dojoType="dijit.layout.ContentPane" region="top" splitter="true" style="height: 100px">top</div>',
                    '<div dojoType="dijit.layout.ContentPane" region="center" splitter="true">center</div>',
                    '<div dojoType="dijit.layout.ContentPane" region="bottom" splitter="true">bottom</div>',
                '</div>',
            '</div>'
        ]);

    dojo.declare('Demo.ServiceConfig', [Demo.View], {
        templateString: T.apply(),
        postCreate: function()
        {
            this.inherited(arguments);
            this.outerBC.startup();
            this.outerBC.layout();
        }
    });
})();