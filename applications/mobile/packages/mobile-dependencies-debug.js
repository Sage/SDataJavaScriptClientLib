/*!
 * 
 */
﻿/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
 
var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
};// ========================================================================
//  XML.ObjTree -- XML source code from/to JavaScript object like E4X
// ========================================================================

if ( typeof(XML) == 'undefined' ) XML = function() {};

//  constructor

XML.ObjTree = function () {
    return this;
};

//  class variables

XML.ObjTree.VERSION = "0.24";

//  object prototype

XML.ObjTree.prototype.xmlDecl = '<?xml version="1.0" encoding="UTF-8" ?>\n';
XML.ObjTree.prototype.attr_prefix = '-';
XML.ObjTree.prototype.overrideMimeType = 'text/xml';

//  method: parseXML( xmlsource )

XML.ObjTree.prototype.parseXML = function ( xml ) {
    var root;
    if ( window.DOMParser ) {
        var xmldom = new DOMParser();
//      xmldom.async = false;           // DOMParser is always sync-mode
        var dom = xmldom.parseFromString( xml, "application/xml" );
        if ( ! dom ) return;
        root = dom.documentElement;
    } else if ( window.ActiveXObject ) {
        xmldom = new ActiveXObject('Microsoft.XMLDOM');
        xmldom.async = false;
        xmldom.loadXML( xml );
        root = xmldom.documentElement;
    }
    if ( ! root ) return;
    return this.parseDOM( root );
};

//  method: parseHTTP( url, options, callback )

XML.ObjTree.prototype.parseHTTP = function ( url, options, callback ) {
    var myopt = {};
    for( var key in options ) {
        myopt[key] = options[key];                  // copy object
    }
    if ( ! myopt.method ) {
        if ( typeof(myopt.postBody) == "undefined" &&
             typeof(myopt.postbody) == "undefined" &&
             typeof(myopt.parameters) == "undefined" ) {
            myopt.method = "get";
        } else {
            myopt.method = "post";
        }
    }
    if ( callback ) {
        myopt.asynchronous = true;                  // async-mode
        var __this = this;
        var __func = callback;
        var __save = myopt.onComplete;
        myopt.onComplete = function ( trans ) {
            var tree;
            if ( trans && trans.responseXML && trans.responseXML.documentElement ) {
                tree = __this.parseDOM( trans.responseXML.documentElement );
            } else if ( trans && trans.responseText ) {
                tree = __this.parseXML( trans.responseText );
            }
            __func( tree, trans );
            if ( __save ) __save( trans );
        };
    } else {
        myopt.asynchronous = false;                 // sync-mode
    }
    var trans;
    if ( typeof(HTTP) != "undefined" && HTTP.Request ) {
        myopt.uri = url;
        var req = new HTTP.Request( myopt );        // JSAN
        if ( req ) trans = req.transport;
    } else if ( typeof(Ajax) != "undefined" && Ajax.Request ) {
        var req = new Ajax.Request( url, myopt );   // ptorotype.js
        if ( req ) trans = req.transport;
    }
//  if ( trans && typeof(trans.overrideMimeType) != "undefined" ) {
//      trans.overrideMimeType( this.overrideMimeType );
//  }
    if ( callback ) return trans;
    if ( trans && trans.responseXML && trans.responseXML.documentElement ) {
        return this.parseDOM( trans.responseXML.documentElement );
    } else if ( trans && trans.responseText ) {
        return this.parseXML( trans.responseText );
    }
}

//  method: parseDOM( documentroot )

XML.ObjTree.prototype.parseDOM = function ( root ) {
    if ( ! root ) return;

    this.__force_array = {};
    if ( this.force_array ) {
        for( var i=0; i<this.force_array.length; i++ ) {
            this.__force_array[this.force_array[i]] = 1;
        }
    }

    var json = this.parseElement( root );   // parse root node
    if ( this.__force_array[root.nodeName] ) {
        json = [ json ];
    }
    if ( root.nodeType != 11 ) {            // DOCUMENT_FRAGMENT_NODE
        var tmp = {};
        tmp[root.nodeName] = json;          // root nodeName
        json = tmp;
    }
    return json;
};

//  method: parseElement( element )

XML.ObjTree.prototype.parseElement = function ( elem ) {
    //  COMMENT_NODE
    if ( elem.nodeType == 7 ) {
        return;
    }

    //  TEXT_NODE CDATA_SECTION_NODE
    if ( elem.nodeType == 3 || elem.nodeType == 4 ) {
        var bool = elem.nodeValue.match( /[^\x00-\x20]/ );
        if ( bool == null ) return;     // ignore white spaces
        return elem.nodeValue;
    }

    var retval;
    var cnt = {};

    //  parse attributes
    if ( elem.attributes && elem.attributes.length ) {
        retval = {};
        for ( var i=0; i<elem.attributes.length; i++ ) {
            var key = elem.attributes[i].nodeName;
            if ( typeof(key) != "string" ) continue;
            var val = elem.attributes[i].nodeValue;
            if ( ! val ) continue;
            key = this.attr_prefix + key;
            if ( typeof(cnt[key]) == "undefined" ) cnt[key] = 0;
            cnt[key] ++;
            this.addNode( retval, key, cnt[key], val );
        }
    }

    //  parse child nodes (recursive)
    if ( elem.childNodes && elem.childNodes.length ) {
        var textonly = true;
        if ( retval ) textonly = false;        // some attributes exists
        for ( var i=0; i<elem.childNodes.length && textonly; i++ ) {
            var ntype = elem.childNodes[i].nodeType;
            if ( ntype == 3 || ntype == 4 ) continue;
            textonly = false;
        }
        if ( textonly ) {
            if ( ! retval ) retval = "";
            for ( var i=0; i<elem.childNodes.length; i++ ) {
                retval += elem.childNodes[i].nodeValue;
            }
        } else {
            if ( ! retval ) retval = {};
            for ( var i=0; i<elem.childNodes.length; i++ ) {
                var key = elem.childNodes[i].nodeName;
                if ( typeof(key) != "string" ) continue;
                var val = this.parseElement( elem.childNodes[i] );
                if ( ! val ) continue;
                if ( typeof(cnt[key]) == "undefined" ) cnt[key] = 0;
                cnt[key] ++;
                this.addNode( retval, key, cnt[key], val );
            }
        }
    }
    return retval;
};

//  method: addNode( hash, key, count, value )

XML.ObjTree.prototype.addNode = function ( hash, key, cnts, val ) {
    if ( this.__force_array[key] ) {
        if ( cnts == 1 ) hash[key] = [];
        hash[key][hash[key].length] = val;      // push
    } else if ( cnts == 1 ) {                   // 1st sibling
        hash[key] = val;
    } else if ( cnts == 2 ) {                   // 2nd sibling
        hash[key] = [ hash[key], val ];
    } else {                                    // 3rd sibling and more
        hash[key][hash[key].length] = val;
    }
};

//  method: writeXML( tree )

XML.ObjTree.prototype.writeXML = function ( tree ) {
    var xml = this.hash_to_xml( null, tree );
    return this.xmlDecl + xml;
};

//  method: hash_to_xml( tagName, tree )

