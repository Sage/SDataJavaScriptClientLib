/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/List.js"/>

Ext.namespace("Mobile.AdventureWorks.Contact");

Mobile.AdventureWorks.Contact.List = Ext.extend(Sage.Platform.Mobile.List, {   
    itemTemplate: new Simplate([
        '<li>',
        '<a href="#contact_detail" target="_none" m:key="{%= $key %}" m:url="{%= $url %}">',
        '<h3>{%= LastName %}, {%= FirstName %}</h3>',
        '<h4>{%= (Employee || {}).Title %}</h4>',
        '</a>',
        '</li>'
    ]),    
    constructor: function(o) {
        Mobile.AdventureWorks.Contact.List.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'contact_list',
            title: 'Contacts',
            pageSize: 20
        });
    },   
    createRequest:function() {
        var pageSize = this.pageSize;
        var startIndex = this.feed && this.feed['$startIndex'] && this.feed['$itemsPerPage'] 
            ? this.feed['$startIndex'] + this.feed['$itemsPerPage']
            : 1;

        return new Sage.SData.Client.SDataResourceCollectionRequest(this.getService())            
            .setResourceKind('contacts')
            .setQueryArgs({
                'include': 'Employee',
                'select': 'LastName,FirstName,Employee/Title'                
            })                    
            .setCount(pageSize)
            .setStartIndex(startIndex); 
    }
});