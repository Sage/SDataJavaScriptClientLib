/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataResourceCollectionRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/List.js"/>

Ext.namespace("Mobile.SalesLogix.Contact");

Mobile.SalesLogix.Contact.List = Ext.extend(Sage.Platform.Mobile.List, {   
    itemTemplate: new Simplate([
        '<li>',
        '<a href="#contact_detail" target="_detail" m:key="{%= $key %}" m:url="{%= $url %}">',
        '<h3>{%= LastName %}, {%= FirstName %}</h3>',
        '<h4>{%= AccountName %}</h4>',
        '</a>',
        '</li>'
    ]),    
    constructor: function(o) {
        Mobile.SalesLogix.Contact.List.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'contact_list',
            title: 'Contacts',
            pageSize: 10,
            icon: 'content/images/app/slx/Contacts_24x24.gif'
        });
    },   
    createRequest: function() {
        var pageSize = this.pageSize;
        var startIndex = this.feed && this.feed['$startIndex'] && this.feed['$itemsPerPage'] 
            ? this.feed['$startIndex'] + this.feed['$itemsPerPage']
            : 1;

        var request = new Sage.SData.Client.SDataResourceCollectionRequest(this.getService())            
            .setResourceKind('contacts')
            .setQueryArgs({
                'orderby': 'LastName,FirstName',
                'select': 'LastName,FirstName,AccountName'                             
            })                    
            .setCount(pageSize)
            .setStartIndex(startIndex); 

        if (this.current && this.current.where)
            request.setQueryArgs({
                'where': this.current.where
            });        

        return request;
    }
});