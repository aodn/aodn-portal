/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Portal.cart');

Portal.cart.WmsInjector = Ext.extend(Portal.cart.BaseInjector, {

    _getDataFilterEntry: function(collection) {

        var describer = new Portal.filter.combiner.HumanReadableFilterDescriber({
            layer: collection.wmsLayer
        });

        var description = describer.buildDescription('<br />');

        return description ? description : OpenLayers.i18n('emptyDownloadPlaceholder');
    }
});
