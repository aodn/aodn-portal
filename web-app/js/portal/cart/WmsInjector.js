/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.WmsInjector = Ext.extend(Portal.cart.BaseInjector, {

    _getDataFilterEntry: function(dataCollection) {

        var describer = new Portal.filter.combiner.HumanReadableFilterDescriber({
            dataCollection: dataCollection
        });

        var description = describer.buildDescription('<br />');

        return description ? description : OpenLayers.i18n('emptyDownloadPlaceholder');
    }
});
