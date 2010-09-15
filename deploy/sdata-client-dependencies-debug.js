/*!
 * 
 */
/**
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
// The Top-Level Namespace
/*global Sage $ alert*/
Sage = (function() {
    var apply = function(a, b, c)
    {
        if (a && c) for (var n in c) a[n] = c[n];
        if (a && b) for (var n in b) a[n] = b[n];
        return a;
    };
    var namespace = function(name, scope)
    {
        var parts = name.split('.');
        var o = scope || (parts[0] !== 'Sage' ? this : window);
        for (var i = 0; i < parts.length; i++) o = (o[parts[i]] = o[parts[i]] || {__namespace: true});
        return o;
    };
    var iter = function(o, cb, scope)
    {
        if (isArray(o))
        {
            var l = o.length;
            for (var i = 0; i < l; i++)
                cb.call(scope || o[i], i, o[i]);
        }
        else
            for (var n in o)
                if (o.hasOwnProperty(n))
                    cb.call(scope || o[n], n, o[n]);
    };
    var isArray = function(o)
    {
        return Object.prototype.toString.call(o) == '[object Array]';
    };
    return {
        config: {
            win: window || {},
            doc: document
        },
        apply: apply,
        namespace: namespace,
        each: iter,
        isArray: isArray,
        __namespace: true
    };
}());/*
    Make a new Class:
    var Person = Sage.Class.define({
		constructor: function(str) {
	    	this.name = str;
		},
		iAm: function() {
	    	return this.name;
		}
	});

	To create a class which inherits from an already existing one
	just call the already-existing class' extend() method: **
	var Knight = Person.extend({
		iAm: function() {
			return 'Sir ' + this.base();
		},
		joust: function() {
		    return 'Yaaaaaa!';
		}
	});
	Notice the Knight's iAm() method has access to it's 'super'
	via this.base();

	** differs from the Ext method of having to pass in the parent,
	** ours defines the extend() method directly on every defined class
*/
/*global Sage $ alert*/
if(Sage) {
    (function(S) {
        var INITIALIZING = false,
            // straight outta base2
            OVERRIDE = /xyz/.test(function(){xyz;}) ? /\bbase\b/ : /.*/;

        // The base Class placeholder
        S.Class = function(){};
        // Create a new Class that inherits from this class
        S.Class.define = function(prop) {
            var base = this.prototype;
            // Instantiate a base class (but only create the instance)
            INITIALIZING = true;
            var prototype = new this();
            INITIALIZING = false;

            var wrap = function(name, fn) {
                return function() {
                    var tmp = this.base;
                    // Add a new .base() method that is the same method
                    // but on the base class
                    this.base = base[name];
                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this.base = tmp;
                    return ret;
                };
            };

            // Copy the properties over onto the new prototype
            var hidden = ['constructor'],
                i = 0,
                name;

            for (name in prop) {
                // Check if we're overwriting an existing function
                prototype[name] = typeof prop[name] === "function" &&
                typeof base[name] === "function" &&
                OVERRIDE.test(prop[name]) ? wrap(name, prop[name]) : prop[name];
            }

            while (name = hidden[i++])
                if (prop[name] != base[name])
                    prototype[name] = typeof prop[name] === "function" &&
                        typeof base[name] === "function" &&
                        OVERRIDE.test(prop[name]) ? wrap(name, prop[name]) : prop[name];

            // The dummy class constructor
            function Class() {
                // All construction is actually done in the initialize method
                if ( !INITIALIZING && this.constructor ) {
                    this.constructor.apply(this, arguments);
                }
            }
            // Populate the constructed prototype object
            Class.prototype = prototype;
            // Enforce the constructor to be what we expect
            Class.constructor = Class;
            // And make this class 'define-able'
            Class.define = arguments.callee;
            Class.extend = Class.define; // sounds better for inherited classes
            return Class;
        };
    }(Sage));
}/*global Sage $ alert*/
if(Sage) {
    (function(S) {
        // place the Deferred class into Sage.Utility
        S.namespace('Utility');
        
        S.Utility.Deferred = function(fn, args, scope) {
            var that = this, id,
            c = function() {
                clearInterval(id);
                id = null;
                fn.apply(scope, args || []);
            };
            that.delay = function(n) {
                that.cancel();
                // an named interval that can be cancelled
                id = setInterval(c, n);
            };
            that.cancel = function() {
                if(id) {
                    clearInterval(id);
                    id = null;
                }
            };
        };
    }(Sage));
}// Event class is instantiated by the Evented class. Probably no need
// to call this directly

