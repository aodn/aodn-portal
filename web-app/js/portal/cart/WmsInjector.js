Ext.namespace('Portal.cart');

Portal.cart.WmsInjector = Ext.extend(Portal.cart.BaseInjector, {

    _getDataFilterEntry: function(dataCollection) {

        var describer = new Portal.filter.combiner.HumanReadableFilterDescriber({
            filters: dataCollection.getFilters()
        });

        return describer.buildDescription('<br />') || "";
    },

    getInjectionJson: function(collection) {
        var injectionJson = Portal.cart.WmsInjector.superclass.getInjectionJson(collection);

        if ((collection.totalFilteredFeatures != undefined  && collection.totalFilteredFeatures == 0)) {
            injectionJson.errorMessage = OpenLayers.i18n("subsetRestrictiveFiltersText");
        }

        injectionJson.dataFilters = this._getDataFilterEntry(collection);

        return injectionJson;
    }
});