XML.ObjTree.prototype.hash_to_xml = function ( name, tree ) {
    var elem = [];
    var attr = [];
    for( var key in tree ) {
        if ( ! tree.hasOwnProperty(key) ) continue;
        var val = tree[key];
        if ( key.charAt(0) != this.attr_prefix ) {
            if ( typeof(val) == "undefined" || val == null ) {
                elem[elem.length] = "<"+key+" />";
            } else if ( typeof(val) == "object" && val.constructor == Array ) {
                elem[elem.length] = this.array_to_xml( key, val );
            } else if ( typeof(val) == "object" ) {
                elem[elem.length] = this.hash_to_xml( key, val );
            } else {
                elem[elem.length] = this.scalar_to_xml( key, val );
            }
        } else {
            attr[attr.length] = " "+(key.substring(1))+'="'+(this.xml_escape( val ))+'"';
        }
    }
    var jattr = attr.join("");
    var jelem = elem.join("");
    if ( typeof(name) == "undefined" || name == null ) {
        // no tag
    } else if ( elem.length > 0 ) {
        if ( jelem.match( /\n/ )) {
            jelem = "<"+name+jattr+">\n"+jelem+"</"+name+">\n";
        } else {
            jelem = "<"+name+jattr+">"  +jelem+"</"+name+">\n";
        }
    } else {
        jelem = "<"+name+jattr+" />\n";
    }
    return jelem;
};

//  method: array_to_xml( tagName, array )

XML.ObjTree.prototype.array_to_xml = function ( name, array ) {
    var out = [];
    for( var i=0; i<array.length; i++ ) {
        var val = array[i];
        if ( typeof(val) == "undefined" || val == null ) {
            out[out.length] = "<"+name+" />";
        } else if ( typeof(val) == "object" && val.constructor == Array ) {
            out[out.length] = this.array_to_xml( name, val );
        } else if ( typeof(val) == "object" ) {
            out[out.length] = this.hash_to_xml( name, val );
        } else {
            out[out.length] = this.scalar_to_xml( name, val );
        }
    }
    return out.join("");
};

//  method: scalar_to_xml( tagName, text )

XML.ObjTree.prototype.scalar_to_xml = function ( name, text ) {
    if ( name == "#text" ) {
        return this.xml_escape(text);
    } else {
        return "<"+name+">"+this.xml_escape(text)+"</"+name+">\n";
    }
};

//  method: xml_escape( text )

XML.ObjTree.prototype.xml_escape = function ( text ) {
    return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
};

/*
// ========================================================================

=head1 NAME

XML.ObjTree -- XML source code from/to JavaScript object like E4X

=head1 SYNOPSIS

    var xotree = new XML.ObjTree();
    var tree1 = {
        root: {
            node: "Hello, World!"
        }
    };
    var xml1 = xotree.writeXML( tree1 );        // object tree to XML source
    alert( "xml1: "+xml1 );

    var xml2 = '<?xml version="1.0"?><response><error>0</error></response>';
    var tree2 = xotree.parseXML( xml2 );        // XML source to object tree
    alert( "error: "+tree2.response.error );

=head1 DESCRIPTION

XML.ObjTree class is a parser/generater between XML source code
and JavaScript object like E4X, ECMAScript for XML.
This is a JavaScript version of the XML::TreePP module for Perl.
This also works as a wrapper for XMLHTTPRequest and successor to JKL.ParseXML class
when this is used with prototype.js or JSAN's HTTP.Request class.

=head2 JavaScript object tree format

A sample XML source:

    <?xml version="1.0" encoding="UTF-8"?>
    <family name="Kawasaki">
        <father>Yasuhisa</father>
        <mother>Chizuko</mother>
        <children>
            <girl>Shiori</girl>
            <boy>Yusuke</boy>
            <boy>Kairi</boy>
        </children>
    </family>

Its JavaScript object tree like JSON/E4X:

    {
        'family': {
            '-name':    'Kawasaki',
            'father':   'Yasuhisa',
            'mother':   'Chizuko',
            'children': {
                'girl': 'Shiori'
                'boy': [
                    'Yusuke',
                    'Kairi'
                ]
            }
        }
    };

Each elements are parsed into objects:

    tree.family.father;             # the father's given name.

Prefix '-' is inserted before every attributes' name.

    tree.family["-name"];           # this family's family name

A array is used because this family has two boys.

    tree.family.children.boy[0];    # first boy's name
    tree.family.children.boy[1];    # second boy's name
    tree.family.children.girl;      # (girl has no other sisiters)

=head1 METHODS

=head2 xotree = new XML.ObjTree()

This constructor method returns a new XML.ObjTree object.

=head2 xotree.force_array = [ "rdf:li", "item", "-xmlns" ];

This property allows you to specify a list of element names
which should always be forced into an array representation.
The default value is null, it means that context of the elements
will determine to make array or to keep it scalar.

=head2 xotree.attr_prefix = '@';

This property allows you to specify a prefix character which is
inserted before each attribute names.
Instead of default prefix '-', E4X-style prefix '@' is also available.
The default character is '-'.
Or set '@' to access attribute values like E4X, ECMAScript for XML.
The length of attr_prefix must be just one character and not be empty.

=head2 xotree.xmlDecl = '';

This library generates an XML declaration on writing an XML code per default.
This property forces to change or leave it empty.

=head2 tree = xotree.parseXML( xmlsrc );

This method loads an XML document using the supplied string
and returns its JavaScript object converted.

=head2 tree = xotree.parseDOM( domnode );

This method parses a DOM tree (ex. responseXML.documentElement)
and returns its JavaScript object converted.

=head2 tree = xotree.parseHTTP( url, options );

This method loads a XML file from remote web server
and returns its JavaScript object converted.
XMLHTTPRequest's synchronous mode is always used.
This mode blocks the process until the response is completed.

First argument is a XML file's URL
which must exist in the same domain as parent HTML file's.
Cross-domain loading is not available for security reasons.

Second argument is options' object which can contains some parameters:
method, postBody, parameters, onLoading, etc.

This method requires JSAN's L<HTTP.Request> class or prototype.js's Ajax.Request class.

=head2 xotree.parseHTTP( url, options, callback );

If a callback function is set as third argument,
XMLHTTPRequest's asynchronous mode is used.

This mode calls a callback function with XML file's JavaScript object converted
after the response is completed.

=head2 xmlsrc = xotree.writeXML( tree );

This method parses a JavaScript object tree
and returns its XML source generated.

=head1 EXAMPLES

=head2 Text node and attributes

If a element has both of a text node and attributes
or both of a text node and other child nodes,
text node's value is moved to a special node named "#text".

    var xotree = new XML.ObjTree();
    var xmlsrc = '<span class="author">Kawasaki Yusuke</span>';
    var tree = xotree.parseXML( xmlsrc );
    var class = tree.span["-class"];        # attribute
    var name  = tree.span["#text"];         # text node

=head2 parseHTTP() method with HTTP-GET and sync-mode

HTTP/Request.js or prototype.js must be loaded before calling this method.

    var xotree = new XML.ObjTree();
    var url = "http://example.com/index.html";
    var tree = xotree.parseHTTP( url );
    xotree.attr_prefix = '@';                   // E4X-style
    alert( tree.html["@lang"] );

This code shows C<lang=""> attribute from a X-HTML source code.

=head2 parseHTTP() method with HTTP-POST and async-mode

Third argument is a callback function which is called on onComplete.

    var xotree = new XML.ObjTree();
    var url = "http://example.com/mt-tb.cgi";
    var opts = {
        postBody:   "title=...&excerpt=...&url=...&blog_name=..."
    };
    var func = function ( tree ) {
        alert( tree.response.error );
    };
    xotree.parseHTTP( url, opts, func );

This code send a trackback ping and shows its response code.

=head2 Simple RSS reader

This is a RSS reader which loads RDF file and displays all items.

    var xotree = new XML.ObjTree();
    xotree.force_array = [ "rdf:li", "item" ];
    var url = "http://example.com/news-rdf.xml";
    var func = function( tree ) {
        var elem = document.getElementById("rss_here");
        for( var i=0; i<tree["rdf:RDF"].item.length; i++ ) {
            var divtag = document.createElement( "div" );
            var atag = document.createElement( "a" );
            atag.href = tree["rdf:RDF"].item[i].link;
            var title = tree["rdf:RDF"].item[i].title;
            var tnode = document.createTextNode( title );
            atag.appendChild( tnode );
            divtag.appendChild( atag );
            elem.appendChild( divtag );
        }
    };
    xotree.parseHTTP( url, {}, func );

=head2  XML-RPC using writeXML, prototype.js and parseDOM

If you wish to use prototype.js's Ajax.Request class by yourself:

    var xotree = new XML.ObjTree();
    var reqtree = {
        methodCall: {
            methodName: "weblogUpdates.ping",
            params: {
                param: [
                    { value: "Kawa.net xp top page" },  // 1st param
                    { value: "http://www.kawa.net/" }   // 2nd param
                ]
            }
        }
    };
    var reqxml = xotree.writeXML( reqtree );       // JS-Object to XML code
    var url = "http://example.com/xmlrpc";
    var func = function( req ) {
        var resdom = req.responseXML.documentElement;
        xotree.force_array = [ "member" ];
        var restree = xotree.parseDOM( resdom );   // XML-DOM to JS-Object
        alert( restree.methodResponse.params.param.value.struct.member[0].value.string );
    };
    var opt = {
        method:         "post",
        postBody:       reqxml,
        asynchronous:   true,
        onComplete:     func
    };
    new Ajax.Request( url, opt );

=head1 AUTHOR

Yusuke Kawasaki http://www.kawa.net/

=head1 COPYRIGHT AND LICENSE

Copyright (c) 2005-2006 Yusuke Kawasaki. All rights reserved.
This program is free software; you can redistribute it and/or
modify it under the Artistic license. Or whatever license I choose,
which I will do instead of keeping this documentation like it is.

=cut
// ========================================================================
*/
﻿/*!
 * simplate-js v1.1 
 * Copyright 2010, Michael Morton 
 * 
 * MIT Licensed - See LICENSE.txt
 */
