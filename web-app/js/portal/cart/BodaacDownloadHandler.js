/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.BodaacDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    NAME_FIELD_DELIMETER: "#",
    LAYER_NAME_INDEX: 0,
    FIELD_NAME_INDEX: 1,

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: 'downloadAsAllSourceNetCdfLabel',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    filenameFormat: '{0}_source_files.zip',
                    downloadControllerArgs: {
                        action: 'downloadNetCdfFilesForLayer',
                        serverUrl: this._resourceHref(),
                        urlFieldName: this._urlFieldName()
                    }
                }
            });

            downloadOptions.push({
                textKey: 'downloadAsUrlsLabel',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    filenameFormat: '{0}_URLs.txt',
                    downloadControllerArgs: {
                        action: 'urlListForLayer',
                        serverUrl: this._resourceHref(),
                        urlFieldName: this._urlFieldName()
                    }
                }
            });
        }

        return downloadOptions;
    },

    canEstimateDownloadSize: function() {

        return true;
    },

    getDownloadEstimateParams: function(collection) {
        return {
            url: this._getWmsFeatureRequestUrl(collection),
            urlFieldName: this._urlFieldName()
        };
    },

    _hasRequiredInfo: function() {

        return this._resourceHrefNotEmpty() && this._resourceNameNotEmpty() && (this._resourceName().indexOf(this.NAME_FIELD_DELIMETER) > -1);
    },

    _getWmsFeatureRequestUrl: function(collection) {

        var wmsLayer = collection.wmsLayer;

        return wmsLayer._buildGetFeatureRequestUrl(
            this._resourceHref(),
            this._layerName(),
            OpenLayers.Layer.DOWNLOAD_FORMAT_CSV,
            wmsLayer.getMapLayerFilters(true)
        );
    },

    _getUrlGeneratorFunction: function(collection) {

        var _this = this;

        return function(collection) {

            var wmsLayer = collection.wmsLayer;

            return wmsLayer._buildGetFeatureRequestUrl(
                _this._resourceHref(),
                _this._layerName(),
                OpenLayers.Layer.DOWNLOAD_FORMAT_CSV,
                wmsLayer.getMapLayerFilters()
            );
        };
    },

    _layerName: function() {
        return this._valueFromNameField(this.LAYER_NAME_INDEX);
    },

    _urlFieldName: function() {
        return this._valueFromNameField(this.FIELD_NAME_INDEX);
    },

    _valueFromNameField: function(index) {
        return this.onlineResource.name.split(this.NAME_FIELD_DELIMETER)[index];
    }
});
