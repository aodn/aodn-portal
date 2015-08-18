/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.common');

/**
 * Layer descriptor constructs OpenLayers WMS object with parameters from
 * server and geonetwork record
 */
Portal.common.LayerDescriptor = Ext.extend(Object, {

    constructor: function(cfg, titleOverride, dataCollection, openLayerClass) {

        this.openLayerClass = openLayerClass || OpenLayers.Layer.WMS;
        this.dataCollection = dataCollection;

        Ext.apply(this, cfg);

        if (titleOverride) {
            this.title = titleOverride;
        }
    },

    toOpenLayer: function(optionOverrides, paramOverrides) {
        var openLayer = new this.openLayerClass(
            this.title,
            this.server.uri,
            new Portal.ui.openlayers.LayerParams(this, paramOverrides),
            new Portal.ui.openlayers.LayerOptions(this, optionOverrides)
        );
        this._setDomainLayerProperties(openLayer);

        return openLayer;
    },

    /**
     * Refactor.
     */
    _setDomainLayerProperties: function(openLayer) {
        openLayer.server = this.server;
        openLayer.wmsName = this.name;

        this._setOpenLayerBounds(openLayer);
        openLayer.projection = this.projection;
        openLayer.blacklist = this.blacklist;
        openLayer.abstractTrimmed = this.abstractTrimmed;
        openLayer.dimensions = this.dimensions;
        openLayer.params.QUERYABLE = true;
    },

    _setOpenLayerBounds: function(openLayer) {

        if (this.dataCollection) {
            var metadataRecord = this.dataCollection.getMetadataRecord();
            var bounds = metadataRecord.data.bbox.getBounds();

            openLayer.bboxMinX = bounds.left;
            openLayer.bboxMinY = bounds.bottom;
            openLayer.bboxMaxX = bounds.right;
            openLayer.bboxMaxY = bounds.top;
        }
    }
});
