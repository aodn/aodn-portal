Ext.namespace('Portal.cart');

Portal.cart.AlaWmsInjector = Ext.extend(Portal.cart.BaseInjector, {

    _getDataFilterEntry: function(collection) {

        var describer = new Portal.filter.combiner.HumanReadableFilterDescriber({
            filters: collection.getFilters()
        });
        return describer.buildDescription('<br />') || "";
    },

    _checkTaxonFilter: function(collection) {

        var builder = new Portal.filter.combiner.AlaParametersBuilder({
            filters: collection.getFilters()
        });
        return builder.buildParameters().q != undefined;
    },

    getInjectionJson: function(collection) {

        var injectionJson = Portal.cart.AlaWmsInjector.superclass.getInjectionJson(collection);

        // allowing wildcard/empty taxon downloads
/*
        if (!this._checkTaxonFilter(collection) ) {
            injectionJson.errorMessage = OpenLayers.i18n("ALANoFilterText");
        }
*/
        injectionJson.dataFilters = this._getDataFilterEntry(collection);
        return injectionJson;
    }
});
