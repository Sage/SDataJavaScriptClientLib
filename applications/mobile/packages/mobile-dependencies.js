/*
 * 
 */
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(c){var a="";var k,h,f,j,g,e,d;var b=0;c=Base64._utf8_encode(c);while(b<c.length){k=c.charCodeAt(b++);h=c.charCodeAt(b++);f=c.charCodeAt(b++);j=k>>2;g=((k&3)<<4)|(h>>4);e=((h&15)<<2)|(f>>6);d=f&63;if(isNaN(h)){e=d=64}else{if(isNaN(f)){d=64}}a=a+this._keyStr.charAt(j)+this._keyStr.charAt(g)+this._keyStr.charAt(e)+this._keyStr.charAt(d)}return a},decode:function(c){var a="";var k,h,f;var j,g,e,d;var b=0;c=c.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(b<c.length){j=this._keyStr.indexOf(c.charAt(b++));g=this._keyStr.indexOf(c.charAt(b++));e=this._keyStr.indexOf(c.charAt(b++));d=this._keyStr.indexOf(c.charAt(b++));k=(j<<2)|(g>>4);h=((g&15)<<4)|(e>>2);f=((e&3)<<6)|d;a=a+String.fromCharCode(k);if(e!=64){a=a+String.fromCharCode(h)}if(d!=64){a=a+String.fromCharCode(f)}}a=Base64._utf8_decode(a);return a},_utf8_encode:function(b){b=b.replace(/\r\n/g,"\n");var a="";for(var e=0;e<b.length;e++){var d=b.charCodeAt(e);if(d<128){a+=String.fromCharCode(d)}else{if((d>127)&&(d<2048)){a+=String.fromCharCode((d>>6)|192);a+=String.fromCharCode((d&63)|128)}else{a+=String.fromCharCode((d>>12)|224);a+=String.fromCharCode(((d>>6)&63)|128);a+=String.fromCharCode((d&63)|128)}}}return a},_utf8_decode:function(a){var b="";var d=0;var e=c1=c2=0;while(d<a.length){e=a.charCodeAt(d);if(e<128){b+=String.fromCharCode(e);d++}else{if((e>191)&&(e<224)){c2=a.charCodeAt(d+1);b+=String.fromCharCode(((e&31)<<6)|(c2&63));d+=2}else{c2=a.charCodeAt(d+1);c3=a.charCodeAt(d+2);b+=String.fromCharCode(((e&15)<<12)|((c2&63)<<6)|(c3&63));d+=3}}}return b}};if(typeof(XML)=="undefined"){XML=function(){}}XML.ObjTree=function(){return this};XML.ObjTree.VERSION="0.24";XML.ObjTree.prototype.xmlDecl='<?xml version="1.0" encoding="UTF-8" ?>\n';XML.ObjTree.prototype.attr_prefix="-";XML.ObjTree.prototype.overrideMimeType="text/xml";XML.ObjTree.prototype.parseXML=function(c){var b;if(window.DOMParser){var a=new DOMParser();var d=a.parseFromString(c,"application/xml");if(!d){return}b=d.documentElement}else{if(window.ActiveXObject){a=new ActiveXObject("Microsoft.XMLDOM");a.async=false;a.loadXML(c);b=a.documentElement}}if(!b){return}return this.parseDOM(b)};XML.ObjTree.prototype.parseHTTP=function(b,j,h){var a={};for(var g in j){a[g]=j[g]}if(!a.method){if(typeof(a.postBody)=="undefined"&&typeof(a.postbody)=="undefined"&&typeof(a.parameters)=="undefined"){a.method="get"}else{a.method="post"}}if(h){a.asynchronous=true;var f=this;var c=h;var d=a.onComplete;a.onComplete=function(l){var k;if(l&&l.responseXML&&l.responseXML.documentElement){k=f.parseDOM(l.responseXML.documentElement)}else{if(l&&l.responseText){k=f.parseXML(l.responseText)}}c(k,l);if(d){d(l)}}}else{a.asynchronous=false}var i;if(typeof(HTTP)!="undefined"&&HTTP.Request){a.uri=b;var e=new HTTP.Request(a);if(e){i=e.transport}}else{if(typeof(Ajax)!="undefined"&&Ajax.Request){var e=new Ajax.Request(b,a);if(e){i=e.transport}}}if(h){return i}if(i&&i.responseXML&&i.responseXML.documentElement){return this.parseDOM(i.responseXML.documentElement)}else{if(i&&i.responseText){return this.parseXML(i.responseText)}}};XML.ObjTree.prototype.parseDOM=function(a){if(!a){return}this.__force_array={};if(this.force_array){for(var d=0;d<this.force_array.length;d++){this.__force_array[this.force_array[d]]=1}}var c=this.parseElement(a);if(this.__force_array[a.nodeName]){c=[c]}if(a.nodeType!=11){var b={};b[a.nodeName]=c;c=b}return c};XML.ObjTree.prototype.parseElement=function(e){if(e.nodeType==7){return}if(e.nodeType==3||e.nodeType==4){var f=e.nodeValue.match(/[^\x00-\x20]/);if(f==null){return}return e.nodeValue}var b;var d={};if(e.attributes&&e.attributes.length){b={};for(var g=0;g<e.attributes.length;g++){var j=e.attributes[g].nodeName;if(typeof(j)!="string"){continue}var c=e.attributes[g].nodeValue;if(!c){continue}j=this.attr_prefix+j;if(typeof(d[j])=="undefined"){d[j]=0}d[j]++;this.addNode(b,j,d[j],c)}}if(e.childNodes&&e.childNodes.length){var h=true;if(b){h=false}for(var g=0;g<e.childNodes.length&&h;g++){var a=e.childNodes[g].nodeType;if(a==3||a==4){continue}h=false}if(h){if(!b){b=""}for(var g=0;g<e.childNodes.length;g++){b+=e.childNodes[g].nodeValue}}else{if(!b){b={}}for(var g=0;g<e.childNodes.length;g++){var j=e.childNodes[g].nodeName;if(typeof(j)!="string"){continue}var c=this.parseElement(e.childNodes[g]);if(!c){continue}if(typeof(d[j])=="undefined"){d[j]=0}d[j]++;this.addNode(b,j,d[j],c)}}}return b};XML.ObjTree.prototype.addNode=function(c,a,b,d){if(this.__force_array[a]){if(b==1){c[a]=[]}c[a][c[a].length]=d}else{if(b==1){c[a]=d}else{if(b==2){c[a]=[c[a],d]}else{c[a][c[a].length]=d}}}};XML.ObjTree.prototype.writeXML=function(a){var b=this.hash_to_xml(null,a);return this.xmlDecl+b};XML.ObjTree.prototype.hash_to_xml=function(c,b){var f=[];var a=[];for(var e in b){if(!b.hasOwnProperty(e)){continue}var h=b[e];if(e.charAt(0)!=this.attr_prefix){if(typeof(h)=="undefined"||h==null){f[f.length]="<"+e+" />"}else{if(typeof(h)=="object"&&h.constructor==Array){f[f.length]=this.array_to_xml(e,h)}else{if(typeof(h)=="object"){f[f.length]=this.hash_to_xml(e,h)}else{f[f.length]=this.scalar_to_xml(e,h)}}}}else{a[a.length]=" "+(e.substring(1))+'="'+(this.xml_escape(h))+'"'}}var g=a.join("");var d=f.join("");if(typeof(c)=="undefined"||c==null){}else{if(f.length>0){if(d.match(/\n/)){d="<"+c+g+">\n"+d+"</"+c+">\n"}else{d="<"+c+g+">"+d+"</"+c+">\n"}}else{d="<"+c+g+" />\n"}}return d};XML.ObjTree.prototype.array_to_xml=function(b,e){var a=[];for(var c=0;c<e.length;c++){var d=e[c];if(typeof(d)=="undefined"||d==null){a[a.length]="<"+b+" />"}else{if(typeof(d)=="object"&&d.constructor==Array){a[a.length]=this.array_to_xml(b,d)}else{if(typeof(d)=="object"){a[a.length]=this.hash_to_xml(b,d)}else{a[a.length]=this.scalar_to_xml(b,d)}}}}return a.join("")};XML.ObjTree.prototype.scalar_to_xml=function(a,b){if(a=="#text"){return this.xml_escape(b)}else{return"<"+a+">"+this.xml_escape(b)+"</"+a+">\n"}};XML.ObjTree.prototype.xml_escape=function(a){return String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")};
/*
 * simplate-js v1.1 
 * Copyright 2010, Michael Morton 
 * 
 * MIT Licensed - See LICENSE.txt
 */
(function(){var c={tags:{begin:"{%",end:"%}"}};var b={};var e=function(g,f,i){if(i){for(var h in i){g[h]=i[h]}}if(f){for(var h in f){g[h]=f[h]}}return g};function d(f){if(typeof f!=="string"){return f}return f.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var a=function(q,g){if(q.join){q=q.join("")}if(b[q]){return b[q]}var g=e({},g,c);if("is,ie".split(/(,)/).length!==3){var l=[];var p=q.split(g.tags.begin);for(var j=0;j<p.length;j++){l.push.apply(l,p[j].split(g.tags.end))}}else{var n=new RegExp(g.tags.begin+"(.*?)"+g.tags.end);var l=q.split(n)}for(var j=1;j<l.length;j+=2){if(l[j].length>0){var h=l[j].charAt(0);switch(h){case"#":l[j]="";break;case"=":l[j]="__p("+l[j].substr(1)+");";break;case":":l[j]="__p(__s.encode("+l[j].substr(1)+"));";break;case"$":l[j]="try {__p("+l[j].substr(1)+");} catch (__e) {}";break;case"!":l[j]="__p("+l[j].substr(1).replace(/^\s+|\s+$/g,"")+".apply(__v));";break;default:break}}}for(var j=0;j<l.length;j+=2){l[j]="__p('"+l[j].replace(/'/g,"\\'").replace(/\n/g,"\\n")+"');"}var f=["var __r = [], $ = __v || {}, __s = Simplate, __p = function() { __r.push.apply(__r, arguments); };","with ($) {",l.join(""),"}","return __r.join('');"];var m;try{m=new Function("__v",f.join(""))}catch(k){m=function(i){return k.message}}return(b[q]=m)};Simplate=window.Simplate=function(f,g){this.fn=a(f,g)};Simplate.prototype={apply:function(g,f){return this.fn.call(f||this,g)}};Simplate.options=c;Simplate.encode=d})();
/*
* ReUI v1.0
* Copyright 2010, Michael Morton
*
* MIT Licensed - See LICENSE
*
* Sections of this code are Copyright (c) 2007-2009, iUI Project Members, and are
* licensed under the terms of the BSD license (see LICENSE.iUI).
*/
ReUI={};(function(){var d=ReUI,c=/msie/i.test(navigator.userAgent),a={};var b=function(e){return a[e]?(a[e]):(a[e]=new RegExp("(^|\\s)"+e+"($|\\s)"))};ReUI.DomHelper={apply:function(f,e,h){var f=f||{};if(e){for(var g in e){f[g]=e[g]}}if(h){for(var g in h){f[g]=h[g]}}return f},dispatch:function(h,g,f,i,j){if(typeof i==="object"){var j=i;var i=true}else{if(typeof f==="object"){var j=f;var f=true;var i=true}}var j=j||{};var e=document.createEvent("UIEvent");e.initEvent(g,f===false?false:true,i===false?false:true);this.apply(e,j);h.dispatchEvent(e)},bind:c?function(g,f,e){g.attachEvent(f,e)}:function(h,g,f,e){h.addEventListener(g,f,e)},unbind:c?function(g,f,e){g.detachEvent(f,e)}:function(h,g,f,e){h.removeEventListener(g,f,e)},wait:c?function(f,e){var g=Array.prototype.slice.call(arguments,2);setTimeout(function(){f.apply(this,g)},e)}:function(){return setTimeout.apply(window,arguments)},clearWait:function(){clearTimeout.apply(window,arguments)},timer:c?function(f,e){var g=Array.prototype.slice.call(arguments,2);setInterval(function(){f.apply(this,g)},e)}:function(){return setInterval.apply(window,arguments)},clearTimer:function(){clearInterval.apply(window,arguments)},hasClass:function(f,e){return b(e).test(f.className)},addClass:function(f,e){if(this.hasClass(f,e)==false){f.className+=" "+e}},removeClass:function(f,e){if(this.hasClass(f,e)){f.className=f.className.replace(b(e)," ")}},get:function(e){if(typeof e==="string"){return document.getElementById(e)}return e},findAncestorByTag:function(f,e){while(f&&(f.nodeType!=1||f.localName.toLowerCase()!=e)){f=f.parentNode}return f},select:function(e){e.setAttribute("selected","true")},unselect:function(e){e.removeAttribute("selected")},applyStyle:function(f,e){this.apply(f.style,e)}}})();(function(){var g=ReUI,a=ReUI.DomHelper,h=/webkit/i.test(navigator.userAgent);var l=function(m){return g.useCompatibleFx?g.registeredFx[m+"Compatible"]:g.registeredFx[m]};var f=function(m){var m=m||window.event;var o=m.target||m.srcElement;var n=a.findAncestorByTag(o,"a");if(n){if(n.href&&n.hash&&n.hash!="#"&&!n.target){a.select(n);g.show(a.get(n.hash.substr(1)));a.wait(a.unselect,500,n)}else{if(n==g.backEl){g.back()}else{if(n.getAttribute("type")=="cancel"){if(d.dialog){a.unselect(d.dialog)}}else{if(n.getAttribute("href",2)==="#"||n.getAttribute("href",2)===null){}else{return}}}}m.cancelBubble=true;if(m.stopPropagation){m.stopPropagation()}if(m.preventDefault){m.preventDefault()}}};var e=function(n,r){if(r.track!==false){if(typeof n.id!=="string"||n.id.length<=0){n.id="liui-"+(d.counter++)}d.hash=location.hash=g.hashPrefix+n.id;d.history.push(n.id)}d.transitioning=false;if(r.update!==false){if(g.titleEl){if(n.title){g.titleEl.innerHTML=n.title}var q=n.getAttribute("titleCls")||n.getAttribute("ttlclass");if(q){g.titleEl.className=q}}if(g.backEl&&r.track!==false){var m=a.get(d.history[d.history.length-2]);if(m&&!m.getAttribute("hideBackButton")){g.backEl.style.display="inline";g.backEl.innerHTML=m.title||g.backText;var p=m.getAttribute("backButtonCls")||m.getAttribute("bbclass");g.backEl.className=p?"button "+p:"button"}else{g.backEl.style.display="none"}}}};var i=function(w,x,n){function m(){d.check=a.timer(b,g.checkStateEvery);a.wait(e,0,x,n);a.dispatch(w,"aftertransition",{out:true});a.dispatch(x,"aftertransition",{out:false})}d.transitioning=true;a.clearTimer(d.check);a.dispatch(w,"beforetransition",{out:true});a.dispatch(x,"beforetransition",{out:false});if(g.disableFx===true){a.unselect(w);a.select(x);m();return}if(typeof n.horizontal!=="boolean"){var u=x.getAttribute("horizontal");var v=w.getAttribute("horizontal");if(u==="false"||v==="false"){n.horizontal=false}}var q=n.horizontal!==false?n.reverse?"r":"l":n.reverse?"d":"u";var s=x.getAttribute("effect");var t=w.getAttribute("effect");var p=t||s;var r=l(p)||l(g.defaultFx);if(r){r(w,x,q,m)}};var c=function(m){if(m&&m.indexOf(g.hashPrefix)===0){return a.get(m.substr(g.hashPrefix.length))}return false};var b=function(){if(!d.hasOrientationEvent){if((window.innerHeight!=d.height)||(window.innerWidth!=d.width)){d.height=window.innerHeight;d.width=window.innerWidth;k(d.height<d.width?"landscape":"portrait")}}if(d.hash!=location.hash){var m=c(location.hash);if(m){g.show(m)}}};var j=function(){switch(window.orientation){case 90:case -90:k("landscape");break;default:k("portrait");break}};var k=function(m){g.rootEl.setAttribute("orient",m);if(m=="portrait"){a.removeClass(g.rootEl,"landscape");a.addClass(g.rootEl,"portrait")}else{if(m=="landscape"){a.removeClass(g.rootEl,"portrait");a.addClass(g.rootEl,"landscape")}else{a.removeClass(g.rootEl,"portrait");a.removeClass(g.rootEl,"landscape")}}a.wait(scrollTo,100,0,1)};var d={page:false,dialog:false,transitioning:false,counter:0,width:0,height:0,check:0,hasOrientationEvent:false,history:[]};a.apply(ReUI,{autoInit:true,useCompatibleFx:!h,registeredFx:{},disableFx:false,defaultFx:"slide",rootEl:false,titleEl:false,backEl:false,hashPrefix:"#_",backText:"Back",checkStateEvery:250,prioritizeLocation:false,init:function(){g.rootEl=g.rootEl||document.body;g.backEl=g.backEl||a.get("backButton");g.titleEl=g.titleEl||a.get("pageTitle");var o,m;var n=g.rootEl.firstChild;for(;n;n=n.nextSibling){if(n.nodeType==1&&n.getAttribute("selected")=="true"){o=n}}if(location.hash){m=c(location.hash)}if(g.prioritizeLocation){if(m){if(o){a.unselect(o)}g.show(m)}else{if(o){g.show(o)}}}else{if(o){g.show(o)}else{if(m){g.show(m)}}}if(typeof window.onorientationchange==="object"){window.onorientationchange=j;d.hasOrientationEvent=true;a.wait(j,0)}a.wait(b,0);d.check=a.timer(b,g.checkStateEvery);a.bind(g.rootEl,"click",f)},registerFx:function(n,m,o){if(typeof m==="function"){o=m;m=false}if(m){g.registeredFx[n+"Compatible"]=o}else{g.registeredFx[n]=o}},getCurrentPage:function(){return d.page},getCurrentDialog:function(){return d.dialog},back:function(){history.go(-1)},show:function(n,p){if(d.transitioning){return}if(typeof n==="string"){n=a.get(n)}var p=a.apply({reverse:false},p);if(p.track!==false){var m=d.history.indexOf(n.id);if(m!=-1){p.reverse=true;d.history.splice(m)}}if(d.dialog){a.unselect(d.dialog);a.dispatch(d.dialog,"blur",false);d.dialog=false}if(a.hasClass(n,"dialog")){a.dispatch(n,"focus",false);d.dialog=n;a.select(n)}else{a.dispatch(n,"load",false);var q=d.page;if(d.page){a.dispatch(d.page,"blur",false)}d.page=n;a.dispatch(n,"focus",false);if(q){if(p.reverse){a.dispatch(d.page,"unload",false)}a.wait(i,0,q,n,p)}else{a.select(n);e(n,p)}}}});a.bind(window,"load",function(m){if(g.autoInit){g.init()}})})();(function(){var a=ReUI,b=ReUI.DomHelper;a.registerFx("slide",function(i,h,d,g){var e={value:"0%",axis:"X"};var f={value:"0%",axis:"X"};switch(d){case"l":e.value=(window.innerWidth)+"px";e.axis="X";f.value="-100%";f.axis="X";break;case"r":e.value=(-1*window.innerWidth)+"px";e.axis="X";f.value="100%";f.axis="X";break;case"u":e.value=(window.innerHeight)+"px";e.axis="Y";f.value="-100%";f.axis="Y";break;case"d":e.value=(-1*window.innerHeight)+"px";e.axis="Y";f.value="100%";f.axis="Y";break}b.applyStyle(h,{webkitTransitionDuration:"0ms",webkitTransitionProperty:"-webkit-transform",webkitTransform:"translate"+e.axis+"("+e.value+")"});b.select(h);b.applyStyle(h,{webkitTransitionDuration:"inherit"});b.applyStyle(i,{webkitTransitionDuration:"inherit",webkitTransitionProperty:"-webkit-transform"});function c(){b.unbind(i,"webkitTransitionEnd",c,false);b.applyStyle(h,{webkitTransitionProperty:"inherit"});b.applyStyle(i,{webkitTransitionProperty:"inherit"});if(b.hasClass(h,"dialog")==false){b.unselect(i)}if(typeof g==="function"){g()}}b.bind(i,"webkitTransitionEnd",c,false);b.wait(function(){b.applyStyle(i,{webkitTransform:"translate"+f.axis+"("+f.value+")"});b.applyStyle(h,{webkitTransform:"translate"+e.axis+"(0%)"})},0)});a.registerFx("slide",true,function(l,m,g,k){var j={prop:"left",dir:1,value:0},n={prop:"left",dir:1,value:0};switch(g){case"l":j.prop="left";j.dir=-1;j.value=100;n.prop="left";n.dir=-1;n.value=0;break;case"r":j.prop="right";j.dir=-1;j.value=100;n.prop="right";n.dir=-1;n.value=0;break;case"u":j.prop="top";j.dir=-1;j.value=100;n.prop="top";n.dir=-1;n.value=0;break;case"d":j.prop="bottom";j.dir=-1;j.value=100;n.prop="bottom";n.dir=-1;n.value=0;break}var f=a.stepSpeed||10,d=a.stepInterval||0,i=100/f,h=1;e();b.select(m);var c=b.timer(e,d);function e(){var p={},o={};if(h>i){b.clearTimer(c);if(b.hasClass(m,"dialog")==false){b.unselect(l)}p[j.prop]="inherit";o[n.prop]="inherit";b.applyStyle(m,p);b.applyStyle(l,o);if(typeof k==="function"){k()}return}p[j.prop]=j.value+(j.dir*(h*f))+"%";o[n.prop]=n.value+(n.dir*(h*f))+"%";b.applyStyle(m,p);b.applyStyle(l,o);h++}});a.registerFx("flip",function(i,h,d,g){var e={value:"0deg",axis:"Y"};var f={value:"0deg",axis:"Y"};switch(d){case"l":e.value="-180deg";e.axis="Y";f.value="180deg";f.axis="Y";break;case"r":e.value="180deg";e.axis="Y";f.value="-180deg";f.axis="Y";break;case"u":e.value="-180deg";e.axis="X";f.value="180deg";f.axis="X";break;case"d":e.value="180deg";e.axis="X";f.value="-180deg";f.axis="X";break}b.applyStyle(h,{webkitTransitionDuration:"0ms",webkitTransitionProperty:"-webkit-transform",webkitTransform:"rotate"+e.axis+"("+e.value+")",webkitTransformStyle:"preserve-3d",webkitBackfaceVisibility:"hidden"});b.select(h);b.applyStyle(h,{webkitTransitionDuration:"inherit"});b.applyStyle(i,{webkitTransitionDuration:"inherit",webkitTransitionProperty:"-webkit-transform",webkitTransformStyle:"preserve-3d",webkitBackfaceVisibility:"hidden"});function c(){b.unbind(i,"webkitTransitionEnd",c,false);b.applyStyle(h,{webkitTransitionProperty:"inherit"});b.applyStyle(i,{webkitTransitionProperty:"inherit"});if(b.hasClass(h,"dialog")==false){b.unselect(i)}if(typeof g==="function"){g()}}b.bind(i,"webkitTransitionEnd",c,false);b.wait(function(){b.applyStyle(i,{webkitTransform:"rotate"+f.axis+"("+f.value+")"});b.applyStyle(h,{webkitTransform:"rotate"+e.axis+"(0deg)"})},0)})})();Date.getMonthNumberFromName=function(b){var e=Date.CultureInfo.monthNames,a=Date.CultureInfo.abbreviatedMonthNames,d=b.toLowerCase();for(var c=0;c<e.length;c++){if(e[c].toLowerCase()==d||a[c].toLowerCase()==d){return c}}return -1};Date.getDayNumberFromName=function(b){var f=Date.CultureInfo.dayNames,a=Date.CultureInfo.abbreviatedDayNames,e=Date.CultureInfo.shortestDayNames,d=b.toLowerCase();for(var c=0;c<f.length;c++){if(f[c].toLowerCase()==d||a[c].toLowerCase()==d){return c}}return -1};Date.isLeapYear=function(a){return(((a%4===0)&&(a%100!==0))||(a%400===0))};Date.getDaysInMonth=function(a,b){return[31,(Date.isLeapYear(a)?29:28),31,30,31,30,31,31,30,31,30,31][b]};Date.getTimezoneOffset=function(a,b){return(b||false)?Date.CultureInfo.abbreviatedTimeZoneDST[a.toUpperCase()]:Date.CultureInfo.abbreviatedTimeZoneStandard[a.toUpperCase()]};Date.getTimezoneAbbreviation=function(b,d){var c=(d||false)?Date.CultureInfo.abbreviatedTimeZoneDST:Date.CultureInfo.abbreviatedTimeZoneStandard,a;for(a in c){if(c[a]===b){return a}}return null};Date.prototype.clone=function(){return new Date(this.getTime())};Date.prototype.compareTo=function(a){if(isNaN(this)){throw new Error(this)}if(a instanceof Date&&!isNaN(a)){return(this>a)?1:(this<a)?-1:0}else{throw new TypeError(a)}};Date.prototype.equals=function(a){return(this.compareTo(a)===0)};Date.prototype.between=function(c,a){var b=this.getTime();return b>=c.getTime()&&b<=a.getTime()};Date.prototype.addMilliseconds=function(a){this.setMilliseconds(this.getMilliseconds()+a);return this};Date.prototype.addSeconds=function(a){return this.addMilliseconds(a*1000)};Date.prototype.addMinutes=function(a){return this.addMilliseconds(a*60000)};Date.prototype.addHours=function(a){return this.addMilliseconds(a*3600000)};Date.prototype.addDays=function(a){return this.addMilliseconds(a*86400000)};Date.prototype.addWeeks=function(a){return this.addMilliseconds(a*604800000)};Date.prototype.addMonths=function(a){var b=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+a);this.setDate(Math.min(b,this.getDaysInMonth()));return this};Date.prototype.addYears=function(a){return this.addMonths(a*12)};Date.prototype.add=function(b){if(typeof b=="number"){this._orient=b;return this}var a=b;if(a.millisecond||a.milliseconds){this.addMilliseconds(a.millisecond||a.milliseconds)}if(a.second||a.seconds){this.addSeconds(a.second||a.seconds)}if(a.minute||a.minutes){this.addMinutes(a.minute||a.minutes)}if(a.hour||a.hours){this.addHours(a.hour||a.hours)}if(a.month||a.months){this.addMonths(a.month||a.months)}if(a.year||a.years){this.addYears(a.year||a.years)}if(a.day||a.days){this.addDays(a.day||a.days)}return this};Date._validate=function(d,c,a,b){if(typeof d!="number"){throw new TypeError(d+" is not a Number.")}else{if(d<c||d>a){throw new RangeError(d+" is not a valid value for "+b+".")}}return true};Date.validateMillisecond=function(a){return Date._validate(a,0,999,"milliseconds")};Date.validateSecond=function(a){return Date._validate(a,0,59,"seconds")};Date.validateMinute=function(a){return Date._validate(a,0,59,"minutes")};Date.validateHour=function(a){return Date._validate(a,0,23,"hours")};Date.validateDay=function(c,a,b){return Date._validate(c,1,Date.getDaysInMonth(a,b),"days")};Date.validateMonth=function(a){return Date._validate(a,0,11,"months")};Date.validateYear=function(a){return Date._validate(a,1,9999,"seconds")};Date.prototype.set=function(b){var a=b;if(!a.millisecond&&a.millisecond!==0){a.millisecond=-1}if(!a.second&&a.second!==0){a.second=-1}if(!a.minute&&a.minute!==0){a.minute=-1}if(!a.hour&&a.hour!==0){a.hour=-1}if(!a.day&&a.day!==0){a.day=-1}if(!a.month&&a.month!==0){a.month=-1}if(!a.year&&a.year!==0){a.year=-1}if(a.millisecond!=-1&&Date.validateMillisecond(a.millisecond)){this.addMilliseconds(a.millisecond-this.getMilliseconds())}if(a.second!=-1&&Date.validateSecond(a.second)){this.addSeconds(a.second-this.getSeconds())}if(a.minute!=-1&&Date.validateMinute(a.minute)){this.addMinutes(a.minute-this.getMinutes())}if(a.hour!=-1&&Date.validateHour(a.hour)){this.addHours(a.hour-this.getHours())}if(a.month!==-1&&Date.validateMonth(a.month)){this.addMonths(a.month-this.getMonth())}if(a.year!=-1&&Date.validateYear(a.year)){this.addYears(a.year-this.getFullYear())}if(a.day!=-1&&Date.validateDay(a.day,this.getFullYear(),this.getMonth())){this.addDays(a.day-this.getDate())}if(a.timezone){this.setTimezone(a.timezone)}if(a.timezoneOffset){this.setTimezoneOffset(a.timezoneOffset)}return this};Date.prototype.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this};Date.prototype.isLeapYear=function(){var a=this.getFullYear();return(((a%4===0)&&(a%100!==0))||(a%400===0))};Date.prototype.isWeekday=function(){return !(this.is().sat()||this.is().sun())};Date.prototype.getDaysInMonth=function(){return Date.getDaysInMonth(this.getFullYear(),this.getMonth())};Date.prototype.moveToFirstDayOfMonth=function(){return this.set({day:1})};Date.prototype.moveToLastDayOfMonth=function(){return this.set({day:this.getDaysInMonth()})};Date.prototype.moveToDayOfWeek=function(a,b){var c=(a-this.getDay()+7*(b||+1))%7;return this.addDays((c===0)?c+=7*(b||+1):c)};Date.prototype.moveToMonth=function(c,a){var b=(c-this.getMonth()+12*(a||+1))%12;return this.addMonths((b===0)?b+=12*(a||+1):b)};Date.prototype.getDayOfYear=function(){return Math.floor((this-new Date(this.getFullYear(),0,1))/86400000)};Date.prototype.getWeekOfYear=function(a){var h=this.getFullYear(),c=this.getMonth(),f=this.getDate();var j=a||Date.CultureInfo.firstDayOfWeek;var e=7+1-new Date(h,0,1).getDay();if(e==8){e=1}var b=((Date.UTC(h,c,f,0,0,0)-Date.UTC(h,0,1,0,0,0))/86400000)+1;var i=Math.floor((b-e+7)/7);if(i===j){h--;var g=7+1-new Date(h,0,1).getDay();if(g==2||g==8){i=53}else{i=52}}return i};Date.prototype.isDST=function(){console.log("isDST");return this.toString().match(/(E|C|M|P)(S|D)T/)[2]=="D"};Date.prototype.getTimezone=function(){return Date.getTimezoneAbbreviation(this.getUTCOffset,this.isDST())};Date.prototype.setTimezoneOffset=function(b){var a=this.getTimezoneOffset(),c=Number(b)*-6/10;this.addMinutes(c-a);return this};Date.prototype.setTimezone=function(a){return this.setTimezoneOffset(Date.getTimezoneOffset(a))};Date.prototype.getUTCOffset=function(){var b=this.getTimezoneOffset()*-10/6,a;if(b<0){a=(b-10000).toString();return a[0]+a.substr(2)}else{a=(b+10000).toString();return"+"+a.substr(1)}};Date.prototype.getDayName=function(a){return a?Date.CultureInfo.abbreviatedDayNames[this.getDay()]:Date.CultureInfo.dayNames[this.getDay()]};Date.prototype.getMonthName=function(a){return a?Date.CultureInfo.abbreviatedMonthNames[this.getMonth()]:Date.CultureInfo.monthNames[this.getMonth()]};Date.prototype._toString=Date.prototype.toString;Date.prototype.toString=function(c){var a=this;var b=function b(d){return(d.toString().length==1)?"0"+d:d};return c?c.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g,function(d){switch(d){case"hh":return b(a.getHours()<13?a.getHours():(a.getHours()-12));case"h":return a.getHours()<13?a.getHours():(a.getHours()-12);case"HH":return b(a.getHours());case"H":return a.getHours();case"mm":return b(a.getMinutes());case"m":return a.getMinutes();case"ss":return b(a.getSeconds());case"s":return a.getSeconds();case"yyyy":return a.getFullYear();case"yy":return a.getFullYear().toString().substring(2,4);case"dddd":return a.getDayName();case"ddd":return a.getDayName(true);case"dd":return b(a.getDate());case"d":return a.getDate().toString();case"MMMM":return a.getMonthName();case"MMM":return a.getMonthName(true);case"MM":return b((a.getMonth()+1));case"M":return a.getMonth()+1;case"t":return a.getHours()<12?Date.CultureInfo.amDesignator.substring(0,1):Date.CultureInfo.pmDesignator.substring(0,1);case"tt":return a.getHours()<12?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator;case"zzz":case"zz":case"z":return""}}):this._toString()};