(function() {
    var options = {
        tags: {
            begin: "{%",
            end: "%}"
        }
    };
    var cache = {};
    var merge = function(a, b, c) {
        if (c)
            for (var n in c) a[n] = c[n];
        if (b)
            for (var n in b) a[n] = b[n];
        return a;
    };
    function encode(val) {
        if (typeof val !== 'string') return val;

        return val
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };
    var make = function(markup, o) {
        if (markup.join) markup = markup.join("");
        if (cache[markup]) return cache[markup];

        var o = merge({}, o, options);
       
        if ('is,ie'.split(/(,)/).length !== 3)
        {
            var fragments = [];
            var a = markup.split(o.tags.begin);
            for (var i = 0; i < a.length; i++)
                fragments.push.apply(fragments, a[i].split(o.tags.end));
        }
        else
        {
            var regex = new RegExp(o.tags.begin + "(.*?)" + o.tags.end);
            var fragments = markup.split(regex);
        }
       
        /* code fragments */
        for (var i = 1; i < fragments.length; i += 2)
        {
            if (fragments[i].length > 0)
            {
                var control = fragments[i].charAt(0);
                switch (control)
                {
                    case "#":
                        /* comment */
                        fragments[i] = "";
                        break;
                    case "=":
                        fragments[i] = "__p(" + fragments[i].substr(1) + ");";
                        break;
                    case ":":
                        fragments[i] = "__p(__s.encode(" + fragments[i].substr(1) + "));";
                        break;
                    case "$":
                        fragments[i] = "try {" + "__p(" + fragments[i].substr(1) + ");" + "} catch (__e) {}";
                        break;
                    case "!":
                        fragments[i] = "__p(" + fragments[i].substr(1).replace(/^\s+|\s+$/g,'') + ".apply(__v));";
                        break;
                    default:
                        /* as is */
                        break;
                }
            }
        }
       
        for (var i = 0; i < fragments.length; i += 2)
            fragments[i] = "__p('" + fragments[i].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "');";
           
        var source = [
            'var __r = [], $ = __v || {}, __s = Simplate, __p = function() { __r.push.apply(__r, arguments); };',
            'with ($) {',
            fragments.join(''),
            '}',
            'return __r.join(\'\');'
        ];
        
        var fn;

        try
        {
            fn = new Function("__v", source.join(''));
        }
        catch (e)
        {
            fn = function(values) { return e.message; };
        }
       
        return (cache[markup] = fn);
    };

    Simplate = window.Simplate = function(markup, o) {
        this.fn = make(markup, o);
    };

    Simplate.prototype = {
        apply: function(data, scope) {
            return this.fn.call(scope || this, data);
        }
    };
    
    Simplate.options = options;
    Simplate.encode = encode;
})();/*!
* ReUI v1.0
* Copyright 2010, Michael Morton
*
* MIT Licensed - See LICENSE
*
* Sections of this code are Copyright (c) 2007-2009, iUI Project Members, and are
* licensed under the terms of the BSD license (see LICENSE.iUI).
*/
ReUI = {};

(function() {
    var R = ReUI,
        isIE = /msie/i.test(navigator.userAgent),
        reForClassCache = {};

    var reForClass = function(cls) {
        return reForClassCache[cls] 
            ? (reForClassCache[cls])
            : (reForClassCache[cls] = new RegExp('(^|\\s)' + cls + '($|\\s)'));
    };

    ReUI.DomHelper = {
        apply: function (a, b, c) {
            var a = a || {};

            if (b) for (var n in b) a[n] = b[n];
            if (c) for (var n in c) a[n] = c[n];

            return a;
        }, 
        dispatch: function(el, type, bubble, cancel, o) {
            if (typeof cancel === 'object')
            {
                var o = cancel;
                var cancel = true;
            }
            else if (typeof bubble === 'object')
            {
                var o = bubble;
                var bubble = true;
                var cancel = true;    
            }

            var o = o || {};

            var evt = document.createEvent("UIEvent");

            evt.initEvent(type, bubble === false ? false : true, cancel === false ? false : true);

            this.apply(evt, o);
        
            el.dispatchEvent(evt);
        },
        bind: isIE 
            ? function(target, type, fn) {
                target.attachEvent(type, fn);
            }
            : function(target, type, fn, capture) {        
                target.addEventListener(type, fn, capture);
            },
        unbind: isIE
            ? function(target, type, fn) {
                target.detachEvent(type, fn);
            }
            : function(target, type, fn, capture) {
                target.removeEventListener(type, fn, capture);
            },
        wait: isIE 
            ? function(fn, delay) {
                var pass = Array.prototype.slice.call(arguments, 2);
                return setTimeout(function() {
                    fn.apply(this, pass);
                }, delay);
            }
            : function() {
                return setTimeout.apply(window, arguments);
            },
        clearWait: function() {
            clearTimeout.apply(window, arguments);
        },
        timer: isIE 
            ? function(fn, delay) {
                var pass = Array.prototype.slice.call(arguments, 2);
                return setInterval(function() {
                    fn.apply(this, pass);
                }, delay);
            }
            : function() {
                return setInterval.apply(window, arguments);
            },
        clearTimer: function() {
            clearInterval.apply(window, arguments);
        },
        hasClass: function(el, cls) {
            return reForClass(cls).test(el.className);
        },
        addClass: function(el, cls) {
            if (this.hasClass(el, cls) == false) el.className += ' ' + cls;            
        },
        removeClass: function(el, cls) {
            if (this.hasClass(el, cls)) el.className = el.className.replace(reForClass(cls), ' ');
        },
        get: function(el) {
            if (typeof el === 'string') return document.getElementById(el);

            return el;
        },
        findAncestorByTag: function(node, name) {
            while (node && (node.nodeType != 1 || node.localName.toLowerCase() != name))
                node = node.parentNode;
            return node;
        },
        select: function(el) {
            el.setAttribute('selected', 'true');
        },
        unselect: function(el) {
            el.removeAttribute('selected');
        },
        applyStyle: function(el, style) {
            this.apply(el.style, style);
        }
    };
})();

