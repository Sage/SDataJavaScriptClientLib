/// <reference path="../ext/ext-core-debug.js"/>

Ext.namespace('Sage.Platform.Mobile');

Sage.Platform.Mobile.Format = (function() {
    function isEmpty(val) {
        if (typeof val !== 'string') return true;
        
        return (val.length <= 0);
    };

    function encode(val) {
        if (typeof val !== 'string') return val;

        return val
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };

    function decode(val) {
        if (typeof val !== 'string') return val;

        return val
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"');
    };

    return {
        encode: encode,
        isEmpty: isEmpty,       
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

