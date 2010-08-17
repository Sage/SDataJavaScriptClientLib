dojo.provide('Demo.ServiceConfig');
dojo.require('Demo.View');
dojo.require('dijit.layout.ContentPane');
dojo.require('dojox.layout.TableContainer');
dojo.require('dijit.form.TextBox');
dojo.require('dijit.form.CheckBox');
dojo.require('dijit.form.ComboBox');
dojo.require('dijit.form.NumberSpinner');
(function(){
    var T = new Simplate([
            '<div style="height: 100%; width: 100%">',
                '<div dojoType="dijit.layout.BorderContainer" style="height: 100%; width: 100%" dojoAttachPoint="container">',
                    '<div dojoType="dijit.layout.ContentPane" region="center" splitter="true">',
                        '<fieldset>',
                        '<legend>Authentication</legend>',
                        '<div dojoType="dojox.layout.TableContainer" cols="2" customClass="justLabels">',
                            '<div dojoType="dijit.form.TextBox" title="User Name:" value=""></div>',
                            '<div dojoType="dijit.form.TextBox" title="Password:" value=""></div>',
                        '</div>',
                        '</fieldset>',
                        '<fieldset>',
                        '<legend>URL Settings</legend>',
                        '<div dojoType="dojox.layout.TableContainer" cols="2" customClass="justLabels">',
                            '<div dojoType="dijit.form.ComboBox" title="Protocol:" value=""></div>',
                            '<div dojoType="dijit.form.TextBox" title="Server:" value=""></div>',
                            '<div dojoType="dijit.form.TextBox" title="Virtual Director:" value=""></div>',
                            '<div dojoType="dijit.form.TextBox" title="Application:" value=""></div>',
                            '<div dojoType="dijit.form.TextBox" title="Contract:" value=""></div>',
                            '<div dojoType="dijit.form.TextBox" title="Data Set:" value=""></div>',
                        '</div>',
                        '</fieldset>',
                    '</div>',
                '</div>',
            '</div>'
        ]);

    dojo.declare('Demo.ServiceConfig', [Demo.View], {
        templateString: T.apply(),
        postCreate: function()
        {
            this.inherited(arguments);
            this.container.startup();
            this.container.layout();
        }
    });
})();