(function() {  
    var R = ReUI,
        D = ReUI.DomHelper,
        isWebKit = /webkit/i.test(navigator.userAgent);         
       
    var resolveFx = function(name) {
        return R.useCompatibleFx 
            ? R.registeredFx[name + 'Compatible']
            : R.registeredFx[name];
    };

    var onRootClick = function(evt) {  
        var evt = evt || window.event;            
        var target = evt.target || evt.srcElement;

        var link = D.findAncestorByTag(target, 'a');
        if (link) 
        {                
            if (link.href && link.hash && link.hash != '#' && !link.target)
            {
                D.select(link);
                    
                R.show(D.get(link.hash.substr(1)));

                D.wait(D.unselect, 500, link);
            }
            else if (link == R.backEl)
            {
                R.back();
            }
            else if (link.getAttribute('type') == 'cancel')
            {
                if (context.dialog) D.unselect(context.dialog);                        
            }          
            else if (link.getAttribute('href', 2) === '#' ||
                     link.getAttribute('href', 2) === null)
            {       
                /* do nothing */               
                /* will not work on all browsers, as some will return the resolved url regardless */
            }
            else
            {
                return;
            }

            evt.cancelBubble = true;
            if (evt.stopPropagation) evt.stopPropagation();
            if (evt.preventDefault) evt.preventDefault();
        }
    };

    var transitionComplete = function(page, o) {
        if (o.track !== false) 
        {
            if (typeof page.id !== 'string' || page.id.length <= 0)
                page.id = 'liui-' + (context.counter++);

            context.hash = location.hash = R.hashPrefix + page.id;

            context.history.push(page.id);
        }

        context.transitioning = false;
          
        if (o.update !== false) 
        {
            if (R.titleEl)
            {
                if (page.title) 
                    R.titleEl.innerHTML = page.title;

                var titleCls = page.getAttribute('titleCls') || page.getAttribute('ttlclass');
                if (titleCls)
                    R.titleEl.className = titleCls;
            }

            /* only update back button if track is set to true, since there is no history entry for the new page */
            if (R.backEl && o.track !== false) 
            {
                var previous = D.get(context.history[context.history.length - 2]);
                if (previous && !previous.getAttribute('hideBackButton'))
                {
                    R.backEl.style.display = 'inline';
                    R.backEl.innerHTML = previous.title || R.backText;

                    var backButtonCls = previous.getAttribute('backButtonCls') || previous.getAttribute('bbclass');

                    R.backEl.className = backButtonCls ? 'button ' + backButtonCls : 'button';
                }
                else
                {
                    R.backEl.style.display = 'none';
                }
            }
        }
    };  
    
    var transition = function(from, to, o) {            
        function complete() {            
            context.check = D.timer(checkOrientationAndLocation, R.checkStateEvery);    
                
            D.wait(transitionComplete, 0, to, o);                               
                
            D.dispatch(from, 'aftertransition', {out: true});            
            D.dispatch(to, 'aftertransition', {out: false});
        };
        
        context.transitioning = true;

        D.clearTimer(context.check);

        D.dispatch(from, 'beforetransition', {out: true});            
        D.dispatch(to, 'beforetransition', {out: false});

        if (R.disableFx === true)
        {
            D.unselect(from);
            D.select(to);
            complete();
            return;
        }

        if (typeof o.horizontal !== 'boolean')
        {
            var toHorizontal = to.getAttribute('horizontal');                
            var fromHorizontal = from.getAttribute('horizontal');

            if (toHorizontal === 'false' || fromHorizontal === 'false')
            {
                o.horizontal = false;
            }
        }
            
        var dir = o.horizontal !== false
            ? o.reverse ? 'r' : 'l'
            : o.reverse ? 'd' : 'u';

        var toFx = to.getAttribute('effect');
        var fromFx = from.getAttribute('effect');
        var useFx = fromFx || toFx;

        var fx = resolveFx(useFx) || resolveFx(R.defaultFx);
        if (fx) 
            fx(from, to, dir, complete);
    };       
    
    var getPageFromHash = function(hash) {
        if (hash && hash.indexOf(R.hashPrefix) === 0)
            return D.get(hash.substr(R.hashPrefix.length));
        return false;
    };                   

    var checkOrientationAndLocation = function() {
        if (!context.hasOrientationEvent)
        {
            if ((window.innerHeight != context.height) || (window.innerWidth != context.width))
            {
                context.height = window.innerHeight;
                context.width = window.innerWidth;

                setOrientation(context.height < context.width ? 'landscape' : 'portrait');
            }
        }

        if (context.hash != location.hash)
        {
            var el = getPageFromHash(location.hash);            
            if (el) 
                R.show(el);                    
        }         
    };

    var orientationChanged = function() {
        switch (window.orientation) 
        {                
            case 90:
            case -90:
                setOrientation('landscape');
                break;
            default:
                setOrientation('portrait');
                break;
        }
    };

    var setOrientation = function(value) {
        R.rootEl.setAttribute('orient', value);

        if (value == 'portrait') 
        {
            D.removeClass(R.rootEl, 'landscape');
            D.addClass(R.rootEl, 'portrait');
        }
        else if (value == 'landscape')
        {
            D.removeClass(R.rootEl, 'portrait');
            D.addClass(R.rootEl, 'landscape');
        }
        else
        {
            D.removeClass(R.rootEl, 'portrait');
            D.removeClass(R.rootEl, 'landscape');
        }

        D.wait(scrollTo, 100, 0, 1); 
    };

    var context = {
        page: false,
        dialog: false,
        transitioning: false,
        initialized: false,
        counter: 0,
        width: 0,
        height: 0,
        check: 0,
        hasOrientationEvent: false, 
        history: []
    };
    
    D.apply(ReUI, {
        autoInit: true,
        useCompatibleFx: !isWebKit,
        registeredFx: {},
        disableFx: false,
        defaultFx: 'slide',
        rootEl: false, 
        titleEl: false,      
        backEl: false, 
        hashPrefix: '#_',
        backText: 'Back',               
        checkStateEvery: 250,
        prioritizeLocation: false,         

        init: function() {
            if (context.initialized) 
                return;

            context.initialized = true;

            R.rootEl = R.rootEl || document.body;            
            R.backEl = R.backEl || D.get('backButton');
            R.titleEl = R.titleEl || D.get('pageTitle');

            var selectedEl, hashEl;
            var el = R.rootEl.firstChild;            
            for (; el; el = el.nextSibling)
                if (el.nodeType == 1 && el.getAttribute('selected') == 'true')
                    selectedEl = el;

            if (location.hash)
            {
                hashEl = getPageFromHash(location.hash);
            }           

            if (R.prioritizeLocation)
            {
                if (hashEl)
                {
                    if (selectedEl) D.unselect(selectedEl);                    

                    R.show(hashEl);
                }
                else if (selectedEl)
                {
                    R.show(selectedEl);
                }
            }
            else
            {
                if (selectedEl)
                {
                    R.show(selectedEl);
                }
                else if (hashEl)
                {
                    R.show(hashEl);
                }
            }
            
            if (typeof window.onorientationchange === 'object')
            {
                window.onorientationchange = orientationChanged;

                context.hasOrientationEvent = true;    
                
                D.wait(orientationChanged, 0);
            }

            D.wait(checkOrientationAndLocation, 0);

            context.check = D.timer(checkOrientationAndLocation, R.checkStateEvery);

            D.bind(R.rootEl, 'click', onRootClick);
        },

        registerFx: function(name, compatible, fn) {
            if (typeof compatible === 'function')
            {
                fn = compatible;
                compatible = false;
            }

            if (compatible)
                R.registeredFx[name + 'Compatible'] = fn;
            else
                R.registeredFx[name] = fn;
        },

        getCurrentPage: function() {
            return context.page;
        },

        getCurrentDialog: function() {
            return context.dialog;
        },

        back: function() {
            history.go(-1);
        },
        
        /// <summary>
        /// Available Options:
        ///     horizontal: True if the transition is horizontal, False otherwise.
        ///     reverse: True if the transition is a reverse transition (right/down), False otherwise.
        ///     track: False if the transition should not be tracked in history, True otherwise.
        ///     update: False if the transition should not update title and back button, True otherwise.
        /// </summary>
        show: function(page, o) {
            if (context.transitioning) return; /* todo: should we queue the transition? */

            if (typeof page === 'string') page = D.get(page);          

            var o = D.apply({
                reverse: false
            }, o);

            if (o.track !== false)
            {
                var index = context.history.indexOf(page.id);
                if (index != -1)
                {
                    o.reverse = true;
                    context.history.splice(index);
                }
            }

            if (context.dialog)
            {
                D.unselect(context.dialog);                
                D.dispatch(context.dialog, 'blur', false);

                context.dialog = false;
            }  

            if (D.hasClass(page, 'dialog'))
            {
                D.dispatch(page, 'focus', false);

                context.dialog = page;

                D.select(page);
            }
            else
            {
                D.dispatch(page, 'load', false);

                var from = context.page;

                if (context.page) D.dispatch(context.page, 'blur', false);

                context.page = page;

                D.dispatch(page, 'focus', false);

                if (from)
                {
                    if (o.reverse) D.dispatch(context.page, 'unload', false);

                    D.wait(transition, 0, from, page, o);
                }       
                else
                {   
                    D.select(page);
                                     
                    transitionComplete(page, o);
                }
            }
        }                    
    });

    D.bind(window, 'load', function(evt) {
        if (R.autoInit)
            R.init();
    });
})();