/*global Sage $ alert*/
if(Sage) {
    (function(S) {
        var SLICE = Array.prototype.slice,
            TRUE = true, FALSE = false,
            WIN = S.config.win,
            TARGETED = function(f,o,scope) {
                return function() {
                    if(o.target === arguments[0]){
                        f.apply(scope, SLICE.call(arguments, 0));
                    }
                };
            },
            BUFFERED = function(f,o,l,scope) {
                l.task = new S.Utility.Deferred();
                return function(){
                    l.task.delay(o.buffer, f, scope, SLICE.call(arguments, 0));
                };
            },
            SINGLE = function(f,ev,fn,scope) {
                return function(){
                    ev.removeListener(fn, scope);
                    return f.apply(scope, arguments);
                };
            },
            DELAYED = function(f,o,l,scope) {
                return function() {
                    var task = new S.Utility.Deferred();
                    if(!l.tasks) {
                        l.tasks = [];
                    }
                    l.tasks.push(task);
                    task.delay(o.delay || 10, f, scope, SLICE.call(arguments, 0));
                };
            };
        // place the Event class in Utility
        S.namespace('Utility');
        
        S.Utility.Event = Sage.Class.define({
            constructor: function(obj, name) {
                this.name = name;
                this.obj = obj;
                this.listeners = [];
            },
            addListener: function(fn, scope, options){
                var that = this,l;
                scope = scope || that.obj;
                if(!that.isListening(fn, scope)) {
                    l = that.createListener(fn, scope, options);
                    if(that.firing) {
                        that.listeners = that.listeners.slice(0);
                    }
                    that.listeners.push(l);
                }
            },
            createListener: function(fn, scope, o) {
                o = o || {}; 
                scope = scope || this.obj;
                var l = {
                    fn: fn,
                    scope: scope,
                    options: o
                }, h = fn;
                if(o.target){
                    h = TARGETED(h, o, scope);
                }
                if(o.delay){
                    h = DELAYED(h, o, l, scope);
                }
                if(o.single){
                    h = SINGLE(h, this, fn, scope);
                }
                if(o.buffer){
                    h = BUFFERED(h, o, l, scope);
                }
                l.fireFn = h;
                return l;
            },
            findListener: function(fn, scope){
                var list = this.listeners,
                i = list.length,l;
                scope = scope || this.obj;
                while(i--) {
                    l = list[i];
                    if(l) {
                        if(l.fn === fn && l.scope === scope){
                            return i;
                        }
                    }
                }
                return -1;
            },
            isListening: function(fn, scope){
                return this.findListener(fn, scope) !== -1;
            },
            removeListener: function(fn, scope){
                var that = this, index, l, k,
                result = FALSE;
                if((index = that.findListener(fn, scope)) !== -1) {
                    if (that.firing) {
                        that.listeners = that.listeners.slice(0);
                    }
                    l = that.listeners[index];
                    if(l.task) {
                        l.task.cancel();
                        delete l.task;
                    }
                    k = l.tasks && l.tasks.length;
                    if(k) {
                        while(k--) {
                            l.tasks[k].cancel();
                        }
                        delete l.tasks;
                    }
                    that.listeners.splice(index, 1);
                    result = TRUE;
                }
                return result;
            },
            // Iterate to stop any buffered/delayed events
            clearListeners: function() {
                var that = this,
                l = that.listeners,
                i = l.length;
                while(i--) {
                    that.removeListener(l[i].fn, l[i].scope);
                }
            },
            fire: function(){
                var that = this,
                listeners = that.listeners,
                len = listeners.length,
                i = 0, l, args;
                if(len > 0) {
                    that.firing = TRUE;
                    args = SLICE.call(arguments, 0);
                    for (; i < len; i++) {
                        l = listeners[i];
                        if(l && l.fireFn.apply(l.scope || that.obj || 
                            WIN, args) === FALSE) {
                            return (that.firing = FALSE);
                        }
                    }
                }
                that.firing = FALSE;
                return TRUE;
            }
        }); // end S.Event class
    }(Sage));
}/*
    var Employee = Sage.Evented.extend({
        constructor: function(c) {
            this.name = c.name;
            this.events = {
                quit: true
            };
            this.base(c);
        }
    });

    var Dev = new Employee({
        name: "Rob",
        listeners: {
            quit: function() {console.log(this.name + ' has quit!'); }
        }
    });
*/

