/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataSingleResourceRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/Detail.js"/>

Ext.namespace("Mobile.AdventureWorks.Contact");

Mobile.AdventureWorks.Contact.Detail = Ext.extend(Sage.Platform.Mobile.Detail, {   
    constructor: function(o) {
        Mobile.AdventureWorks.Contact.Detailt.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'contact_detail',
            title: 'Contact',
            expose: false
        });

        this.layout = [
            {name: 'FirstName', label: 'First'},
            {name: 'LastName', label: 'Last'},
            {name: 'Employee', label: 'Employee', as: [
                {name: 'Title', label: 'Title'}
            ]}
        ];
    },
    init: function() {     
        Mobile.AdventureWorks.Contact.Detail.superclass.init.call(this);   
    },
    createRequest: function() {
        return new Sage.SData.Client.SDataSingleResourceRequest(this.getService())            
            .setResourceKind('contacts')
            .setQueryArgs({
                'include': 'Employee'                
            })
            .setResourceSelector("'" + this.context.key + "'");
    } 
});