(function() {
    var R = ReUI,
        D = ReUI.DomHelper;

    R.registerFx('slide', function(from, to, dir, fn) {              
        var toStart = {value: '0%', axis: 'X'};
        var fromStop = {value: '0%', axis: 'X'};            

        switch (dir) 
        {
            case 'l': 
                toStart.value = (window.innerWidth) + 'px';
                toStart.axis = 'X';
                fromStop.value = '-100%';
                fromStop.axis = 'X';
                break;
            case 'r':
                toStart.value = (-1 * window.innerWidth) + 'px';
                toStart.axis = 'X';
                fromStop.value = '100%';
                fromStop.axis = 'X';
                break;
            case 'u':
                toStart.value = (window.innerHeight) + 'px';
                toStart.axis = 'Y';
                fromStop.value = '-100%';
                fromStop.axis = 'Y';
                break;
            case 'd':
                toStart.value = (-1 * window.innerHeight) + 'px';
                toStart.axis = 'Y';
                fromStop.value = '100%';
                fromStop.axis = 'Y';
                break;
        };
      
        D.applyStyle(to, {
            'webkitTransitionDuration': '0ms',
            'webkitTransitionProperty': '-webkit-transform',
            'webkitTransform': 'translate' + toStart.axis + '(' + toStart.value + ')'
        });
            
        D.select(to);

        D.applyStyle(to, {
            'webkitTransitionDuration': 'inherit'
        });
                
        D.applyStyle(from, {
            'webkitTransitionDuration': 'inherit',
            'webkitTransitionProperty': '-webkit-transform'
        });

        function complete() {
            D.unbind(from, 'webkitTransitionEnd', complete, false);

            D.applyStyle(to, {
                'webkitTransitionProperty': 'inherit'
            }); 
            
            D.applyStyle(from, {
                'webkitTransitionProperty': 'inherit'
            });

            if (D.hasClass(to, 'dialog') == false) D.unselect(from);  
     
            if (typeof fn === 'function') fn();
        };
            
        D.bind(from, 'webkitTransitionEnd', complete, false);            
        D.wait(function() {            
            D.applyStyle(from, {
                'webkitTransform': 'translate' + fromStop.axis + '(' + fromStop.value + ')'
            });

            D.applyStyle(to, {
                'webkitTransform': 'translate' + toStart.axis + '(0%)'
            });
        }, 0);            
    });

    R.registerFx('slide', true, function(from, to, dir, fn) {        
        var toData = {prop: 'left', dir: 1, value: 0},
            fromData = {prop: 'left', dir: 1, value: 0};            

        switch (dir) 
        {
            case 'l':
                toData.prop = 'left';
                toData.dir = -1;
                toData.value = 100;
                fromData.prop = 'left';
                fromData.dir = -1;
                fromData.value = 0;
                break;
            case 'r':
                toData.prop = 'right';
                toData.dir = -1;
                toData.value = 100;
                fromData.prop = 'right';
                fromData.dir = -1;
                fromData.value = 0;
                break;
            case 'u':
                toData.prop = 'top';
                toData.dir = -1;
                toData.value = 100;
                fromData.prop = 'top';
                fromData.dir = -1;
                fromData.value = 0;
                break;
            case 'd':
                toData.prop = 'bottom';
                toData.dir = -1;
                toData.value = 100;
                fromData.prop = 'bottom';
                fromData.dir = -1;
                fromData.value = 0;
                break;
        };

        var speed = R.stepSpeed || 10,
            interval = R.stepInterval || 0,
            frames = 100 / speed,
            count = 1;
        
        step();

        D.select(to);
        
        var timer = D.timer(step, interval);    

        function step() {            
            var toStyle = {},
                fromStyle = {};

            if (count > frames)
            {
                D.clearTimer(timer);
                
                if (D.hasClass(to, 'dialog') == false) D.unselect(from); 

                toStyle[toData.prop] = 'inherit';                
                fromStyle[fromData.prop] = 'inherit';

                D.applyStyle(to, toStyle);
                D.applyStyle(from, fromStyle);

                if (typeof fn === 'function') fn();

                return;
            }            

            toStyle[toData.prop] = toData.value + (toData.dir * (count * speed)) + '%';
            fromStyle[fromData.prop] = fromData.value + (fromData.dir * (count * speed)) + '%';

            D.applyStyle(to, toStyle);
            D.applyStyle(from, fromStyle);
            
            count++;
        };           
    });

    R.registerFx('flip', function(from, to, dir, fn) {             
        var toStart = {value: '0deg', axis: 'Y'};
        var fromStop = {value: '0deg', axis: 'Y'};            

        switch (dir) 
        {
            case 'l': 
                toStart.value = '-180deg';
                toStart.axis = 'Y';
                fromStop.value = '180deg';
                fromStop.axis = 'Y';
                break;
            case 'r':
                toStart.value = '180deg';
                toStart.axis = 'Y';
                fromStop.value = '-180deg';
                fromStop.axis = 'Y';
                break; 
            case 'u': 
                toStart.value = '-180deg';
                toStart.axis = 'X';
                fromStop.value = '180deg';
                fromStop.axis = 'X';
                break;
            case 'd':
                    toStart.value = '180deg';
                toStart.axis = 'X';
                fromStop.value = '-180deg';
                fromStop.axis = 'X';
                break;                 
        };
        
        D.applyStyle(to, {
            'webkitTransitionDuration': '0ms',
            'webkitTransitionProperty': '-webkit-transform',
            'webkitTransform': 'rotate' + toStart.axis + '(' + toStart.value + ')',
            'webkitTransformStyle': 'preserve-3d',
            'webkitBackfaceVisibility': 'hidden'
        });                   
            
        D.select(to);

        D.applyStyle(to, {
            'webkitTransitionDuration': 'inherit'
        });

        D.applyStyle(from, {
            'webkitTransitionDuration': 'inherit',
            'webkitTransitionProperty': '-webkit-transform',
            'webkitTransformStyle': 'preserve-3d',
            'webkitBackfaceVisibility': 'hidden'
        });

        function complete() {
            D.unbind(from, 'webkitTransitionEnd', complete, false);

            D.applyStyle(to, {
                'webkitTransitionProperty': 'inherit'
            });
            
            D.applyStyle(from, {
                'webkitTransitionProperty': 'inherit'
            });
     
            if (D.hasClass(to, 'dialog') == false) D.unselect(from); 
                
            if (typeof fn === 'function') fn();
        };
            
        D.bind(from, 'webkitTransitionEnd', complete, false);            
        D.wait(function() {
            D.applyStyle(from, {
                'webkitTransform': 'rotate' + fromStop.axis + '(' + fromStop.value + ')'
            });
          
            D.applyStyle(to, {
                'webkitTransform': 'rotate' + toStart.axis + '(0deg)'
            });
        }, 0);     
    });
})();

