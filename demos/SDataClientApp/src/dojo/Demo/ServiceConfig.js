dojo.provide('Demo.ServiceConfig');
dojo.require('Demo.View');
dojo.require('dijit.layout.ContentPane');
dojo.require('dojox.layout.TableContainer');
dojo.require('dijit.form.TextBox');
dojo.require('dijit.form.CheckBox');
dojo.require('dijit.form.ComboBox');
dojo.require('dijit.form.NumberSpinner');
dojo.require('dijit.form.Button');
dojo.require('dijit.form.Form');
(function(){
    var T = new Simplate([
        '<div dojoType="dijit.layout.BorderContainer" style="height: 100%; width: 100%" dojoAttachPoint="container">',
            '<div dojoType="dijit.layout.ContentPane" region="center" splitter="true">',
                '<div dojoType="dijit.form.Form" dojoAttachPoint="form">',
                '<fieldset>',
                '<legend>Authentication</legend>',
                '<div dojoType="dojox.layout.TableContainer" cols="2" customClass="justLabels">',
                    '<div dojoType="dijit.form.TextBox" title="User Name:" value="" name="userName"></div>',
                    '<div dojoType="dijit.form.TextBox" title="Password:" value="" name="password"></div>',
                '</div>',
                '</fieldset>',
                '<fieldset>',
                '<legend>URL Settings</legend>',
                '<div dojoType="dojox.layout.TableContainer" cols="2" customClass="justLabels">',
                    '<div dojoType="dijit.form.ComboBox" title="Protocol:" value="" name="protocol"></div>',
                    '<div dojoType="dijit.form.TextBox" title="Server:" value="" name="serverName"></div>',
                    '<div dojoType="dijit.form.TextBox" title="Virtual Director:" value="sage" name="virtualDirector" readonly></div>',
                    '<div dojoType="dijit.form.TextBox" title="Application:" value="" name="applicationName"></div>',
                    '<div dojoType="dijit.form.TextBox" title="Contract:" value="" name="contractName"></div>',
                    '<div dojoType="dijit.form.TextBox" title="Data Set:" value="" name="dataSet"></div>',
                '</div>',
                '</fieldset>',
                '<button dojoType="dijit.form.Button" type="button" dojoAttachEvent="onClick:save">Save</button>',
                '</div>',
            '</div>',
        '</div>'
        ]);

    dojo.declare('Demo.ServiceConfig', [Demo.View], {
        template: T,
        save: function(evt) {
            console.log(this.form.getValues());
        }
    });
})();
