/**
 * Created by IntelliJ IDEA.
 * User: Veryth
 * Date: Aug 11, 2010
 * Time: 12:34:37 AM
 * To change this template use File | Settings | File Templates.
 */
dojo.provide('Demo.View');
dojo.require('dijit._Widget');
dojo.require("dijit.form._FormWidget");
dojo.require('Sage._Templated');

(function(){
    dojo.declare('Demo.View', [dijit._Widget, Sage._Templated], {
        widgetsInTemplate: true,
        postCreate: function()
        {
            this.inherited(arguments);
            this.startup();

            if (this.bindings)
            {
                for (var i = 0; i < this.bindings.length; i++)
                {
                    var binding = this.bindings[i];

                    if (this[binding.name] instanceof dijit.form._FormValueWidget)
                        dojo.connect(
                            this[binding.name],
                            binding.event || 'onChange',
                            dojo.hitch(binding.scope || this, binding.target, this[binding.name])
                        );
                }
            }
        }
    });
})();
