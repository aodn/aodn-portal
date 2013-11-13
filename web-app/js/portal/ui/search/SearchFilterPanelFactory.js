Ext.namespace('Portal.ui.search');

Portal.ui.search.SearchFilterPanelFactory = Ext.extend(Object, {

    getInstance: function(constructor) {
        // http://stackoverflow.com/questions/3362471/how-can-i-call-a-javascript-constructor-using-call-or-apply
        var args = Array.prototype.slice.call(arguments, 1);
        return function() {

            var Temp = function() {};
            var inst;
            var ret;

            // Give the Temp constructor the Constructor's prototype
            Temp.prototype = constructor.prototype;

            // Create a new instance
            inst = new Temp;

            // Call the original Constructor with the temp
            // instance as its context (i.e. its 'this' value)
            ret = constructor.apply(inst, args);

            // If an object has been returned then return it otherwise
            // return the original instance.
            // (consistent with behaviour of the new operator)
            return Object(ret) === ret ? ret : inst;
        }();
    }
});
