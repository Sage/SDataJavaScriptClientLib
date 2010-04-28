/// <reference path="../../ext/ext-core-debug.js"/>
/// <reference path="../../platform/Application.js"/>
/// <reference path="../../platform/Format.js"/>
/// <reference path="../../sdata/SDataService.js"/>

Ext.namespace("Mobile.SalesLogix");

Mobile.SalesLogix.Format = (function() {
    var F = Sage.Platform.Mobile.Format;   
   
    return Ext.apply({}, {
        address: function(address, nl) {
            var lines = [];

            if (!F.isEmpty(address['Address1'])) lines.push(F.encode(address['Address1']));
            if (!F.isEmpty(address['Address2'])) lines.push(F.encode(address['Address2']));
            if (!F.isEmpty(address['Address3'])) lines.push(F.encode(address['Address3']));
            if (!F.isEmpty(address['Address4'])) lines.push(F.encode(address['Address4']));

            var location = [];

            if (!F.isEmpty(address['City']) && !F.isEmpty(F.encode(address['State'])))
            {
                location.push(F.encode(address['City']) + ',');
                location.push(F.encode(address['State']));                                            
            }
            else
            {
                if (!F.isEmpty(address['City'])) location.push(F.encode(address['City']));
                if (!F.isEmpty(address['State'])) location.push(F.encode(address['State']));                
            }

            if (!F.isEmpty(address['PostalCode'])) location.push(F.encode(address['PostalCode']));
                   
            if (location.length > 0)
            {
                lines.push(location.join(' '));
            }

            if (!F.isEmpty(address['Country'])) lines.push(F.encode(address['Country']));
            
            return nl ? lines.join('\n') : lines.join('<br />');
        },
        phone: function(phone) {
            if (typeof phone !== 'string') 
                return phone;
            
            if (phone.length != 10)
                return String.format('<a href="tel:{0}">{0}</a>', phone);

            return String.format('<a href="tel:{0}">({1}) {2}-{3}</a>', phone, phone.substring(0, 3), phone.substring(3, 6), phone.substring(6));
        }        
    }, F);
})();