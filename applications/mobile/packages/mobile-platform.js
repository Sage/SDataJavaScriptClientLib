/*
 * 
 */
Ext.namespace("Sage.Platform.Mobile");Ext.USE_NATIVE_JSON=true;Sage.Platform.Mobile.Application=Ext.extend(Ext.util.Observable,{constructor:function(){Sage.Platform.Mobile.Application.superclass.constructor.call(this);this.initialized=false;this.enableCaching=false;this.context={};this.views=[];this.bars={};this.viewsById={};this.addEvents("registered","beforeviewtransitionaway","beforeviewtransitionto","viewtransitionaway","viewtransitionto")},setup:function(){Ext.getBody().on("beforetransition",function(b,c,d){var a=this.getView(c);if(a){if(b.browserEvent.out){this.beforeViewTransitionAway(a)}else{this.beforeViewTransitionTo(a)}}},this);Ext.getBody().on("aftertransition",function(b,c,d){var a=this.getView(c);if(a){if(b.browserEvent.out){this.viewTransitionAway(a)}else{this.viewTransitionTo(a)}}},this);if(this.service&&this.enableCaching){if(this.isOnline()){this.clearSDataRequestCache()}this.service.on("beforerequest",this.loadSDataRequest,this);this.service.on("requestcomplete",this.cacheSDataRequest,this)}},isOnline:function(){return window.navigator.onLine},clearSDataRequestCache:function(){var a=function(d){return/^\[sdata\]/i.test(d)};for(var c=window.localStorage.length-1;c>=0;c--){var b=window.localStorage.key(c);if(a(b)){window.localStorage.removeItem(b)}}},createCacheKey:function(a){return"[sdata] "+a.toString()},loadSDataRequest:function(b,d){if(this.isOnline()){return}var a=this.createCacheKey(b);var c=window.localStorage.getItem(a);if(c){d.result=Ext.decode(c)}},cacheSDataRequest:function(b,d,c){if(/get/i.test(d.method)&&typeof c==="object"){var a=this.createCacheKey(b);window.localStorage.removeItem(a);window.localStorage.setItem(a,Ext.encode(c))}},init:function(){this.service=new Sage.SData.Client.SDataService().setServerName(this.serverName).setVirtualDirectory(this.virtualDirectory).setApplicationName(this.applicationName).setContractName(this.contractName).setIncludeContent(false);if(this.port!==false){this.service.setPort(this.port)}if(this.protocol!==false){this.service.setProtocol(this.protocol)}this.setup();for(var b in this.bars){this.bars[b].init()}for(var a=0;a<this.views.length;a++){this.views[a].init()}this.initialized=true},registerView:function(a){this.views.push(a);this.viewsById[a.id]=a;if(this.initialized){a.init()}this.fireEvent("registered",a)},registerToolbar:function(a,b){if(typeof a==="object"){b=a;a=b.name}this.bars[a]=b;if(this.initialized){b.init()}},getViews:function(){return this.views},getActiveView:function(){var a=ReUI.getCurrentPage()||ReUI.getCurrentDialog();if(a){return this.getView(a)}return null},getView:function(a){if(a){if(typeof a==="string"){return this.viewsById[a]}if(typeof a==="object"&&typeof a.id==="string"){return this.viewsById[a.id]}}return null},getService:function(){return this.service},setTitle:function(a){for(var b in this.bars){if(this.bars[b].setTitle){this.bars[b].setTitle(a)}}},beforeViewTransitionAway:function(a){this.fireEvent("beforeviewtransitionaway",a);for(var b in this.bars){this.bars[b].clear()}a.beforeTransitionAway()},beforeViewTransitionTo:function(a){this.fireEvent("beforeviewtransitionto",a);a.beforeTransitionTo()},viewTransitionAway:function(a){this.fireEvent("viewtransitionaway",a);a.transitionAway()},viewTransitionTo:function(a){this.fireEvent("viewtransitionto",a);if(a.tools){for(var b in a.tools){if(this.bars[b]){this.bars[b].display(a.tools[b])}}}a.transitionTo()}});Ext.onReady(function(){var h=/(iphone|ipad|ipod)/i.test(navigator.userAgent),i=(typeof window.orientation!=="undefined"),g=true,k=Ext.get(document.documentElement),a=100,c=0.5,l=1,e=5,f,b;var j=function(n,p,q){};var d=function(n,p,q){f=n.getXY();b=(new Date()).getTime()};var m=function(x,r,p){var v=x.getXY(),u=(new Date()).getTime();var s=(u-b)/1000,w={x:v[0]-f[0],y:v[1]-f[1]},q=Math.sqrt(w.x*w.x+w.y*w.y),y={x:w.x/q,y:w.y/q},n=y.x*0+y.y*1;if(s<=c&&q>=a){var t;if(!g){x.stopEvent();if(n>=0.71){t="down"}else{if(n<=-0.71){t="up"}else{if(y.x<0){t="left"}else{t="right"}}}}else{if(n<0.71&&n>-0.71){x.stopEvent();if(y.x<0){t="left"}else{t="right"}}}if(t){ReUI.DomHelper.dispatch(r,"swipe",{direction:t})}}else{if(s>=l&&q<=e){x.stopEvent();ReUI.DomHelper.dispatch(r,"clicklong")}}};if(!i){k.on("mousedown",d);k.on("mouseup",m)}else{k.on("touchstart",d);k.on("touchend",m)}});Ext.namespace("Sage.Platform.Mobile");Sage.Platform.Mobile.View=Ext.extend(Ext.util.Observable,{viewTemplate:new Simplate(['<ul id="{%= id %}" title="{%= title %}" {% if (selected) { %} selected="true" {% } %}>',"</ul>"]),constructor:function(a){Sage.Platform.Mobile.View.superclass.constructor.call(this);Ext.apply(this,a,{id:"view",title:"",canSearch:false});this.loaded=false},render:function(){this.el=Ext.DomHelper.append(Ext.getBody(),this.viewTemplate.apply(this),true)},init:function(){this.render();this.el.on("load",function(a,b,c){if(this.loaded==false){this.load();this.loaded=true}},this)},isActive:function(){return(this.el.getAttribute("selected")==="true")},setTitle:function(a){this.el.dom.setAttribute("title",a)},load:function(){},show:function(){ReUI.show(this.el.dom)},beforeTransitionTo:function(){},beforeTransitionAway:function(){},transitionTo:function(){},transitionAway:function(){},getService:function(){return App.getService()}});Ext.namespace("Sage.Platform.Mobile");Sage.Platform.Mobile.List=Ext.extend(Sage.Platform.Mobile.View,{viewTemplate:new Simplate(['<ul id="{%= id %}" title="{%= title %}">',"</ul>"]),contentTemplate:new Simplate(['<li class="loading"><div class="loading-indicator">{%= loadingText %}</div></li>','<li class="more" style="display: none;"><a href="#" target="_none" class="whiteButton moreButton"><span>{%= moreText %}</span></a></li>']),itemTemplate:new Simplate(["<li>",'<a href="#" target="_detail" m:key="{%= $key %}">',"<h3>{%= $descriptor %}</h3>","</a>","</li>"]),noDataTemplate:new Simplate(['<li class="no-data">',"<h3>{%= noDataText %}</h3>","</li>"]),moreText:"More",titleText:"List",searchText:"Search",noDataText:"no records",loadingText:"loading...",constructor:function(a){Sage.Platform.Mobile.List.superclass.constructor.call(this);Ext.apply(this,a,{id:"generic_list",title:this.titleText,pageSize:20,requestedFirstPage:false,searchDialog:"search_dialog",tools:{tbar:[{name:"search",title:this.searchText,cls:function(){return this.query?"button greenButton":"button blueButton"},fn:this.showSearchDialog,scope:this}]}})},render:function(){Sage.Platform.Mobile.List.superclass.render.call(this);this.clear()},init:function(){Sage.Platform.Mobile.List.superclass.init.call(this);this.el.on("click",function(a,b,e){var c=Ext.get(b);var d;if(c.is(".more")||(c.up(".more"))){this.more(a)}else{if(c.is('a[target="_detail"]')||(d=c.up('a[target="_detail"]'))){this.navigateToDetail(d||c,a)}}},this,{preventDefault:true,stopPropagation:true});App.on("refresh",function(a){if(this.resourceKind&&a.resourceKind===this.resourceKind){this.clear()}},this)},showSearchDialog:function(){App.getView(this.searchDialog).show({query:this.queryText,fn:this.search,scope:this})},search:function(a){this.clear();this.queryText=a&&a.length>0?a:false;this.query=this.queryText!==false?this.formatSearchQuery(this.queryText):false;if(App.bars.tbar&&App.bars.tbar.tool){if(this.query){App.bars.tbar.tool.el.replaceClass("blueButton","greenButton")}else{App.bars.tbar.tool.el.replaceClass("greenButton","blueButton")}}this.requestData()},formatSearchQuery:function(a){return false},createRequest:function(){var a=this.pageSize;var e=this.feed&&this.feed["$startIndex"]>0&&this.feed["$itemsPerPage"]>0?this.feed["$startIndex"]+this.feed["$itemsPerPage"]:1;var c=new Sage.SData.Client.SDataResourceCollectionRequest(this.getService()).setCount(a).setStartIndex(e);if(this.resourceKind){c.setResourceKind(this.resourceKind)}var b=[];var d;if(this.context&&(d=this.expandExpression(this.context.where))){b.push(d)}if(this.query){b.push(this.query)}if(b.length>0){c.setQueryArgs({where:b.join(" and ")})}return c},navigateToDetail:function(b){if(b){var d=b.dom.hash.substring(1);var a=b.getAttribute("key","m");var c=b.getAttribute("descriptor","m");App.getView(d).show({descriptor:c,key:a})}},processFeed:function(b){if(this.requestedFirstPage==false){this.requestedFirstPage=true;this.el.select(".loading").remove()}this.feed=b;if(this.feed["$totalResults"]===0){Ext.DomHelper.insertBefore(this.moreEl,this.noDataTemplate.apply(this))}else{var c=[];for(var a=0;a<b.$resources.length;a++){c.push(this.itemTemplate.apply(b.$resources[a]))}if(c.length>0){Ext.DomHelper.insertBefore(this.moreEl,c.join(""))}}this.moreEl.removeClass("more-loading");if(this.hasMoreData()){this.moreEl.show()}else{this.moreEl.hide()}},hasMoreData:function(){if(this.feed["$startIndex"]>0&&this.feed["$itemsPerPage"]>0&&this.feed["$totalResults"]>=0){var c=this.feed["$startIndex"];var b=this.feed["$itemsPerPage"];var a=this.feed["$totalResults"];return(c+b<=a)}else{return true}},requestFailure:function(a,b){},requestData:function(){var a=this.createRequest();a.read({success:function(b){this.processFeed(b)},failure:function(b,c){this.requestFailure(b,c)},scope:this})},more:function(){this.moreEl.addClass("more-loading");this.requestData()},expandExpression:function(a){if(typeof a==="function"){return a.call(this)}else{return a}},hasContext:function(){return(this.context||this.newContext)},isNewContext:function(){if(!this.context){return true}return(this.expandExpression(this.context.where)!=this.expandExpression(this.newContext.where))},beforeTransitionTo:function(){Sage.Platform.Mobile.List.superclass.beforeTransitionTo.call(this);if(this.hasContext()&&this.isNewContext()){this.clear()}},transitionTo:function(){Sage.Platform.Mobile.List.superclass.transitionTo.call(this);if(this.hasContext()&&this.isNewContext()){this.context=this.newContext}if(this.requestedFirstPage==false){this.requestData()}},show:function(a){this.newContext=a;Sage.Platform.Mobile.List.superclass.show.call(this)},clear:function(){this.el.update(this.contentTemplate.apply(this));this.moreEl=this.el.down(".more");this.requestedFirstPage=false;this.feed=false;this.query=false;this.queryText=false}});Ext.namespace("Sage.Platform.Mobile");Sage.Platform.Mobile.Detail=Ext.extend(Sage.Platform.Mobile.View,{viewTemplate:new Simplate(['<div id="{%= id %}" title="{%= title %}" class="panel">',"</div>"]),contentTemplate:new Simplate(['<fieldset class="loading">','<div class="row"><div class="loading-indicator">{%= loadingText %}</div></div>',"</fieldset>",]),sectionBeginTemplate:new Simplate(['<h2>{%= $["title"] %}</h2>','{% if ($["list"]) { %}<ul>{% } else { %}<fieldset>{% } %}']),sectionEndTemplate:new Simplate(['{% if ($["list"]) { %}</ul>{% } else { %}</fieldset>{% } %}']),propertyTemplate:new Simplate(['<div class="row">',"<label>{%= label %}</label>","<span>{%= value %}</span>","</div>"]),relatedPropertyTemplate:new Simplate(['<div class="row">',"<label>{%= label %}</label>",'<a href="#{%= view %}" target="_related" m:key="{%= key %}">{%= value %}</a>',"</div>"]),relatedTemplate:new Simplate(["<li>",'<a href="#{%= view %}" target="_related" m:where="{%= where %}">','{% if ($["icon"]) { %}','<img src="{%= $["icon"] %}" alt="icon" class="icon" />',"{% } %}","{%= label %}","</a>","</li>"]),editText:"Edit",titleText:"Detail",detailsText:"Details",loadingText:"loading...",constructor:function(a){Sage.Platform.Mobile.Detail.superclass.constructor.call(this);Ext.apply(this,a,{id:"generic_detail",title:this.titleText,expose:false,editor:false,tools:{tbar:[{name:"edit",title:this.editText,hidden:function(){return !this.editor},cls:"button blueButton",fn:this.navigateToEdit,scope:this}]}})},render:function(){Sage.Platform.Mobile.Detail.superclass.render.call(this);this.clear()},init:function(){Sage.Platform.Mobile.Detail.superclass.init.call(this);this.el.on("click",function(a,d,e){a.stopEvent();var d=Ext.fly(d);var b=d.getAttribute("where","m");var c=d.getAttribute("key","m");var f=d.dom.hash.substring(1);this.navigateToRelated(f,c,b)},this,{delegate:'a[target="_related"]'});App.on("refresh",function(a){if(this.context&&a.key===this.context.key){if(a.data&&a.data["$descriptor"]){this.setTitle(a.data["$descriptor"])}this.clear()}},this)},formatRelatedQuery:function(b,a){return String.format(a,b["$key"])},navigateToEdit:function(){var a=App.getView(this.editor);if(a){a.show(this.entry)}},navigateToRelated:function(e,d,b){var c=false;if(d){c={key:d}}else{if(b){c={where:b}}}if(c){var a=App.getView(e);if(a){a.show(c)}}},createRequest:function(){var a=new Sage.SData.Client.SDataSingleResourceRequest(this.getService()).setResourceSelector(String.format("'{0}'",this.context.key));if(this.resourceKind){a.setResourceKind(this.resourceKind)}return a},processLayout:function(d,m,j,a){var l=[];var f=[];f.push(this.sectionBeginTemplate.apply(m));for(var c=0;c<d.length;c++){var e=d[c];if(e.as){l.push(e);continue}else{if(e.view&&e.property!==true){var k=Ext.apply({},e);if(k.where){k.where=typeof k.where==="function"?Sage.Platform.Mobile.Format.encode(k.where(j)):Sage.Platform.Mobile.Format.encode(k.where)}f.push(this.relatedTemplate.apply(k));continue}else{var g=e.provider||Sage.Platform.Mobile.Utility.getValue;var h=g(j,e.name);var b=e.tpl?e.tpl.apply(h):e.renderer?e.renderer(h):h;if(e.view&&e.key){f.push(this.relatedPropertyTemplate.apply({name:e.name,label:e.label,renderer:e.renderer,provider:e.provider,entry:j,raw:h,value:b,key:g(j,e.key),view:e.view}))}else{f.push(this.propertyTemplate.apply({name:e.name,label:e.label,renderer:e.renderer,provider:e.provider,entry:j,raw:h,value:b}))}}}}f.push(this.sectionEndTemplate.apply(m));Ext.DomHelper.append(a||this.el,f.join(""));for(var c=0;c<l.length;c++){var e=l[c];this.processLayout(e.as,e.options,j,a)}},requestFailure:function(a,b){},requestData:function(){var a=this.createRequest();a.read({success:function(b){this.el.select(".loading").remove();this.entry=b;if(this.entry){this.processLayout(this.layout,{title:this.detailsText},this.entry)}},failure:function(b,c){this.requestFailure(b,c)},scope:this})},show:function(a){if(a){if(a.key){this.newContext=a}if(a.descriptor){this.setTitle(a.descriptor)}}Sage.Platform.Mobile.Detail.superclass.show.call(this)},isNewContext:function(){return(!this.context||(this.context&&this.context.key!=this.newContext.key))},beforeTransitionTo:function(){Sage.Platform.Mobile.Detail.superclass.beforeTransitionTo.call(this);this.canEdit=this.editor?true:false;if(this.isNewContext()){this.clear()}},transitionTo:function(){Sage.Platform.Mobile.Detail.superclass.transitionTo.call(this);if(this.isNewContext()){this.context=this.newContext;this.requestData()}},clear:function(){this.el.update(this.contentTemplate.apply(this));this.context=false}});Ext.namespace("Sage.Platform.Mobile");Ext.namespace("Sage.Platform.Mobile.Controls");Sage.Platform.Mobile.Controls.Field=function(a){this.name=a};Sage.Platform.Mobile.Controls.Field.prototype={apply:function(a){return this.template.apply(this)},bind:function(a){this.el=a.child(String.format('input[name="{0}"]',this.name))},isDirty:function(){return true}};Sage.Platform.Mobile.Controls.TextField=Ext.extend(Sage.Platform.Mobile.Controls.Field,{template:new Simplate(['<input type="text" name="{%= name %}">',]),getValue:function(){return this.el.getValue()},setValue:function(a){this.value=a;this.el.dom.value=a},isDirty:function(){return(this.value!=this.getValue())}});Sage.Platform.Mobile.Controls.registered={text:Sage.Platform.Mobile.Controls.TextField};Sage.Platform.Mobile.Edit=Ext.extend(Sage.Platform.Mobile.View,{viewTemplate:new Simplate(['<div id="{%= id %}" title="{%= title %}" class="panel" effect="flip">','<fieldset class="loading">','<div class="row"><div class="loading-indicator">{%= loadingText %}</div></div>',"</fieldset>",'<div class="body" style="display: none;">',"</div>","</div>"]),sectionBeginTemplate:new Simplate(['<h2>{%= $["title"] %}</h2>','{% if ($["list"]) { %}<ul>{% } else { %}<fieldset>{% } %}']),sectionEndTemplate:new Simplate(['{% if ($["list"]) { %}</ul>{% } else { %}</fieldset>{% } %}']),propertyTemplate:new Simplate(['<div class="row row-edit">',"<label>{%= label %}</label>","{%! field %}","</div>"]),textFieldTemplate:new Simplate(['<input type="text" name="{%= name %}">']),saveText:"Save",titleText:"Edit",detailsText:"Details",loadingText:"loading...",constructor:function(a){Sage.Platform.Mobile.Edit.superclass.constructor.call(this);Ext.apply(this,a,{id:"generic_edit",title:this.titleText,expose:false,tools:{tbar:[{name:"edit",title:this.saveText,cls:"button blueButton",fn:this.save,scope:this}]},fields:{}})},render:function(){Sage.Platform.Mobile.Edit.superclass.render.call(this);this.bodyEl=this.el.child(".body").setVisibilityMode(Ext.Element.DISPLAY);this.loadEl=this.el.child(".loading").setVisibilityMode(Ext.Element.DISPLAY)},init:function(){Sage.Platform.Mobile.Edit.superclass.init.call(this);this.processLayout(this.layout,{title:this.detailsText});for(var a in this.fields){this.fields[a].bind(this.el)}this.loadEl.hide();this.bodyEl.show();if(this.canSave){App.on("save",function(){if(this.isActive()){this.save()}},this)}},createRequest:function(){},createTemplateRequest:function(){},processLayout:function(e,a){var h=[];var d=[];d.push(this.sectionBeginTemplate.apply(a));for(var b=0;b<e.length;b++){var g=e[b];if(g.as){h.push(g);continue}else{var c=Sage.Platform.Mobile.Controls.registered[g.type];var f=this.fields[g.name]=new c(g.name);d.push(this.propertyTemplate.apply({label:g.label,field:f}))}}d.push(this.sectionEndTemplate.apply(a));Ext.DomHelper.append(this.el,d.join(""));for(var b=0;b<h.length;b++){var g=h[b];this.processLayout(g.as,g.options)}},requestFailure:function(a,b){},requestData:function(){var a=this.createRequest();if(a){a.read({success:function(b){},failure:function(b,c){this.requestFailure(b,c)},scope:this})}},show:function(a){if(typeof a!=="undefined"){this.entry=a;this.newContext=true}else{this.newContext=false}Sage.Platform.Mobile.Edit.superclass.show.call(this)},isNewContext:function(){return this.newContext},beforeTransitionTo:function(){Sage.Platform.Mobile.Edit.superclass.beforeTransitionTo.call(this)},setValues:function(c){for(var a in this.fields){var b=Sage.Platform.Mobile.Utility.getValue(c,a);this.fields[a].setValue(b)}},getValues:function(){var d={};var c=true;for(var a in this.fields){if(this.fields[a].isDirty()){var b=this.fields[a].getValue();Sage.Platform.Mobile.Utility.setValue(d,a,b);c=false}}return c?false:d},createEntryForUpdate:function(a){return Ext.apply(a,{"$key":this.entry["$key"],"$etag":this.entry["$etag"],"$name":this.entry["$name"]})},save:function(){if(this.busy){return}var a=this.getValues();if(a){this.busy=true;this.el.addClass("view-busy");if(App.tbar){App.tbar.el.addClass("toolbar-busy")}var c=this.createEntryForUpdate(a);var b=this.createRequest();if(b){b.update(c,{success:function(d){this.busy=false;this.el.removeClass("view-busy");if(App.tbar){App.tbar.el.removeClass("toolbar-busy")}App.fireEvent("refresh",{resourceKind:this.resourceKind,key:d["$key"],data:{"$descriptor":d["$descriptor"]}});ReUI.back()},failure:function(d,e){this.busy=false;this.el.removeClass("view-busy");if(App.tbar){App.tbar.el.removeClass("toolbar-busy")}},scope:this})}}else{ReUI.back()}},transitionTo:function(){Sage.Platform.Mobile.Edit.superclass.transitionTo.call(this);if(this.isNewContext()){this.setValues(this.entry)}},clear:function(){}});Ext.namespace("Sage.Platform.Mobile");Sage.Platform.Mobile.Format=(function(){function c(d){if(typeof d!=="string"){return !d}return(d.length<=0)}function a(d){if(typeof d!=="string"){return d}return d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function b(d){if(typeof d!=="string"){return d}return d.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"')}return{encode:a,isEmpty:c,link:function(d){if(typeof d!=="string"){return d}return String.format('<a target="_blank" href="http://{0}">{0}</a>',d)},mail:function(d){if(typeof d!=="string"){return d}return String.format('<a href="mailto:{0}">{0}</a>',d)},trim:function(d){return d.replace(/^\s+|\s+$/g,"")}}})();Ext.namespace("Sage.Platform.Mobile");Sage.Platform.Mobile.Toolbar=Ext.extend(Ext.util.Observable,{barTemplate:new Simplate(['<div class="{%= cls %}">','<h1 id="pageTitle">{%= title %}</h1>','<a id="backButton" class="button" href="#"></a>',"</div>"]),constructor:function(a){Sage.Platform.Mobile.Toolbar.superclass.constructor.call(this);Ext.apply(this,a,{cls:"toolbar",title:"Mobile"})},render:function(){this.el=Ext.DomHelper.append(Ext.getBody(),this.barTemplate.apply(this),true)},getToolEl:function(a){return this.el},init:function(){this.render()},clear:function(){},show:function(){this.el.show()},hide:function(){this.el.hide()},make:function(b){var a={};for(var c in b){if(c!=="fn"&&typeof b[c]==="function"){a[c]=b[c].call(b.scope||this)}else{a[c]=b[c]}}return a},display:function(a){}});Ext.namespace("Sage.Platform.Mobile");Sage.Platform.Mobile.MainToolbar=Ext.extend(Sage.Platform.Mobile.Toolbar,{barTemplate:new Simplate(['<div class="{%= cls %}">','<h1 id="pageTitle">{%= title %}</h1>','<a id="backButton" class="button" href="#"></a>',"</div>"]),toolTemplate:new Simplate(['<a target="_tool" class="{%= cls %}" style="display: {%= $["hidden"] ? "none" : "block" %}"><span>{%= title %}</span></a>',]),constructor:function(a){Sage.Platform.Mobile.MainToolbar.superclass.constructor.apply(this,arguments)},init:function(){Sage.Platform.Mobile.MainToolbar.superclass.init.call(this);this.el.on("click",function(a,b,e){var c=Ext.get(b);var d;if(c.is('a[target="_tool"]')||(d=c.up('a[target="_tool"]'))){a.stopEvent();if(this.tool&&this.tool.fn){this.tool.fn.call(this.tool.scope||this)}}},this)},setTitle:function(a){Ext.get("pageTitle").update(a)},clear:function(){if(this.tool){this.el.child('a[target="_tool"]').remove();this.tool=false}},display:function(b){if(b.length>0){this.tool=Ext.apply({},b[0]);for(var a in this.tool){if(a!=="fn"&&typeof this.tool[a]==="function"){this.tool[a]=this.tool[a].call(this.tool.scope||this)}}this.tool.el=Ext.DomHelper.append(this.el,this.toolTemplate.apply(this.tool),true)}}});Ext.namespace("Sage.Platform.Mobile");Sage.Platform.Mobile.FloatToolbar=Ext.extend(Sage.Platform.Mobile.Toolbar,{barTemplate:new Simplate(['<div class="{%= cls %}" style="visibility: hidden">','<div class="{%= containerCls %}">',"</div>","</div>"]),toolTemplate:new Simplate(['<a target="_tool" href="#{%= $["name"] %}" class="{%= $["cls"] %}" style="display: {%= $["hidden"] ? "none" : "block" %}">','<img src="{%= $["icon"] %}" />','<span>{%= $["title"] %}</span>',"</a>",]),androidFixTemplate:new Simplate(['<a target="_none" href="#" class="android-webkit-fix"></a>']),constructor:function(a){Sage.Platform.Mobile.MainToolbar.superclass.constructor.apply(this,arguments);Ext.apply(this,a,{cls:"toolbar-float",containerCls:"toolbar-float-container"});this.tools={}},render:function(){Sage.Platform.Mobile.FloatToolbar.superclass.render.call(this);this.containerEl=this.el.child("."+this.containerCls)},init:function(){Sage.Platform.Mobile.FloatToolbar.superclass.init.call(this);if(/android/i.test(navigator.userAgent)){var a=false;this.el.on("touchstart",function(c,e,h){var f=Ext.get(e);var g;a=true;if(f.is('a[target="_tool"]')||(g=f.up('a[target="_tool"]'))){var d=(g||f).dom.hash.substring(1);if(this.tools.hasOwnProperty(d)){this.execute(this.tools[d])}}else{if(f.is("."+this.cls)||(g=f.up("."+this.cls))){this.toggle()}}},this);var b=function(c){if(a){if(c.preventBubble){c.preventBubble()}if(c.preventDefault){c.preventDefault()}if(c.stopPropagation){c.stopPropagation()}if(c.stopImmediatePropagation){c.stopImmediatePropagation()}a=false;return false}};Ext.getBody().dom.addEventListener("click",b,true)}else{this.el.on("click",function(c,e,h){var f=Ext.get(e);var g;if(f.is('a[target="_tool"]')||(g=f.up('a[target="_tool"]'))){var d=(g||f).dom.hash.substring(1);if(this.tools.hasOwnProperty(d)){this.execute(this.tools[d])}}else{if(f.is("."+this.cls)||(g=f.up("."+this.cls))){this.toggle()}}},this,{preventDefault:true,stopPropagation:true})}Ext.fly(window).on("scroll",this.onBodyScroll,this,{buffer:125}).on("resize",this.onBodyScroll,this,{buffer:125})},open:function(){this.el.dom.setAttribute("open","open")},close:function(){this.el.dom.removeAttribute("open")},toggle:function(){if(this.el.getAttribute("open")==="open"){this.close()}else{this.open()}},execute:function(a){if(a&&a.fn){a.fn.call(a.scope||this)}},calculateY:function(){var a=window.innerHeight;var b=Ext.getBody().getScroll().top;var c=this.el.getHeight();return(a+b)-c-8},calculateNoVisY:function(){var a=window.innerHeight;var b=Ext.getBody().getScroll().top;return a+b+8},move:function(b,a){if(Ext.isGecko){if(a===false){this.el.setStyle({top:String.format("{0}px",b)})}else{this.el.shift({y:b,easing:"easeBothStrong",duration:0.5,stopFx:true,callback:function(){this.el.setStyle({right:"0px",left:"auto"})},scope:this})}}else{if(a===false){this.el.setStyle({"-webkit-transition-property":"none","-moz-transition-property":"none","transition-property":"none"})}else{this.el.setStyle({"-webkit-transition-property":"inherit","-moz-transition-property":"inherit","transition-property":"inherit"})}this.el.setStyle({"-webkit-transform":String.format("translateY({0}px)",b)})}},onBodyScroll:function(a,b,c){this.move(this.calculateY())},getToolEl:function(a){if(this.tools[a]&&this.tools[a].el){return this.tools[a].el}return null},clear:function(){this.el.hide();this.containerEl.update("")},display:function(e){if(e.length>0){var d=[];var c=0;for(var b=0;b<e.length;b++){var a=this.make(e[b]);a.el=Ext.DomHelper.append(this.containerEl,this.toolTemplate.apply(a),true);this.tools[a.name]=a}this.move(this.calculateNoVisY(),false);this.el.show();this.move(this.calculateY())}}});Ext.namespace("Sage.Platform.Mobile");Sage.Platform.Mobile.Utility=(function(){var b={};var a=function(d){if(typeof d!=="string"){return[]}if(b[d]){return b[d]}var g=d.split(".");var f=[];for(var e=0;e<g.length;e++){var c=g[e].match(/([a-zA-Z0-9_]+)\[([^\]]+)\]/);if(c){f.push(c[1]);if(/^\d+$/.test(c[2])){f.push(parseInt(c[2]))}else{f.push(c[2])}}else{f.push(g[e])}}return(b[d]=f.reverse())};return{getValue:function(g,c){var f=a(c).slice(0);var e=g;while(e&&f.length>0){var d=f.pop();if(e[d]){e=e[d]}else{return null}}return e},setValue:function(i,c,h){var g=i;var f=a(c).slice(0);while((typeof g!=="undefined")&&f.length>1){var d=f.pop();if(f.length>0){var e=f[f.length-1];g=g[d]=(typeof g[d]!=="undefined")?g[d]:(typeof e==="number")?[]:{}}}if(typeof f[0]!=="undefined"){g[f[0]]=h}return i}}})();