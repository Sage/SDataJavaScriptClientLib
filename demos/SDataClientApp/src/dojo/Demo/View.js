/**
 * Created by IntelliJ IDEA.
 * User: Veryth
 * Date: Aug 11, 2010
 * Time: 12:34:37 AM
 * To change this template use File | Settings | File Templates.
 */
dojo.provide('Demo.View');
dojo.require('dijit.layout._LayoutWidget');
dojo.require('Sage._Templated');

(function(){
    dojo.declare('Demo.View', [dijit.layout._LayoutWidget, Sage._Templated], {
        widgetsInTemplate: true,
        postCreate: function()
        {
            this.inherited(arguments);

            console.log('postCreate');
        }
    });
})();
