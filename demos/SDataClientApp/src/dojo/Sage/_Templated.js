dojo.provide('Sage._Templated');
dojo.require('dijit._Templated');

(function(){
    dojo.declare('Sage._Templated', dijit._Templated, {
        buildRendering: function() {
            if (this.domNode && !this.template) return;

            var root = dojo._toDom(['<div>',this.template.apply(this),'</div>'].join(''));

            if (this.widgetsInTemplate)
            {
                this._startupWidgets = dojo.parser.parse(root, {
                    noStart: !this._earlyTemplatedStartup,
                    inherited: {dir: this.dir, lang: this.lang}
                });

                this._supportingWidgets = dijit.findWidgets(root);

                this._attachTemplateNodes(this._startupWidgets, function(n,p){
                    return n[p];
                });
            }

            // todo: fix assumption that there is only one root node if it's a widget

            var nodes = [];

            while (root.firstChild)
                nodes.push(root.removeChild(root.firstChild));

            if (root.parentNode)
                root.parentNode.removeChild(root);

            var node = nodes[0];

            if (this.domNode)
            {
                dojo.place(node, this.domNode, 'before');
                this.destroyDescendants();
                dojo.destroy(this.domNode);
            }

            this.domNode = node;

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