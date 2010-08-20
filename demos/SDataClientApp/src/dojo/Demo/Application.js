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

        },
        setService: function(service) {
            this.service = service;
            this.onServiceChanged(service);
        },
        getService: function() {
            return this.service;
        },
        // event
        onServiceChanged: function(service) {
        }
    });
})();

App = new Demo.Application();
