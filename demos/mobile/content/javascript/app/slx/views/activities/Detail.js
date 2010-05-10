/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataSingleResourceRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/Detail.js"/>
/// <reference path="../../Format.js"/>

Ext.namespace("Mobile.SalesLogix.Activity");

Mobile.SalesLogix.Activity.Detail = Ext.extend(Sage.Platform.Mobile.Detail, {       
    constructor: function(o) {
        Mobile.SalesLogix.Activity.Detail.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'activity_detail',
            title: 'Activity',
            expose: false
        });

        this.layout = [
            
        ];
    },
    init: function() {     
        Mobile.SalesLogix.Activity.Detail.superclass.init.call(this);   
    },
    createRequest: function() {
        return new Sage.SData.Client.SDataSingleResourceRequest(this.getService())            
            .setResourceKind('activities')
            .setQueryArgs({                
                'orderby': 'Description',
                'select': 'Description,Category'                
            })
            .setResourceSelector(String.format("'{0}'", this.context.key));
    } 
});