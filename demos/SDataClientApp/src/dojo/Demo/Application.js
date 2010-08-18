/**
 * Created by IntelliJ IDEA.
 * User: Veryth
 * Date: Aug 11, 2010
 * Time: 12:34:28 AM
 * To change this template use File | Settings | File Templates.
 */
dojo.provide('Demo.Application');

(function() {
    dojo.declare('Demo.Application', null, {
        constructor: function(o) {
            dojo.mixin(this, o, {
                context: {}
            });
        },
        init: function() {

        }
    });
})();

App = new Demo.Application();
