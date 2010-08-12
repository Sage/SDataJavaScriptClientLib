dojo.provide('Demo.ServiceConfig');
dojo.require('Demo.View');
dojo.require('dijit.layout.ContentPane');
(function(){
    var T = new Simplate([
            '<div dojoType="dijit.layout.ContentPane">i\'m dynamic</div>'
        ]);

    dojo.declare('Demo.ServiceConfig', [Demo.View], {
        templateString: T.apply()
    });
})();