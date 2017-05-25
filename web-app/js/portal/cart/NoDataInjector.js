Ext.namespace('Portal.cart');

Portal.cart.NoDataInjector = Ext.extend(Portal.cart.BaseInjector, {

    constructor: function(config) {
        Portal.cart.NoDataInjector.superclass.constructor.call(this, Ext.apply(this, config));
    },

    //although they won't do anything we need to set up the filters
    // so they don't cause problems in places where they are expectedd
    _getDataFilterEntry: function(dataCollection) {

        var describer = new Portal.filter.combiner.HumanReadableFilterDescriber({
            filters: dataCollection.getFilters()
        });

        return describer.buildDescription('<br />') || "";
    },

    getInjectionJson: function(dataCollection) {
        var injectionJson = Portal.cart.NoDataInjector.superclass.getInjectionJson(dataCollection);
        //you'd think _getDataFilterEntry would have been called in the previous line,
        // but alas the superclass method calls it's own version of _getDataFilterEntry
        injectionJson.dataFilters = this._getDataFilterEntry(dataCollection);
        injectionJson.errorMessage = OpenLayers.i18n('noDataMessage');
        return injectionJson;
    },

    _getDataMarkup: function() {
        return '';
    }
});