/*global Sage $ alert*/
if(Sage) {
    (function(S) {
        var SLICE = Array.prototype.slice,
            TRUE = true, FALSE = false,
            // do not include these
            FILTER = /^(?:scope|delay|buffer|single)$/,
            EACH = S.each;
        
        S.Evented = S.Class.define({
            constructor: function(config) {
                var that = this,
                e = that.events;
                if(config && config.listeners) {
                    that.addListener(config.listeners);
                }
                that.events = e || {};
            },
            fireEvent: function() {
                var that = this,
                args = SLICE.call(arguments, 0),
                eventName = args[0].toLowerCase(),
                result = TRUE,
                current = this.events[eventName],
                b,c,
                q = that.eventQueue || [];
                // TODO: evaluate use of deferring events
                if (that.eventsSuspended === TRUE) {
                    q.push(args);
                }
                if (typeof current === 'object') {
                    if(current.bubble) {
                        if(current.fire.apply(current, args.slice(1)) === FALSE) {
                            return FALSE;
                        }
                        b = that.getBubbleTarget && that.getBubbleTarget();
                        if(b && b.enableBubble) {
                            c = b.events[eventName];
                            if(!c || typeof c !== 'object' || !c.bubble) {
                                b.enableBubble(eventName);
                            }
                            return b.fireEvent.apply(b, args);
                        }
                    } else {
                        // remove the event name
                        args.shift();
                        result = current.fire.apply(current, args);
                    }
                }
                return result;
            },
            addListener : function(eventName, fn, scope, o){
                var that = this, e, oe, ce;
                if (typeof eventName === 'object') {
                    o = eventName;
                    for (e in o){
                        oe = o[e];
                        if (!FILTER.test(e)) {
                            that.addListener(e, oe.fn || oe, oe.scope || 
                                o.scope, oe.fn ? oe : o);
                        }
                    }
                } else {
                    eventName = eventName.toLowerCase();
                    ce = that.events[eventName] || TRUE;
                    if (typeof ce === 'boolean') {
                        that.events[eventName] = ce = new S.Utility.Event(that, eventName);
                    }
                    ce.addListener(fn, scope, typeof o === 'object' ? o : {});
                }
            },
            removeListener : function(eventName, fn, scope) {
                var ce = this.events[eventName.toLowerCase()];
                if (typeof ce === 'object') {
                    ce.removeListener(fn, scope);
                }
            },
            purgeListeners : function(){
                var events = this.events,evt,key;
                for(key in events) {
                    evt = events[key];
                    if(typeof evt === 'object') {
                        evt.clearListeners();
                    }
                }
            },
            addEvents : function(o){
                var that = this, arg, i;
                that.events = that.events || {};
                if (typeof o === 'string') {
                    arg = arguments;
                    i = arg.length;
                    while(i--) {
                        that.events[arg[i]] = that.events[arg[i]] || TRUE;
                    }
                } else {
                    Sage.apply(that.events, o);
                }
            },
            hasListener : function(eventName){
                var e = this.events[eventName.toLowerCase()];
                return typeof e === 'object' && e.listeners.length > 0;
            },
            suspendEvents : function(queueSuspended){
                this.eventsSuspended = TRUE;
                if(queueSuspended && !this.eventQueue){
                    this.eventQueue = [];
                }
            },
            resumeEvents : function(){
                var that = this,
                queued = that.eventQueue || [];
                that.eventsSuspended = FALSE;
                delete that.eventQueue;
                // use jquery's each method
                EACH(queued, function(e) {
                    that.fireEvent.apply(that, e);
                });
            }            
        }); //end S.Evented

        S.Evented.prototype.on = S.Evented.prototype.addListener;
        S.Evented.prototype.un = S.Evented.prototype.removeListener;
    }(Sage));
}