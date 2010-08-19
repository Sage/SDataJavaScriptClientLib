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
        '<div style="height: 100%; width: 100%;">',
            '<div dojoType="dijit.layout.BorderContainer" style="height: 100%; width: 100%" dojoAttachPoint="container" class="dijitBorderContainerNoBorder">',
                '<div dojoType="dijit.layout.ContentPane" region="center" splitter="true">',
                    '<form dojoType="dijit.form.Form" dojoAttachPoint="form">',
                        '<fieldset>',
                        '<legend>Authentication</legend>',
                        '<div dojoType="dojox.layout.TableContainer" cols="2" customClass="justLabels">',
                            '<div dojoType="dijit.form.TextBox" title="User Name:" value="" name="userName" intermediateChanges="true" dojoAttachPoint="userName"></div>',
                            '<div dojoType="dijit.form.TextBox" title="Password:" value="" name="password" intermediateChanges="true" dojoAttachPoint="password"></div>',
                        '</div>',
                        '</fieldset>',
                        '<fieldset>',
                        '<legend>URL Settings</legend>',
                        '<div dojoType="dojox.layout.TableContainer" cols="2" customClass="justLabels">',
                            '<div dojoType="dijit.form.ComboBox" title="Protocol:" value="http" name="protocol" intermediateChanges="true" dojoAttachPoint="protocol"></div>',
                            '<div dojoType="dijit.form.TextBox" title="Server:" value="" name="serverName" intermediateChanges="true" dojoAttachPoint="serverName"></div>',
                            '<div dojoType="dijit.form.TextBox" title="Virtual Directory:" value="sage" name="virtualDirectory" intermediateChanges="true" dojoAttachPoint="virtualDirector" readonly></div>',
                            '<div dojoType="dijit.form.TextBox" title="Application:" value="" name="applicationName" intermediateChanges="true" dojoAttachPoint="applicationName"></div>',
                            '<div dojoType="dijit.form.TextBox" title="Contract:" value="" name="contractName" intermediateChanges="true" dojoAttachPoint="contractName"></div>',
                            '<div dojoType="dijit.form.TextBox" title="Data Set:" value="" bind="true" name="dataSet" intermediateChanges="true" dojoAttachPoint="dataSet"></div>',
                        '</div>',
                        '</fieldset>',
                        '<fieldset>',
                        '<legend>URL</legend>',
                        '<div dojoType="dijit.form.TextBox" title="URL:" name="url" dojoAttachPoint="url" style="width: 100%;"></div>',
                        '</fieldset>',
                        '<button dojoType="dijit.form.Button" type="button" dojoAttachEvent="onClick:save">Save</button>',
                    '</form>',
                '</div>',
            '</div>',
        '</div>'
        ]);

    dojo.declare('Demo.ServiceConfig', [Demo.View], {
        template: T,
        bind: [
            'serverName',
            'virtualDirectory',
            'applicationName',
            'contractName',
            'dataSet',
            'protocol'
        ],
        constructor: function() {
            this.inherited(arguments);

            this.service = new Sage.SData.Client.SDataService({
                virtualDirectory: 'sage'
            });
        },
        save: function(evt) {
            console.log('values: %o', this.form.getValues());
        },
        change: function(field, value) {            
            switch (field.name)
            {
                case 'serverName':
                    this.service.setServerName(value);
                    break;
                case 'virtualDirectory':
                    this.service.setVirtualDirectory(value);
                    break;
                case 'applicationName':
                    this.service.setApplicationName(value);
                    break;
                case 'contractName':
                    this.service.setContractName(value);
                    break;
                case 'dataSet':
                    this.service.setDataSet(value);
                    break;
                case 'protocol':
                    this.service.setProtocol(value);
                    break;
            }

            this.url.attr('value', this.service.getUri().build());
        },
        postCreate: function()
        {
            this.inherited(arguments);

            this.url.attr('value', this.service.getUri().build());

            for (var i = 0; i < this.bind.length; i++)
                if (this[this.bind[i]] instanceof dijit.form._FormValueWidget)
                    dojo.connect(
                        this[this.bind[i]],
                        'onChange',
                        dojo.hitch(this, this.change, this[this.bind[i]])
                    );

            /*
            // auto bind
            for (var property in this)
                if (this[property] instanceof dijit.form._FormValueWidget)
                    dojo.connect(
                        this[property],
                        'onChange',
                        dojo.hitch(this, this.change, this[property])
                    );
            */
        }
    });
})();
