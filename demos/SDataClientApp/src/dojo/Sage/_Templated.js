dojo.provide('Sage._Templated');
dojo.require('dijit._Templated');

(function(){
    dojo.declare('Sage._Templated', dijit._Templated, {
        buildRendering: function() {
            if (this.domNode && !this.template) return;

            var node = dojo._toDom(this.template.apply(this));
            if (node.nodeType !== 1) throw new Error('Invalid template.');

            this.domNode = node;

            if(this.widgetsInTemplate){
				// Make sure dojoType is used for parsing widgets in template.
				// The dojo.parser.query could be changed from multiversion support.
				var parser = dojo.parser, qry, attr;
				if(parser._query != "[dojoType]"){
					qry = parser._query;
					attr = parser._attrName;
					parser._query = "[dojoType]";
					parser._attrName = "dojoType";
				}

				// Store widgets that we need to start at a later point in time
				var cw = (this._startupWidgets = dojo.parser.parse(node, {
					noStart: !this._earlyTemplatedStartup,
					inherited: {dir: this.dir, lang: this.lang}
				}));

				// Restore the query.
				if(qry){
					parser._query = qry;
					parser._attrName = attr;
				}

				this._supportingWidgets = dijit.findWidgets(node);

				this._attachTemplateNodes(cw, function(n,p){
					return n[p];
				});
			}

            this._fillContent(this.srcNodeRef);
        },
        render: function(){
            this.buildRendering();
        },
        startup: function() {
            dojo.forEach(this._startupWidgets, function(w){
                if(w && !w._started && w.startup){
                    w.startup();
                }
            });
            this.inherited(arguments);
        }
    });
})();