/**
 * Version: 1.0 Alpha-1 
 * Build Date: 12-Nov-2007
 * Copyright (c) 2006-2007, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * Website: http://www.datejs.com/ or http://www.coolite.com/datejs/
 */

/**
 * Gets the month number (0-11) if given a Culture Info specific string which is a valid monthName or abbreviatedMonthName.
 * @param {String}   The name of the month (eg. "February, "Feb", "october", "oct").
 * @return {Number}  The day number
 */
Date.getMonthNumberFromName = function (name) {
    var n = Date.CultureInfo.monthNames, m = Date.CultureInfo.abbreviatedMonthNames, s = name.toLowerCase();
    for (var i = 0; i < n.length; i++) {
        if (n[i].toLowerCase() == s || m[i].toLowerCase() == s) { 
            return i; 
        }
    }
    return -1;
};

/**
 * Gets the day number (0-6) if given a CultureInfo specific string which is a valid dayName, abbreviatedDayName or shortestDayName (two char).
 * @param {String}   The name of the day (eg. "Monday, "Mon", "tuesday", "tue", "We", "we").
 * @return {Number}  The day number
 */
Date.getDayNumberFromName = function (name) {
    var n = Date.CultureInfo.dayNames, m = Date.CultureInfo.abbreviatedDayNames, o = Date.CultureInfo.shortestDayNames, s = name.toLowerCase();
    for (var i = 0; i < n.length; i++) { 
        if (n[i].toLowerCase() == s || m[i].toLowerCase() == s) { 
            return i; 
        }
    }
    return -1;  
};

/**
 * Determines if the current date instance is within a LeapYear.
 * @param {Number}   The year (0-9999).
 * @return {Boolean} true if date is within a LeapYear, otherwise false.
 */
Date.isLeapYear = function (year) { 
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
};

/**
 * Gets the number of days in the month, given a year and month value. Automatically corrects for LeapYear.
 * @param {Number}   The year (0-9999).
 * @param {Number}   The month (0-11).
 * @return {Number}  The number of days in the month.
 */
Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.getTimezoneOffset = function (s, dst) {
    return (dst || false) ? Date.CultureInfo.abbreviatedTimeZoneDST[s.toUpperCase()] :
        Date.CultureInfo.abbreviatedTimeZoneStandard[s.toUpperCase()];
};

Date.getTimezoneAbbreviation = function (offset, dst) {
    var n = (dst || false) ? Date.CultureInfo.abbreviatedTimeZoneDST : Date.CultureInfo.abbreviatedTimeZoneStandard, p;
    for (p in n) { 
        if (n[p] === offset) { 
            return p; 
        }
    }
    return null;
};

/**
 * Returns a new Date object that is an exact date and time copy of the original instance.
 * @return {Date}    A new Date instance
 */
Date.prototype.clone = function () {
    return new Date(this.getTime()); 
};

/**
 * Compares this instance to a Date object and return an number indication of their relative values.  
 * @param {Date}     Date object to compare [Required]
 * @return {Number}  1 = this is greaterthan date. -1 = this is lessthan date. 0 = values are equal
 */
Date.prototype.compareTo = function (date) {
    if (isNaN(this)) { 
        throw new Error(this); 
    }
    if (date instanceof Date && !isNaN(date)) {
        return (this > date) ? 1 : (this < date) ? -1 : 0;
    } else { 
        throw new TypeError(date); 
    }
};

/**
 * Compares this instance to another Date object and returns true if they are equal.  
 * @param {Date}     Date object to compare [Required]
 * @return {Boolean} true if dates are equal. false if they are not equal.
 */
Date.prototype.equals = function (date) { 
    return (this.compareTo(date) === 0); 
};

/**
 * Determines is this instance is between a range of two dates or equal to either the start or end dates.
 * @param {Date}     Start of range [Required]
 * @param {Date}     End of range [Required]
 * @return {Boolean} true is this is between or equal to the start and end dates, else false
 */
Date.prototype.between = function (start, end) {
    var t = this.getTime();
    return t >= start.getTime() && t <= end.getTime();
};

/**
 * Adds the specified number of milliseconds to this instance. 
 * @param {Number}   The number of milliseconds to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addMilliseconds = function (value) {
    this.setMilliseconds(this.getMilliseconds() + value);
    return this;
};

/**
 * Adds the specified number of seconds to this instance. 
 * @param {Number}   The number of seconds to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addSeconds = function (value) { 
    return this.addMilliseconds(value * 1000); 
};

/**
 * Adds the specified number of seconds to this instance. 
 * @param {Number}   The number of seconds to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addMinutes = function (value) { 
    return this.addMilliseconds(value * 60000); /* 60*1000 */
};

/**
 * Adds the specified number of hours to this instance. 
 * @param {Number}   The number of hours to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addHours = function (value) { 
    return this.addMilliseconds(value * 3600000); /* 60*60*1000 */
};

/**
 * Adds the specified number of days to this instance. 
 * @param {Number}   The number of days to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addDays = function (value) { 
    return this.addMilliseconds(value * 86400000); /* 60*60*24*1000 */
};

/**
 * Adds the specified number of weeks to this instance. 
 * @param {Number}   The number of weeks to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addWeeks = function (value) { 
    return this.addMilliseconds(value * 604800000); /* 60*60*24*7*1000 */
};

/**
 * Adds the specified number of months to this instance. 
 * @param {Number}   The number of months to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};

/**
 * Adds the specified number of years to this instance. 
 * @param {Number}   The number of years to add. The number can be positive or negative [Required]
 * @return {Date}    this
 */
Date.prototype.addYears = function (value) {
    return this.addMonths(value * 12);
};

