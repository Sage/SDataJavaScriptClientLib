/// <reference path="../../ext/ext-core-debug.js"/>
/// <reference path="../../platform/Application.js"/>
/// <reference path="../../sdata/SDataService.js"/>

Ext.namespace("Mobile.SalesLogix");

Mobile.SalesLogix.Format = (function() {
    function isEmpty(val) {
        if (typeof val !== 'string') return true;
        
        return (val.length <= 0);
    };

    function encode(val) {
        if (typeof val !== 'string') return val;

        return val.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    return {
        encode: encode,
        address: function(address, nl) {
            var lines = [];

            if (!isEmpty(address['Address1'])) lines.push(encode(address['Address1']));
            if (!isEmpty(address['Address2'])) lines.push(encode(address['Address2']));
            if (!isEmpty(address['Address3'])) lines.push(encode(address['Address3']));
            if (!isEmpty(address['Address4'])) lines.push(encode(address['Address4']));

            var location = [];

            if (!isEmpty(address['City']) && !isEmpty(encode(address['State'])))
            {
                location.push(encode(address['City']) + ',');
                location.push(encode(address['State']));                                            
            }
            else
            {
                if (!isEmpty(address['City'])) location.push(encode(address['City']));
                if (!isEmpty(address['State'])) location.push(encode(address['State']));                
            }

            if (!isEmpty(address['PostalCode'])) location.push(encode(address['PostalCode']));
                   
            if (location.length > 0)
            {
                lines.push(location.join(' '));
            }

            if (!isEmpty(address['Country'])) lines.push(encode(address['Country']));
            
            return nl ? lines.join('\n') : lines.join('<br />');
        },
        phone: function(phone) {
            if (typeof phone !== 'string') 
                return phone;
            
            if (phone.length != 10)
                return String.format('<a href="tel:{0}">{0}</a>', phone);

            return String.format('<a href="tel:{0}">({1}) {2}-{3}</a>', phone, phone.substring(0, 3), phone.substring(3, 6), phone.substring(6));
        },
        link: function(url) {
            if (typeof url !== 'string')
                return url;

            return String.format('<a target="_blank" href="http://{0}">{0}</a>', url);
        },
        mail: function(mail) {
            if (typeof mail !== 'string')
                return mail;

            return String.format('<a href="mailto:{0}">{0}</a>', mail);            
        }
    };
})();