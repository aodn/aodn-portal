/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.WmsInjector = Ext.extend(Portal.cart.BaseInjector, {

    constructor: function(config) {
        Portal.cart.WmsInjector.superclass.constructor.call(this, Ext.apply(this, config));
     },

    _getDataFilterEntry: function(collection) {

        var layerValues = collection.wmsLayer.getWmsDownloadFilterDescriptions();

        return (layerValues != "") ? layerValues : OpenLayers.i18n('emptyDownloadPlaceholder');
    },

    _getDataMarkup: function(collection) {

        return this._addDownloadEstimate(collection);
    },

    _downloadUrl: function(collection) {

        return this._wmsDownloadUrl(collection, {
            format: OpenLayers.Layer.DOWNLOAD_FORMAT_CSV
        });
    }
});
