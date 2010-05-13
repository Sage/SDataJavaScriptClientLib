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
            'var __r = [], $ = __v || {}, __s = Simplate; __p = function() { __r.push.apply(__r, arguments); };',
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
})();/*
   Copyright (c) 2007-9, iUI Project Members
   See LICENSE.txt for licensing terms
   Version 0.40-dev2

   This is a modified version of iUI v0.40-dev2.  It includes additional features and bug fixes required by
   the SData Mobile Application Framework.
 */


(function() {

var slideSpeed = 20;
var slideInterval = 0;

var currentPage = null;
var currentDialog = null;
var currentWidth = 0;
var currentHeight = 0;
var currentHash = location.hash;
var hashPrefix = "#_";
var pageHistory = [];
var newPageCount = 0;
var checkTimer;
var hasOrientationEvent = false;
var portraitVal = "portrait";
var landscapeVal = "landscape";

// *************************************************************************************************

window.iui =
{
	animOn: true,	// Slide animation with CSS transition is now enabled by default where supported

    delayInit: false,

	httpHeaders: {
	    "X-Requested-With" : "XMLHttpRequest"
	},

    getCurrentPage: function() {
        return currentPage;
    }, 

    getPreviousPage: function() {
        if (pageHistory.length > 2)
        {
            return  $(pageHistory[pageHistory.length - 2]); /* top is -1, prev is -2 */
        }
        return null;
    },

    getCurrentDialog: function() {
        return currentDialog;
    },

	showPage: function(page, backwards)
	{
		if (page)
		{
//			if (window.iui_ext)	window.iui_ext.injectEventMethods(page);	// TG
			
			if (currentDialog)
			{
				currentDialog.removeAttribute("selected");
				// EVENT blur->currentDialog
				sendEvent("blur", currentDialog);
				currentDialog = null;
			}

			if (hasClass(page, "dialog"))
			{
			    // EVENT focus->page
				sendEvent("focus", page);
				showDialog(page);
			}
			else
			{
				sendEvent("load", page);    // 127(stylesheet), 128(script), 129(onload)
			                                    // 130(onFocus), 133(loadActionButton)
				var fromPage = currentPage;
				// EVENT blur->currentPage
				sendEvent("blur", currentPage);
				currentPage = page;
				// EVENT focus->currentPage
				sendEvent("focus", page);

				if (fromPage)
				{
				    if (backwards) sendEvent("unload", fromPage);
					setTimeout(slidePages, 0, fromPage, page, backwards);
				}
				else
				{
					updatePage(page, fromPage);
				}
					
			}
		}
	},

	showPageById: function(pageId)
	{
		var page = $(pageId);
		if (page)
		{
			var index = pageHistory.indexOf(pageId);
			var backwards = index != -1;
			if (backwards)
			{
				// we're going back, remove history from index on
				// remember - pageId will be added again in updatePage
				pageHistory.splice(index);
			}

			iui.showPage(page, backwards);
		}
	},
	
	goBack: function()
	{
		pageHistory.pop();	// pop current page
		var pageID = pageHistory.pop();  // pop/get parent
		var page = $(pageID);
		iui.showPage(page, true);
	},

	showPageByHref: function(href, args, method, replace, cb)
	{
	  // I don't think we need onerror, because readstate will still go to 4 in that case
	  function spbhCB(xhr) 
	  {
		if (xhr.readyState == 4)
		{
		  // Add 'if (xhr.responseText)' to make sure we have something???
		  var frag = document.createElement("div");
		  frag.innerHTML = xhr.responseText;
          // EVENT beforeInsert->body
          sendEvent("beforeinsert", document.body, {fragment:frag})
          if (replace)
		  {
			  replaceElementWithFrag(replace, frag);
		  }
		  else
		  {
			  iui.insertPages(frag);
		  }
		  if (cb)
			setTimeout(cb, 1000, true);
		}
	  };
	  iui.ajax(href, args, method, spbhCB);
	},
	
	// Callback function gets a single argument, the XHR
	ajax: function(url, args, method, cb)
	{
        var xhr = new XMLHttpRequest();
        method = method ? method.toUpperCase() : "GET";
        if (args && method == "GET")
        {
          url =  url + "?" + iui.param(args);
        }
        xhr.open(method, url, true);
        if (cb)
        {
        xhr.onreadystatechange = function() { cb(xhr); };
        }
        var data = null;
        if (args && method != "GET")
        {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            data = iui.param(args);
        }
        for (var header in iui.httpHeaders)
        {
            xhr.setRequestHeader(header, iui.httpHeaders[header]);
        }
        xhr.send(data);
	},
	
	// Thanks, jQuery
	//	stripped-down, simplified, object-only version
	param: function( o )
	{
	  var s = [ ];
	
	  // Serialize the key/values
	  for ( var key in o )
		s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(o[key]);
  
	  // Return the resulting serialization
	  return s.join("&").replace(/%20/g, "+");
	},

	insertPages: function(frag)
	{
		var nodes = frag.childNodes;
		var targetPage;
		for (var i = 0; i < nodes.length; ++i)
		{
			var child = nodes[i];
			if (child.nodeType == 1)
			{
				if (!child.id)
					child.id = "__" + (++newPageCount) + "__";

				var clone = $(child.id);
				var docNode;
				if (clone) {
					clone.parentNode.replaceChild(child, clone);
				    docNode = $(child.id);
			    }
				else
					docNode = document.body.appendChild(child);
					
				sendEvent("afterinsert", document.body, {insertedNode:docNode});   


				if (child.getAttribute("selected") == "true" || !targetPage)
					targetPage = child;
				
				--i;
			}
		}
		if (targetPage)
			iui.showPage(targetPage);

	},

	getSelectedPage: function()
	{
		for (var child = document.body.firstChild; child; child = child.nextSibling)
		{
			if (child.nodeType == 1 && child.getAttribute("selected") == "true")
				return child;
		}	 
	},
	isNativeUrl: function(href)
	{
		for(var i = 0; i < iui.nativeUrlPatterns.length; i++)
		{
			if(href.match(iui.nativeUrlPatterns[i])) return true;
		}
		return false;
	},
	nativeUrlPatterns: [
		new RegExp("^http:\/\/maps.google.com\/maps\?"),
		new RegExp("^mailto:"),
		new RegExp("^tel:"),
		new RegExp("^http:\/\/www.youtube.com\/watch\\?v="),
		new RegExp("^http:\/\/www.youtube.com\/v\/"),
		new RegExp("^javascript:"),

	],
	hasClass: function(self, name)
	{
		var re = new RegExp("(^|\\s)"+name+"($|\\s)");
		return re.exec(self.getAttribute("class")) != null;
	},
		
	addClass: function(self, name)
	{
	  if (!iui.hasClass(self,name)) self.className += " "+name;
	},
		
	removeClass: function(self, name)
	{
	  if (iui.hasClass(self,name)) {
		  var reg = new RegExp('(\\s|^)'+name+'(\\s|$)');
		self.className=self.className.replace(reg,' ');
	  }
	},

    init: function() {
        var page = iui.getSelectedPage();
	    var locPage = getPageFromLoc();    
		
	    if (page)
			    iui.showPage(page);
	
	    if (locPage && (locPage != page))
		    iui.showPage(locPage);
	
	    setTimeout(preloadImages, 0);
	    if (typeof window.onorientationchange == "object")
	    {
		    window.onorientationchange=orientChangeHandler;
		    hasOrientationEvent = true;
		    setTimeout(orientChangeHandler, 0);
	    }
	    setTimeout(checkOrientAndLocation, 0);
	    checkTimer = setInterval(checkOrientAndLocation, 300);
    }
};

// *************************************************************************************************

addEventListener("load", function(event)
{
    if (!iui.delayInit) iui.init();
}, false);

addEventListener("unload", function(event)
{
	return;
}, false);
	
addEventListener("click", function(event)
{
	var link = findParent(event.target, "a");
	if (link)
	{
		function unselect() { link.removeAttribute("selected"); }
		
		if (link.href && link.hash && link.hash != "#" && !link.target)
		{
			link.setAttribute("selected", "true");
			iui.showPage($(link.hash.substr(1)));
			setTimeout(unselect, 500);
		}
		else if (link == $("backButton"))
		{
			iui.goBack();
		}
		else if (link.getAttribute("type") == "submit")
		{
			var form = findParent(link, "form");
			if (form.target == "_self")
			{
			    form.submit();
			    return;  // allow default
			}
			submitForm(form);
		}
		else if (link.getAttribute("type") == "cancel")
		{
			cancelDialog(findParent(link, "form"));
		}
		else if (link.target == "_replace")
		{
			link.setAttribute("selected", "progress");
			iui.showPageByHref(link.href, null, "GET", link, unselect);
		}
		else if (iui.isNativeUrl(link.href))
		{
			return;
		}
		else if (link.target == "_webapp")
		{
			location.href = link.href;
		}
		else if (!link.target)
		{
			link.setAttribute("selected", "progress");
			iui.showPageByHref(link.href, null, "GET", null, unselect);
		}
		else
			return;
		
		event.preventDefault();		   
	}
}, true);

addEventListener("click", function(event)
{
	var div = findParent(event.target, "div");
	if (div && hasClass(div, "toggle"))
	{
		div.setAttribute("toggled", div.getAttribute("toggled") != "true");
		event.preventDefault();		   
	}
}, true);


function sendEvent(type, node, props, bubble, cancel)
{
    if (node)
    {
        var event = document.createEvent("UIEvent");
        event.initEvent(type, bubble || false, cancel || false);  // no bubble, no cancel
        if (props)
        {
            for (i in props)
            {
                event[i] = props[i];
            }
        }
        node.dispatchEvent(event);
    }
}

function getPageFromLoc()
{
	var page;
	var result = location.hash.match(/#_([^\?_]+)/);
	if (result)
		page = result[1];
	if (page)
		page = $(page);
	return page;
}

function orientChangeHandler()
{
	var orientation=window.orientation;
	switch(orientation)
	{
	case 0:
		setOrientation(portraitVal);
		break;	
		
	case 90:
	case -90: 
		setOrientation(landscapeVal);
		break;
	}
}


function checkOrientAndLocation()
{
	if (!hasOrientationEvent)
	{
	  if ((window.innerWidth != currentWidth) || (window.innerHeight != currentHeight))
	  {	  
		  currentWidth = window.innerWidth;
		  currentHeight = window.innerHeight;
		  var orient = (currentWidth < currentHeight) ? portraitVal : landscapeVal;
		  setOrientation(orient);
	  }
	}

	if (location.hash != currentHash)
	{
		var pageId = location.hash.substr(hashPrefix.length);
		iui.showPageById(pageId);
	}
}

function setOrientation(orient)
{
	document.body.setAttribute("orient", orient);
//  Set class in addition to orient attribute:
	if (orient == portraitVal)
	{
		iui.removeClass(document.body, landscapeVal);
		iui.addClass(document.body, portraitVal);
	}
	else if (orient == landscapeVal)
	{
		iui.removeClass(document.body, portraitVal);
		iui.addClass(document.body, landscapeVal);
	}
	else
	{
		iui.removeClass(document.body, portraitVal);
		iui.removeClass(document.body, landscapeVal);
	}
	setTimeout(scrollTo, 100, 0, 1);
}

function showDialog(page)
{
	currentDialog = page;
	page.setAttribute("selected", "true");
	
	if (hasClass(page, "dialog"))
		showForm(page);
}

function showForm(form)
{
    
    // sage: only bind to onsubmit when there is no onsubmit
    if (typeof form.onsubmit === 'undefined')
	    form.onsubmit = function(event)
	    {
            //  submitForm and preventDefault are called in the click handler
            //  when the user clicks the submit a.button
            // 
		    event.preventDefault();
		    submitForm(form);
	    };
	
	//form.onclick = function(event)
	//{
        // Why is this code needed?  cancelDialog is called from
        // the click hander.  When will this be called?

        // removed: sage        
		//if (event.target == form && hasClass(form, "dialog"))
		//	cancelDialog(form);
	//};
}

function cancelDialog(form)
{
	form.removeAttribute("selected");
}

function updatePage(page, fromPage)
{
	if (!page.id)
		page.id = "__" + (++newPageCount) + "__";

	location.hash = currentHash = hashPrefix + page.id;
	pageHistory.push(page.id);

	var pageTitle = $("pageTitle");
	if (page.title)
		pageTitle.innerHTML = page.title;
	var ttlClass = page.getAttribute("ttlclass");
	pageTitle.className = ttlClass ? ttlClass : "";

	if (page.localName.toLowerCase() == "form" && !page.target)
		showForm(page);
		
	var backButton = $("backButton");
	if (backButton)
	{
		var prevPage = $(pageHistory[pageHistory.length-2]);
		if (prevPage && !page.getAttribute("hideBackButton"))
		{
			backButton.style.display = "inline";
			backButton.innerHTML = prevPage.title ? prevPage.title : "Back";
			var bbClass = prevPage.getAttribute("bbclass");
			backButton.className = (bbClass) ? 'button ' + bbClass : 'button';
		}
		else
			backButton.style.display = "none";
	}	 
}

function slidePages(fromPage, toPage, backwards)
{		 
	var axis = (backwards ? fromPage : toPage).getAttribute("axis");

	clearInterval(checkTimer);
	
	sendEvent("beforetransition", fromPage, {out:true}, true);
	sendEvent("beforetransition", toPage, {out:false}, true);
	if (canDoSlideAnim() && axis != 'y')
	{
	  slide2(fromPage, toPage, backwards, slideDone);
	}
	else
	{
	  slide1(fromPage, toPage, backwards, axis, slideDone);
	}

	function slideDone()
	{
	  if (!hasClass(toPage, "dialog"))
		  fromPage.removeAttribute("selected");
	  checkTimer = setInterval(checkOrientAndLocation, 300);
	  setTimeout(updatePage, 0, toPage, fromPage);
	  fromPage.removeEventListener('webkitTransitionEnd', slideDone, false);
	  sendEvent("aftertransition", fromPage, {out:true}, true);
      sendEvent("aftertransition", toPage, {out:false}, true);

	}
}

function canDoSlideAnim()
{
  return (iui.animOn) && (typeof WebKitCSSMatrix == "object");
}

function slide1(fromPage, toPage, backwards, axis, cb)
{
	if (axis == "y")
		(backwards ? fromPage : toPage).style.top = "100%";
	else
		toPage.style.left = "100%";

	scrollTo(0, 1);
	toPage.setAttribute("selected", "true");
	var percent = 100;
	slide();
	var timer = setInterval(slide, slideInterval);

	function slide()
	{
		percent -= slideSpeed;
		if (percent <= 0)
		{
			percent = 0;
			clearInterval(timer);
			cb();
		}
	
		if (axis == "y")
		{
			backwards
				? fromPage.style.top = (100-percent) + "%"
				: toPage.style.top = percent + "%";
		}
		else
		{
			fromPage.style.left = (backwards ? (100-percent) : (percent-100)) + "%"; 
			toPage.style.left = (backwards ? -percent : percent) + "%"; 
		}
	}
}


function slide2(fromPage, toPage, backwards, cb)
{
	toPage.style.webkitTransitionDuration = '0ms'; // Turn off transitions to set toPage start offset
	// fromStart is always 0% and toEnd is always 0%
	// iPhone won't take % width on toPage
	var toStart = 'translateX(' + (backwards ? '-' : '') + window.innerWidth +	'px)';
	var fromEnd = 'translateX(' + (backwards ? '100%' : '-100%') + ')';
	toPage.style.webkitTransform = toStart;
	toPage.setAttribute("selected", "true");
	toPage.style.webkitTransitionDuration = '';	  // Turn transitions back on
	function startTrans()
	{
		fromPage.style.webkitTransform = fromEnd;
		toPage.style.webkitTransform = 'translateX(0%)'; //toEnd
	}
	fromPage.addEventListener('webkitTransitionEnd', cb, false);
	setTimeout(startTrans, 0);
}

function preloadImages()
{
	var preloader = document.createElement("div");
	preloader.id = "preloader";
	document.body.appendChild(preloader);
}

function submitForm(form)
{
    iui.addClass(form, "progress");
    iui.showPageByHref(form.action, encodeForm(form), form.method || "GET", null, clear);
    function clear() {   iui.removeClass(form, "progress"); }
}

function encodeForm(form)
{
	function encode(inputs)
	{
		for (var i = 0; i < inputs.length; ++i)
		{
	        if (inputs[i].name)
		        args[inputs[i].name] = inputs[i].value;
		}
	}

    var args = {};
    encode(form.getElementsByTagName("input"));
    encode(form.getElementsByTagName("textarea"));
    encode(form.getElementsByTagName("select"));
    encode(form.getElementsByTagName("button"));
    return args;	  
}

function findParent(node, localName)
{
	while (node && (node.nodeType != 1 || node.localName.toLowerCase() != localName))
		node = node.parentNode;
	return node;
}

function hasClass(self, name)
{
	return iui.hasClass(self,name);
}

function replaceElementWithFrag(replace, frag)
{
	var page = replace.parentNode;
	var parent = replace;
	while (page.parentNode != document.body)
	{
		page = page.parentNode;
		parent = parent.parentNode;
	}
	page.removeChild(parent);

    var docNode;
	while (frag.firstChild) {
		docNode = page.appendChild(frag.firstChild);
		sendEvent("afterinsert", document.body, {insertedNode:docNode});
    }
}

function $(id) { return document.getElementById(id); }
function ddd() { console.log.apply(console, arguments); }

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