/**
 * Adds (or subtracts) to the value of the year, month, day, hour, minute, second, millisecond of the date instance using given configuration object. Positive and Negative values allowed.
 * Example
<pre><code>
Date.today().add( { day: 1, month: 1 } )
 
new Date().add( { year: -1 } )
</code></pre> 
 * @param {Object}   Configuration object containing attributes (month, day, etc.)
 * @return {Date}    this
 */
Date.prototype.add = function (config) {
    if (typeof config == "number") {
        this._orient = config;
        return this;    
    }
    var x = config;
    if (x.millisecond || x.milliseconds) { 
        this.addMilliseconds(x.millisecond || x.milliseconds); 
    }
    if (x.second || x.seconds) { 
        this.addSeconds(x.second || x.seconds); 
    }
    if (x.minute || x.minutes) { 
        this.addMinutes(x.minute || x.minutes); 
    }
    if (x.hour || x.hours) { 
        this.addHours(x.hour || x.hours); 
    }
    if (x.month || x.months) { 
        this.addMonths(x.month || x.months); 
    }
    if (x.year || x.years) { 
        this.addYears(x.year || x.years); 
    }
    if (x.day || x.days) {
        this.addDays(x.day || x.days); 
    }
    return this;
};

// private
Date._validate = function (value, min, max, name) {
    if (typeof value != "number") {
        throw new TypeError(value + " is not a Number."); 
    } else if (value < min || value > max) {
        throw new RangeError(value + " is not a valid value for " + name + "."); 
    }
    return true;
};

/**
 * Validates the number is within an acceptable range for milliseconds [0-999].
 * @param {Number}   The number to check if within range.
 * @return {Boolean} true if within range, otherwise false.
 */
Date.validateMillisecond = function (n) {
    return Date._validate(n, 0, 999, "milliseconds");
};

/**
 * Validates the number is within an acceptable range for seconds [0-59].
 * @param {Number}   The number to check if within range.
 * @return {Boolean} true if within range, otherwise false.
 */
Date.validateSecond = function (n) {
    return Date._validate(n, 0, 59, "seconds");
};

/**
 * Validates the number is within an acceptable range for minutes [0-59].
 * @param {Number}   The number to check if within range.
 * @return {Boolean} true if within range, otherwise false.
 */
Date.validateMinute = function (n) {
    return Date._validate(n, 0, 59, "minutes");
};

/**
 * Validates the number is within an acceptable range for hours [0-23].
 * @param {Number}   The number to check if within range.
 * @return {Boolean} true if within range, otherwise false.
 */
Date.validateHour = function (n) {
    return Date._validate(n, 0, 23, "hours");
};

/**
 * Validates the number is within an acceptable range for the days in a month [0-MaxDaysInMonth].
 * @param {Number}   The number to check if within range.
 * @return {Boolean} true if within range, otherwise false.
 */
Date.validateDay = function (n, year, month) {
    return Date._validate(n, 1, Date.getDaysInMonth(year, month), "days");
};

/**
 * Validates the number is within an acceptable range for months [0-11].
 * @param {Number}   The number to check if within range.
 * @return {Boolean} true if within range, otherwise false.
 */
Date.validateMonth = function (n) {
    return Date._validate(n, 0, 11, "months");
};

/**
 * Validates the number is within an acceptable range for years [0-9999].
 * @param {Number}   The number to check if within range.
 * @return {Boolean} true if within range, otherwise false.
 */
Date.validateYear = function (n) {
    return Date._validate(n, 1, 9999, "seconds");
};

/**
 * Set the value of year, month, day, hour, minute, second, millisecond of date instance using given configuration object.
 * Example
<pre><code>
Date.today().set( { day: 20, month: 1 } )

new Date().set( { millisecond: 0 } )
</code></pre>
 * 
 * @param {Object}   Configuration object containing attributes (month, day, etc.)
 * @return {Date}    this
 */
Date.prototype.set = function (config) {
    var x = config;

    if (!x.millisecond && x.millisecond !== 0) { 
        x.millisecond = -1; 
    }
    if (!x.second && x.second !== 0) { 
        x.second = -1; 
    }
    if (!x.minute && x.minute !== 0) { 
        x.minute = -1; 
    }
    if (!x.hour && x.hour !== 0) { 
        x.hour = -1; 
    }
    if (!x.day && x.day !== 0) { 
        x.day = -1; 
    }
    if (!x.month && x.month !== 0) { 
        x.month = -1; 
    }
    if (!x.year && x.year !== 0) { 
        x.year = -1; 
    }

    if (x.millisecond != -1 && Date.validateMillisecond(x.millisecond)) {
        this.addMilliseconds(x.millisecond - this.getMilliseconds()); 
    }
    if (x.second != -1 && Date.validateSecond(x.second)) {
        this.addSeconds(x.second - this.getSeconds()); 
    }
    if (x.minute != -1 && Date.validateMinute(x.minute)) {
        this.addMinutes(x.minute - this.getMinutes()); 
    }
    if (x.hour != -1 && Date.validateHour(x.hour)) {
        this.addHours(x.hour - this.getHours()); 
    }
    if (x.month !== -1 && Date.validateMonth(x.month)) {
        this.addMonths(x.month - this.getMonth()); 
    }
    if (x.year != -1 && Date.validateYear(x.year)) {
        this.addYears(x.year - this.getFullYear()); 
    }
    
	/* day has to go last because you can't validate the day without first knowing the month */
    if (x.day != -1 && Date.validateDay(x.day, this.getFullYear(), this.getMonth())) {
        this.addDays(x.day - this.getDate()); 
    }
    if (x.timezone) { 
        this.setTimezone(x.timezone); 
    }
    if (x.timezoneOffset) { 
        this.setTimezoneOffset(x.timezoneOffset); 
    }
    
    return this;   
};

/**
 * Resets the time of this Date object to 12:00 AM (00:00), which is the start of the day.
 * @return {Date}    this
 */
Date.prototype.clearTime = function () {
    this.setHours(0); 
    this.setMinutes(0); 
    this.setSeconds(0);
    this.setMilliseconds(0); 
    return this;
};

/**
 * Determines whether or not this instance is in a leap year.
 * @return {Boolean} true if this instance is in a leap year, else false
 */
