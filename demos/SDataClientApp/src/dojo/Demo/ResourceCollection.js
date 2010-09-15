dojo.provide('Demo.ResourceCollection');
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
                '<div dojoType="dijit.layout.ContentPane" region="top" style="height: 150px;">',
                    '<form dojoType="dijit.form.Form" dojoAttachPoint="form">',
                        '<fieldset>',
                        '<legend>Request</legend>',
                        '<div dojoType="dojox.layout.TableContainer" cols="2" customClass="justLabels">',
                            '<div dojoType="dijit.form.TextBox" title="Resource Kind:" colspan="2" name="resourceKind" intermediateChanges="true" dojoAttachPoint="resourceKind"></div>',
                            '<div dojoType="dijit.form.NumberSpinner" title="Start Index:" value="1" name="startIndex" intermediateChanges="true" dojoAttachPoint="startIndex"></div>',
                            '<div dojoType="dijit.form.NumberSpinner" title="Count:" value="10" name="count" intermediateChanges="true" dojoAttachPoint="count"></div>',
                        '</div>',
                        '</fieldset>',                        
                        '<fieldset>',
                        '<legend>URL</legend>',
                        '<div dojoType="dijit.form.TextBox" title="URL:" name="url" dojoAttachPoint="url" style="width: 100%;" readonly></div>',
                        '</fieldset>',
                        '<button dojoType="dijit.form.Button" type="button" dojoAttachEvent="onClick:read">Read</button>',
                        '<button dojoType="dijit.form.Button" type="button" dojoAttachEvent="onClick:first">&lt;&lt; First</button>',
                        '<button dojoType="dijit.form.Button" type="button" dojoAttachEvent="onClick:prev">&lt; Previous</button>',
                        '<button dojoType="dijit.form.Button" type="button" dojoAttachEvent="onClick:next">Next &gt;</button>',
                        '<button dojoType="dijit.form.Button" type="button" dojoAttachEvent="onClick:last">Last &gt;&gt;</button>',
                    '</form>',
                '</div>',
                '<div dojoType="dijit.layout.ContentPane" region="center" splitter="true">',
                    
                '</div>',
            '</div>',
        '</div>'
        ]);

    dojo.declare('Demo.ResourceCollection', [Demo.View], {
        widgetTemplate: T,
        bindings: [
            {name: 'resourceKind', event: 'onChange', target: 'change'},
            {name: 'startIndex', event: 'onChange', target: 'change'},
            {name: 'count', event: 'onChange', target: 'change'}
        ],
        constructor: function() {
            this.inherited(arguments);

            dojo.connect(App, 'onServiceChanged', dojo.hitch(this, this.onServiceChanged));

            // todo: add eventing to the application to notify of service changes
            this.request = new Sage.SData.Client.SDataResourceCollectionRequest();
        },
        onServiceChanged: function(service) {

            // todo: find a better way of doing this?
            this.request = new Sage.SData.Client.SDataResourceCollectionRequest(service)
                .setResourceKind(this.resourceKind.attr('value'))
                .setStartIndex(this.resourceKind.attr('value'))
                .setCount(this.count.attr('value'));

            this.url.attr('value', this.request.build());
        },
        read: function(evt) {            
        },
        first: function(evt) {
        },
        prev: function(evt) {
        },
        next: function(evt) {
        },
        last: function(evt) {
        },
        change: function(field, value) {
            switch (field.name)
            {
                case 'resourceKind':
                    this.request.setResourceKind(value);
                    break;
                case 'startIndex':
                    this.request.setStartIndex(value);
                    break;
                case 'count':
                    this.request.setCount(value);
                    break;
            }

            this.url.attr('value', this.request.build());
        },
        postCreate: function()
        {
            this.inherited(arguments);

            this.url.attr('value', this.request.build());
        }
    });
})();
