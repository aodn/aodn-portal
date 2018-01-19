Ext.namespace('Portal.cart');

Portal.cart.WmsInjector = Ext.extend(Portal.cart.BaseInjector, {

    _getDataFilterEntry: function(dataCollection) {

        var describer = new Portal.filter.combiner.HumanReadableFilterDescriber({
            filters: dataCollection.getFilters()
        });

        return describer.buildDescription('<br />') || "";
    }
});