Date.prototype.isLeapYear = function () { 
    var y = this.getFullYear(); 
    return (((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0)); 
};

/**
 * Determines whether or not this instance is a weekday.
 * @return {Boolean} true if this instance is a weekday
 */
Date.prototype.isWeekday = function () { 
    return !(this.is().sat() || this.is().sun());
};

/**
 * Get the number of days in the current month, adjusted for leap year.
 * @return {Number}  The number of days in the month
 */
Date.prototype.getDaysInMonth = function () { 
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

/**
 * Moves the date to the first day of the month.
 * @return {Date}    this
 */
Date.prototype.moveToFirstDayOfMonth = function () {
    return this.set({ day: 1 });
};

/**
 * Moves the date to the last day of the month.
 * @return {Date}    this
 */
Date.prototype.moveToLastDayOfMonth = function () { 
    return this.set({ day: this.getDaysInMonth()});
};

/**
 * Move to the next or last dayOfWeek based on the orient value.
 * @param {Number}   The dayOfWeek to move to.
 * @param {Number}   Forward (+1) or Back (-1). Defaults to +1. [Optional]
 * @return {Date}    this
 */
Date.prototype.moveToDayOfWeek = function (day, orient) {
    var diff = (day - this.getDay() + 7 * (orient || +1)) % 7;
    return this.addDays((diff === 0) ? diff += 7 * (orient || +1) : diff);
};

/**
 * Move to the next or last month based on the orient value.
 * @param {Number}   The month to move to. 0 = January, 11 = December.
 * @param {Number}   Forward (+1) or Back (-1). Defaults to +1. [Optional]
 * @return {Date}    this
 */
Date.prototype.moveToMonth = function (month, orient) {
    var diff = (month - this.getMonth() + 12 * (orient || +1)) % 12;
    return this.addMonths((diff === 0) ? diff += 12 * (orient || +1) : diff);
};

/**
 * Get the numeric day number of the year, adjusted for leap year.
 * @return {Number} 0 through 364 (365 in leap years)
 */
Date.prototype.getDayOfYear = function () {
    return Math.floor((this - new Date(this.getFullYear(), 0, 1)) / 86400000);
};

/**
 * Get the week of the year for the current date instance.
 * @param {Number}   A Number that represents the first day of the week (0-6) [Optional]
 * @return {Number}  0 through 53
 */
Date.prototype.getWeekOfYear = function (firstDayOfWeek) {
    var y = this.getFullYear(), m = this.getMonth(), d = this.getDate();
    
    var dow = firstDayOfWeek || Date.CultureInfo.firstDayOfWeek;
	
    var offset = 7 + 1 - new Date(y, 0, 1).getDay();
    if (offset == 8) {
        offset = 1;
    }
    var daynum = ((Date.UTC(y, m, d, 0, 0, 0) - Date.UTC(y, 0, 1, 0, 0, 0)) / 86400000) + 1;
    var w = Math.floor((daynum - offset + 7) / 7);
    if (w === dow) {
        y--;
        var prevOffset = 7 + 1 - new Date(y, 0, 1).getDay();
        if (prevOffset == 2 || prevOffset == 8) { 
            w = 53; 
        } else { 
            w = 52; 
        }
    }
    return w;
};

/**
 * Determine whether Daylight Saving Time (DST) is in effect
 * @return {Boolean} True if DST is in effect.
 */
Date.prototype.isDST = function () {
    console.log('isDST');
    /* TODO: not sure if this is portable ... get from Date.CultureInfo? */
    return this.toString().match(/(E|C|M|P)(S|D)T/)[2] == "D";
};

/**
 * Get the timezone abbreviation of the current date.
 * @return {String} The abbreviated timezone name (e.g. "EST")
 */
Date.prototype.getTimezone = function () {
    return Date.getTimezoneAbbreviation(this.getUTCOffset, this.isDST());
};

Date.prototype.setTimezoneOffset = function (s) {
    var here = this.getTimezoneOffset(), there = Number(s) * -6 / 10;
    this.addMinutes(there - here); 
    return this;
};

Date.prototype.setTimezone = function (s) { 
    return this.setTimezoneOffset(Date.getTimezoneOffset(s)); 
};

/**
 * Get the offset from UTC of the current date.
 * @return {String} The 4-character offset string prefixed with + or - (e.g. "-0500")
 */
Date.prototype.getUTCOffset = function () {
    var n = this.getTimezoneOffset() * -10 / 6, r;
    if (n < 0) { 
        r = (n - 10000).toString(); 
        return r[0] + r.substr(2); 
    } else { 
        r = (n + 10000).toString();  
        return "+" + r.substr(1); 
    }
};

/**
 * Gets the name of the day of the week.
 * @param {Boolean}  true to return the abbreviated name of the day of the week
 * @return {String}  The name of the day
 */
Date.prototype.getDayName = function (abbrev) {
    return abbrev ? Date.CultureInfo.abbreviatedDayNames[this.getDay()] : 
        Date.CultureInfo.dayNames[this.getDay()];
};

/**
 * Gets the month name.
 * @param {Boolean}  true to return the abbreviated name of the month
 * @return {String}  The name of the month
 */
Date.prototype.getMonthName = function (abbrev) {
    return abbrev ? Date.CultureInfo.abbreviatedMonthNames[this.getMonth()] : 
        Date.CultureInfo.monthNames[this.getMonth()];
};

// private
Date.prototype._toString = Date.prototype.toString;

/**
 * Converts the value of the current Date object to its equivalent string representation.
 * Format Specifiers
<pre>
Format  Description                                                                  Example
------  ---------------------------------------------------------------------------  -----------------------
 s      The seconds of the minute between 1-59.                                      "1" to "59"
 ss     The seconds of the minute with leading zero if required.                     "01" to "59"
 
 m      The minute of the hour between 0-59.                                         "1"  or "59"
 mm     The minute of the hour with leading zero if required.                        "01" or "59"
 
 h      The hour of the day between 1-12.                                            "1"  to "12"
 hh     The hour of the day with leading zero if required.                           "01" to "12"
 
 H      The hour of the day between 1-23.                                            "1"  to "23"
 HH     The hour of the day with leading zero if required.                           "01" to "23"
 
 d      The day of the month between 1 and 31.                                       "1"  to "31"
 dd     The day of the month with leading zero if required.                          "01" to "31"
 ddd    Abbreviated day name. Date.CultureInfo.abbreviatedDayNames.                  "Mon" to "Sun" 
 dddd   The full day name. Date.CultureInfo.dayNames.                                "Monday" to "Sunday"
 
 M      The month of the year between 1-12.                                          "1" to "12"
 MM     The month of the year with leading zero if required.                         "01" to "12"
 MMM    Abbreviated month name. Date.CultureInfo.abbreviatedMonthNames.              "Jan" to "Dec"
 MMMM   The full month name. Date.CultureInfo.monthNames.                            "January" to "December"

 yy     Displays the year as a maximum two-digit number.                             "99" or "07"
 yyyy   Displays the full four digit year.                                           "1999" or "2007"
 
 t      Displays the first character of the A.M./P.M. designator.                    "A" or "P"
        Date.CultureInfo.amDesignator or Date.CultureInfo.pmDesignator
 tt     Displays the A.M./P.M. designator.                                           "AM" or "PM"
        Date.CultureInfo.amDesignator or Date.CultureInfo.pmDesignator
</pre>
 * @param {String}   A format string consisting of one or more format spcifiers [Optional].
 * @return {String}  A string representation of the current Date object.
 */
Date.prototype.toString = function (format) {
    var self = this;

    var p = function p(s) {
        return (s.toString().length == 1) ? "0" + s : s;
    };

    return format ? format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g, 
    function (format) {
        switch (format) {
        case "hh":
            return p(self.getHours() < 13 ? self.getHours() : (self.getHours() - 12));
        case "h":
            return self.getHours() < 13 ? self.getHours() : (self.getHours() - 12);
        case "HH":
            return p(self.getHours());
        case "H":
            return self.getHours();
        case "mm":
            return p(self.getMinutes());
        case "m":
            return self.getMinutes();
        case "ss":
            return p(self.getSeconds());
        case "s":
            return self.getSeconds();
        case "yyyy":
            return self.getFullYear();
        case "yy":
            return self.getFullYear().toString().substring(2, 4);
        case "dddd":
            return self.getDayName();
        case "ddd":
            return self.getDayName(true);
        case "dd":
            return p(self.getDate());
        case "d":
            return self.getDate().toString();
        case "MMMM":
            return self.getMonthName();
        case "MMM":
            return self.getMonthName(true);
        case "MM":
            return p((self.getMonth() + 1));
        case "M":
            return self.getMonth() + 1;
        case "t":
            return self.getHours() < 12 ? Date.CultureInfo.amDesignator.substring(0, 1) : Date.CultureInfo.pmDesignator.substring(0, 1);
        case "tt":
            return self.getHours() < 12 ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
        case "zzz":
        case "zz":
        case "z":
            return "";
        }
    }
    ) : this._toString();
};