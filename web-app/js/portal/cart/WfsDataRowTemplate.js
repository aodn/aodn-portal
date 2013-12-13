/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.WfsDataRowTemplate = Ext.extend(Portal.cart.NoDataRowTemplate, {

    getDataFilterEntry: function(values) {
        if (this._cql(values.wmsLayer)) {
            return String.format('<b>{0}</b> <code>{1}</code>', OpenLayers.i18n('filterLabel'), this._cql(values.wmsLayer));
        }
        return '';
    },

    createMenuItems: function (collection) {
        var menuItems = [
            this._createMenuItem('downloadAsCsvLabel', collection, 'csv'),
            this._createMenuItem('downloadAsGml3Label', collection, 'gml3'),
            this._createMenuItem('downloadAsShapefileLabel', collection, 'shape-zip', 'zip')
        ];

        if (collection.wmsLayer.urlDownloadFieldName) {
            menuItems.push({text: OpenLayers.i18n('downloadAsUrlsLabel'), handler: this._urlListDownloadHandler(collection), scope: this});
        }

        return menuItems;
    },

    _createMenuItem: function(translationKey, collection, format, extension) {
        return {
            text: OpenLayers.i18n(translationKey),
            handler: this._downloadWfsHandler(collection, (extension || format)),
            scope: this
        }
    },

    _cql: function(wmsLayer) {
        return wmsLayer.getDownloadFilter();
    },

    _downloadWfsHandler: function (collection, format) {
        return this.downloadWithConfirmation(this._downloadUrl(collection.wmsLayer, format), String.format("{0}.{1}", collection.title, format));
    },

    _urlListDownloadHandler: function (collection) {
        var additionalArgs = {
            action: 'urlList',
            layerId: collection.wmsLayer.grailsLayerId
        };
        return this.downloadWithConfirmation(this._downloadUrl(collection.wmsLayer, 'csv'), String.format("{0}_URLs.txt", collection.title), additionalArgs);
    },

    _downloadUrl: function(layer, format) {
        return layer.getWfsLayerFeatureRequestUrl(format);
    }
});
